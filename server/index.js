import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAstrolabe, astrolabeToText } from './chart.js';
import { streamChat, MODEL_LABEL, UserFacingError } from './llm.js';
import { tagToVi, lectureToVi, KB_SIZE } from './knowledge.js';
import { createViFilter } from './vi-filter.js';
import { analyzeChart } from './patterns.js';
import { buildReport } from './report.js';
import { buildChatContext } from './context.js';
import { buildLaSo } from './laso.js';

const PORT = Number(process.env.API_PORT) || 3001;

const app = express();
app.set('trust proxy', true); // chạy sau ngrok/Cloudflare: lấy IP thật của người dùng
app.use(express.json({ limit: '200kb' }));

// ---- Giới hạn chat khi mở công khai (bảo vệ GPU của máy chủ) ----
const CHAT_PER_WINDOW = Number(process.env.CHAT_LIMIT) || 10; // số câu hỏi / IP
const WINDOW_MS = 10 * 60 * 1000; // trong 10 phút
const MAX_CONCURRENT = Number(process.env.CHAT_CONCURRENT) || 2; // số câu trả lời cùng lúc
const hits = new Map();
let running = 0;
function chatGuard(req, res, next) {
  const now = Date.now();
  const ip = req.ip || 'unknown';
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= CHAT_PER_WINDOW) {
    const wait = Math.ceil((WINDOW_MS - (now - list[0])) / 60000);
    return res.status(429).json({ error: `Bạn đã hỏi ${CHAT_PER_WINDOW} câu trong 10 phút. Vui lòng thử lại sau khoảng ${wait} phút.` });
  }
  if (running >= MAX_CONCURRENT) {
    return res.status(429).json({ error: 'Máy chủ đang bận trả lời người khác, bạn thử lại sau ít phút nhé.' });
  }
  list.push(now);
  hits.set(ip, list);
  running++;
  let released = false;
  const release = () => {
    if (!released) {
      released = true;
      running--;
    }
  };
  res.on('finish', release);
  res.on('close', release);
  next();
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, list] of hits) if (!list.some((t) => now - t < WINDOW_MS)) hits.delete(ip);
}, WINDOW_MS).unref();

// Lập lá số → trả văn bản tóm tắt + dữ liệu đầy đủ (để debug / hiển thị)
app.post('/api/chart', (req, res) => {
  try {
    const a = buildAstrolabe(req.body);
    const zh = buildAstrolabe(req.body, 'zh-CN');
    const report = buildReport(a, analyzeChart(zh, a));
    const laSo = buildLaSo(a, { name: String(req.body?.name ?? '').slice(0, 60) });
    res.json({ resolved: a.resolved, text: astrolabeToText(a), report, laSo });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Chat luận giải, trả về văn bản dạng stream
app.post('/api/chat', chatGuard, async (req, res) => {
  const { birth, messages, mode } = req.body ?? {};
  // Chế độ "kỹ" dùng model lớn hơn (chậm hơn nhiều nhưng chính xác hơn)
  const model = mode === 'deep' ? process.env.OLLAMA_MODEL_DEEP || 'qwen3:8b' : undefined;

  let astrolabe, chartText;
  try {
    astrolabe = buildAstrolabe(birth);
    chartText = astrolabeToText(astrolabe);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const history = Array.isArray(messages)
    ? messages
        .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
        .slice(-20)
        .map((m) => ({ role: m.role, content: m.content }))
    : [];
  if (!history.length || history.at(-1).role !== 'user') {
    return res.status(400).json({ error: 'Thiếu câu hỏi.' });
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');

  const abort = new AbortController();
  res.on('close', () => abort.abort());

  // Dữ liệu cho AI: cách cục, tinh hệ, từ điển sao, câu luận Nghê Hải Hạ, dự đoán từng năm
  const { system, kb } = buildChatContext(astrolabe, history.at(-1).content);
  // Danh sách tham khảo hiển thị dưới câu trả lời (toàn bộ bằng tiếng Việt)
  const sources = [];
  for (const q of kb.quotes) {
    const topic = tagToVi(q.tag);
    if (!topic || sources.some((s) => s.topic === topic)) continue;
    sources.push({ topic, lecture: lectureToVi(q.lecture), time: q.time, url: q.url });
    if (sources.length >= 8) break;
  }
  res.setHeader('X-Sources', encodeURIComponent(JSON.stringify(sources)));

  // Nhắc lại yêu cầu tiếng Việt ngay trong câu hỏi cuối (model nhỏ nghe theo phần cuối tốt hơn)
  const modelMessages = history.map((m, i) =>
    i === history.length - 1
      ? { ...m, content: `${m.content}\n\n(Hãy trả lời hoàn toàn bằng tiếng Việt, không viết chữ Hán.)` }
      : m,
  );

  const filter = createViFilter((text) => res.write(text));
  try {
    const note = await streamChat({
      system,
      messages: modelMessages,
      model,
      onText: (delta) => filter.push(delta),
      signal: abort.signal,
    });
    filter.end();
    res.end(note);
  } catch (err) {
    if (abort.signal.aborted || res.writableEnded) return;
    if (!(err instanceof UserFacingError)) console.error(err);
    res.end(`\n\n⚠️ ${err instanceof UserFacingError ? err.message : 'Lỗi khi gọi AI.'}`);
  }
});

// Production: phục vụ bản build của Vite
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
app.use(express.static(dist));
app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));

app.listen(PORT, () => console.log(`API server: http://localhost:${PORT} — AI: ${MODEL_LABEL} — kho Nghê Hải Hạ: ${KB_SIZE} câu`));
