import Anthropic from '@anthropic-ai/sdk';

// Chọn AI: "ollama" (chạy local, mặc định) hoặc "claude" (Claude API, cần key)
export const PROVIDER = (process.env.LLM_PROVIDER || 'ollama').toLowerCase();
const OLLAMA_URL = (process.env.OLLAMA_URL || 'http://localhost:11434').replace(/\/$/, '');
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b';
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-opus-5-5';

export const MODEL_LABEL = PROVIDER === 'claude' ? `claude (${CLAUDE_MODEL})` : `ollama (${OLLAMA_MODEL})`;

export class UserFacingError extends Error {}

/**
 * Gọi AI dạng stream. onText(delta) được gọi cho mỗi đoạn chữ.
 * Trả về ghi chú thêm vào cuối câu trả lời (nếu có).
 */
export async function streamChat({ system, messages, onText, signal, model }) {
  return PROVIDER === 'claude'
    ? streamClaude({ system, messages, onText, signal })
    : streamOllama({ system, messages, onText, signal, model });
}

// ---------- Ollama (local) ----------
// Model có chế độ suy nghĩ (Qwen3, DeepSeek-R1…): bật "think" để model lập luận trước khi trả lời.
// Phần suy nghĩ Ollama trả riêng trong message.thinking — không hiển thị cho người dùng.
const supportsThinking = (m) => /qwen3|deepseek-r1|gpt-oss/i.test(m);
// Mặc định TẮT (trả lời nhanh hơn). Đặt OLLAMA_THINK=true trong .env để bật.
const THINK = process.env.OLLAMA_THINK === 'true';

async function streamOllama({ system, messages, onText, signal, model = OLLAMA_MODEL }) {
  const think = THINK && supportsThinking(model);
  let res;
  try {
    res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({
        model,
        stream: true,
        ...(supportsThinking(model) ? { think } : {}),
        messages: [{ role: 'system', content: system }, ...messages],
        // lá số (~3k token) + cách cục, kiến thức sao, câu luận (~5k) + câu trả lời dài → cần ngữ cảnh ~16k
        // num_predict tính cả phần suy nghĩ nên để rộng hơn khi bật think
        options: { temperature: 0.5, num_ctx: 16384, num_predict: think ? 7000 : 2500 },
        keep_alive: '30m',
      }),
    });
  } catch (err) {
    if (signal?.aborted) throw err;
    throw new UserFacingError(`Không kết nối được Ollama ở ${OLLAMA_URL}. Hãy mở ứng dụng Ollama rồi thử lại.`);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    if (res.status === 404) {
      throw new UserFacingError(`Chưa có model "${model}". Chạy lệnh: ollama pull ${model}`);
    }
    throw new UserFacingError(`Ollama báo lỗi (${res.status}): ${body.slice(0, 200)}`);
  }

  // Ollama trả về NDJSON: mỗi dòng là một JSON { message: { content }, done }
  const decoder = new TextDecoder();
  let buf = '';
  let last;
  // Phòng khi model trả suy nghĩ lẫn trong nội dung dạng <think>…</think>: bỏ phần đó
  let inThink = false;
  let pending = '';
  const emit = (text) => {
    pending += text;
    let out = '';
    for (;;) {
      if (inThink) {
        const end = pending.indexOf('</think>');
        if (end < 0) { pending = pending.slice(-8); return out && onText(out); }
        pending = pending.slice(end + 8).replace(/^\s+/, '');
        inThink = false;
      } else {
        const start = pending.indexOf('<think>');
        if (start < 0) {
          const keep = pending.lastIndexOf('<');
          const safe = keep >= 0 && pending.length - keep < 7 ? keep : pending.length;
          out += pending.slice(0, safe);
          pending = pending.slice(safe);
          return out && onText(out);
        }
        out += pending.slice(0, start);
        pending = pending.slice(start + 7);
        inThink = true;
      }
    }
  };
  for await (const chunk of res.body) {
    buf += decoder.decode(chunk, { stream: true });
    let nl;
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      const data = JSON.parse(line);
      if (data.error) throw new UserFacingError(`Ollama báo lỗi: ${data.error}`);
      if (data.message?.content) emit(data.message.content);
      if (data.done) last = data;
    }
  }
  if (!inThink && pending) onText(pending);
  return last?.done_reason === 'length' ? '\n\n_(Câu trả lời bị cắt vì quá dài.)_' : '';
}

// ---------- Claude API ----------
let client;
async function streamClaude({ system, messages, onText, signal }) {
  if (!process.env.ANTHROPIC_API_KEY?.trim() && !process.env.ANTHROPIC_AUTH_TOKEN?.trim()) {
    throw new UserFacingError('Chưa có ANTHROPIC_API_KEY trong file .env (hoặc đổi LLM_PROVIDER=ollama để chạy local).');
  }
  client ??= new Anthropic({ timeout: 120_000 });

  try {
    const stream = client.beta.messages.stream(
      {
        model: CLAUDE_MODEL,
        max_tokens: 16000,
        system,
        messages,
        output_config: { effort: 'medium' },
        // Nếu bộ lọc an toàn từ chối, server tự chuyển sang model dự phòng phù hợp
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
      },
      { signal },
    );
    stream.on('text', onText);
    const final = await stream.finalMessage();
    if (final.stop_reason === 'refusal') return '\n\n_(Xin lỗi, mình không thể trả lời câu hỏi này.)_';
    if (final.stop_reason === 'max_tokens') return '\n\n_(Câu trả lời bị cắt vì quá dài.)_';
    return '';
  } catch (err) {
    if (signal?.aborted) throw err;
    if (err instanceof Anthropic.AuthenticationError) throw new UserFacingError('ANTHROPIC_API_KEY không hợp lệ.');
    if (err instanceof Anthropic.RateLimitError) throw new UserFacingError('Đang bị giới hạn tốc độ, thử lại sau ít phút.');
    if (err instanceof Anthropic.APIConnectionError) throw new UserFacingError('Không kết nối được tới Claude API.');
    if (err instanceof Anthropic.APIError) throw new UserFacingError(`Lỗi Claude API (${err.status}): ${err.message}`);
    throw err;
  }
}
