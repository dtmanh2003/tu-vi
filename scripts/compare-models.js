// So sánh câu trả lời của nhiều model Ollama trên cùng lá số và câu hỏi (dùng đúng prompt của server).
//   node scripts/compare-models.js qwen2.5:7b qwen3:8b
//   Q="Năm tới tôi có biến động gì?" node scripts/compare-models.js qwen3:8b
import 'dotenv/config';
import { buildAstrolabe } from '../server/chart.js';
import { buildChatContext } from '../server/context.js';
import { streamChat } from '../server/llm.js';
import { createViFilter } from '../server/vi-filter.js';

const models = process.argv.slice(2);
const birth = JSON.parse(process.env.BIRTH || '{"date":"2000-8-16","time":"04:10","gender":"male","place":"Hà Nội"}');
const question = process.env.Q || 'Tôi hợp với công việc, ngành nghề nào?';

const vi = buildAstrolabe(birth);
const { system } = buildChatContext(vi, question);
const messages = [{ role: 'user', content: `${question}\n\n(Hãy trả lời hoàn toàn bằng tiếng Việt, không viết chữ Hán.)` }];

for (const model of models) {
  let out = '';
  let first;
  const t0 = Date.now();
  const f = createViFilter((t) => (out += t));
  await streamChat({ system, messages, model, onText: (d) => { first ??= Date.now(); f.push(d); } });
  f.end();
  console.log(`\n========== ${model} — chữ đầu tiên sau ${((first - t0) / 1000).toFixed(1)}s, tổng ${((Date.now() - t0) / 1000).toFixed(1)}s, ${out.split(/\s+/).length} từ ==========\n${out}`);
}
