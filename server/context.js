// Gom toàn bộ dữ liệu đưa cho AI cho một câu hỏi: lá số, cách cục, tinh hệ, từ điển sao,
// câu luận Nghê Hải Hạ, dự đoán từng năm → system prompt. Dùng chung cho server và script so sánh.
import { astrolabeToText } from './chart.js';
import { retrieveQuotes } from './knowledge.js';
import { analyzeChart, analysisToText } from './patterns.js';
import { starKnowledge } from './star-dict.js';
import { findTinhHe } from './tinh-he.js';
import { forecastYears, forecastToText } from './yearly.js';
import { buildSystemPrompt } from './prompt.js';

const FIELD = { Mệnh: 'menh', 'Quan Lộc': 'quan', 'Tài Bạch': 'tai', 'Phu Thê': 'phu' };

export function buildChatContext(astrolabe, question) {
  const chartText = astrolabeToText(astrolabe);
  let kb = { quotes: [], glossary: [], focus: [] };
  let analysisText = '';
  let starText = '';
  let patternTitles = [];
  let forecastText = '';
  try {
    kb = retrieveQuotes({ vi: astrolabe, question });
    const an = analyzeChart(kb.zh, astrolabe);
    analysisText = analysisToText(an);
    patternTitles = an.patterns.map((p) => p.title);
    starText = starKnowledge(astrolabe, kb.focusIdx);

    // Lời luận tổ hợp sao (tinh hệ) cho các cung liên quan
    const thLines = [];
    for (const i of kb.focusIdx) {
      const p = astrolabe.palaces[i];
      const src = p.majorStars.length ? p : astrolabe.palaces[(i + 6) % 12];
      const th = findTinhHe(src);
      if (!th) continue;
      const f = FIELD[p.name] ?? 'menh';
      thLines.push(`- Cung ${p.name}${src !== p ? ` (vô chính diệu, mượn ${src.name})` : ''} — tổ hợp ${th.key}: ${th[f] ?? th.menh}`);
    }
    if (thLines.length) starText = `LỜI LUẬN THEO TỔ HỢP SAO (tinh hệ — ưu tiên dùng):\n${thLines.join('\n')}\n\n${starText}`;
    forecastText = forecastToText(forecastYears(astrolabe));
  } catch (err) {
    console.error('Lỗi chuẩn bị dữ liệu cho AI:', err);
  }
  const system = buildSystemPrompt({ chartText, analysisText, starText, kb, patternTitles, forecastText });
  return { system, kb };
}
