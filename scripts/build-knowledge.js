// Chuyển các câu luận Nghê Hải Hạ (references/ziwei-doushu/docs/tianji-ziwei/*.md)
// thành data/tianji.json để server tra cứu.
// Nguồn: https://github.com/Renhuai123/ziwei-doushu — giấy phép CC BY-NC-SA 4.0 (chỉ dùng phi thương mại).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'references', 'ziwei-doushu', 'docs', 'tianji-ziwei');
const outFile = path.join(root, 'data', 'tianji.json');

if (!fs.existsSync(srcDir)) {
  console.error(`Không thấy ${srcDir}.\nHãy tải trước: git clone --depth 1 https://github.com/Renhuai123/ziwei-doushu.git references/ziwei-doushu`);
  process.exit(1);
}

// - [00:00:17](url) 「câu nói」　<sub>nhãn chủ đề</sub>
const HEAD = /^- \[(\d{2}:\d{2}:\d{2})\]\(([^)]+)\)/;
function parseLine(raw) {
  const h = raw.match(HEAD);
  const a = raw.indexOf('「');
  const b = raw.lastIndexOf('」');
  if (!h || a < 0 || b <= a) return null;
  const tag = raw.slice(b).match(/<sub>(.*?)<\/sub>/);
  return [null, h[1], h[2], raw.slice(a + 1, b), tag?.[1]];
}

const quotes = [];
for (const file of fs.readdirSync(srcDir).filter((f) => f.endsWith('.md') && f !== 'README.md' && f !== 'LICENSE.md')) {
  const lecture = file.replace(/\.md$/, '');
  let section = '';
  for (const raw of fs.readFileSync(path.join(srcDir, file), 'utf8').split(/\r?\n/)) {
    if (raw.startsWith('## ')) section = raw.replace(/^##\s*§\d+\s*[\d:]*\s*/, '').trim();
    const m = parseLine(raw);
    if (m) quotes.push({ lecture, time: m[1], url: m[2], text: m[3].trim(), tag: (m[4] || '').trim(), section });
  }
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(quotes));
console.log(`Đã ghi ${quotes.length} câu vào ${path.relative(root, outFile)}`);
