// Tra cứu câu luận của Nghê Hải Hạ (《天纪·紫微斗数》) liên quan đến lá số và câu hỏi.
// Dữ liệu: data/tianji.json (tạo bằng `npm run kb`), giấy phép CC BY-NC-SA 4.0, chỉ dùng phi thương mại.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { astro } from 'iztro';

const DATA_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'tianji.json');

let QUOTES = [];
try {
  QUOTES = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
} catch {
  console.warn('Chưa có data/tianji.json, chatbot sẽ chạy không có kho Nghê Hải Hạ (chạy `npm run kb` để tạo).');
}
export const KB_SIZE = QUOTES.length;

// Nhãn chủ đề tiếng Việt (dịch tay trong data/tags.vi.json)
let TAGS_VI = {};
try {
  TAGS_VI = JSON.parse(fs.readFileSync(path.join(path.dirname(DATA_FILE), 'tags.vi.json'), 'utf8'));
} catch {}

/** "主星 › 破军（北斗 · 杀星） · 性情" → "Chính tinh › Phá Quân (Bắc Đẩu · sát tinh) · Tính cách" */
export function tagToVi(tag) {
  if (!tag) return '';
  return tag
    .split(/( › | · )/)
    .map((part) => (part === ' › ' || part === ' · ' ? part : TAGS_VI[part] ?? ''))
    .join('')
    .replace(/( › | · )+$/g, '')
    .replace(/^( › | · )+/g, '');
}

/** "10上" → "Bài 10, phần trên"; "19上_补充1" → "Bài 19, phần trên (bổ sung 1)" */
export function lectureToVi(lecture) {
  const m = /^(\d+)(上|下)(?:_补充(\d+))?$/.exec(lecture || '');
  if (!m) return 'Bài giảng';
  return `Bài ${m[1]}, phần ${m[2] === '上' ? 'trên' : 'dưới'}${m[3] ? ` (bổ sung ${m[3]})` : ''}`;
}

// Tên cung tiếng Trung trong iztro → các cách gọi trong bài giảng
const PALACE_ALIASES = {
  命宫: ['命宫', '命'],
  兄弟: ['兄弟'],
  夫妻: ['夫妻'],
  子女: ['子女'],
  财帛: ['财帛'],
  疾厄: ['疾厄'],
  迁移: ['迁移'],
  仆役: ['仆役', '交友', '奴仆'],
  官禄: ['官禄', '事业'],
  田宅: ['田宅'],
  福德: ['福德'],
  父母: ['父母'],
};

// Chủ đề câu hỏi (tiếng Việt, đã bỏ dấu) → cung cần xem
const TOPICS = [
  { re: /su nghiep|cong viec|nghe|lam an|kinh doanh|thang tien|quan loc|hoc hanh|thi cu/, palaces: ['官禄'] },
  { re: /tien|tai chinh|tai bach|giau|thu nhap|dau tu/, palaces: ['财帛'] },
  { re: /tinh duyen|tinh yeu|vo|chong|hon nhan|ket hon|nguoi yeu|phu the|cuoi/, palaces: ['夫妻'] },
  { re: /con cai|con chau|tu nu|sinh con/, palaces: ['子女'] },
  { re: /suc khoe|benh|tat ach|om dau/, palaces: ['疾厄'] },
  { re: /cha me|bo me|phu mau/, palaces: ['父母'] },
  { re: /anh em|huynh de|chi em/, palaces: ['兄弟'] },
  { re: /ban be|dong nghiep|giao huu|no boc|cap duoi/, palaces: ['仆役'] },
  { re: /nha cua|dat dai|dien trach|bat dong san/, palaces: ['田宅'] },
  { re: /phuc duc|tinh than|huong thu|tam linh/, palaces: ['福德'] },
  { re: /di xa|xuat ngoai|thien di|di chuyen|o xa/, palaces: ['迁移'] },
];
const TIMING_RE = /\b(nam nay|nam sau|van han|dai han|luu nien|thoi gian toi|sap toi)\b/;
const OVERVIEW_RE = /\b(tong quan|tong quat|tong the|ca doi|cuoc doi|toan bo|chi tiet la so|xem la so)\b/;
// Chỉ khớp nguyên từ (tránh "với" → "voi" khớp nhầm "vo" = vợ)
for (const t of TOPICS) t.re = new RegExp(`\\b(${t.re.source})\\b`);

const stripVi = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');

const OPPOSITE = (i) => (i + 6) % 12;
const TRINE = (i) => [(i + 4) % 12, (i + 8) % 12];

/** Lập lá số bản tiếng Trung (cùng thứ tự cung/sao với bản tiếng Việt) để khớp tên với bài giảng. */
function buildZh(vi) {
  const r = vi.resolved;
  return astro.bySolar(r.iztroDate, r.timeIndex, r.gender, true, 'zh-CN');
}

/**
 * Chọn các câu luận liên quan.
 * vi: lá số tiếng Việt (đã lập), birth: thông tin sinh, question: câu hỏi mới nhất.
 */
export function retrieveQuotes({ vi, question, limit = 14 }) {
  const zh = buildZh(vi);
  const q = stripVi(question || '');

  // 1. Cung trọng tâm theo câu hỏi (mặc định: Mệnh)
  const timing = TIMING_RE.test(q);
  const overview = OVERVIEW_RE.test(q);
  const topicPalaces = new Set(TOPICS.filter((t) => t.re.test(q)).flatMap((t) => t.palaces));
  // Câu hỏi tổng quan: xem các cung chính của đời người
  if (overview) ['命宫', '财帛', '官禄', '夫妻', '福德'].forEach((n) => topicPalaces.add(n));
  const mainIdx = new Set();
  zh.palaces.forEach((p, i) => topicPalaces.has(p.name) && mainIdx.add(i));
  // Hỏi về năm nay / vận hạn: xem thêm cung lưu niên và cung đại hạn hiện tại
  if (timing) {
    try {
      const h = vi.horoscope(new Date());
      [h.yearly.index, h.decadal.index].forEach((i) => mainIdx.add(i));
    } catch {}
  }
  if (!mainIdx.size) {
    topicPalaces.add('命宫');
    zh.palaces.forEach((p, i) => p.name === '命宫' && mainIdx.add(i));
  }
  const focusIdx = new Set();
  for (const i of mainIdx) [i, OPPOSITE(i), ...TRINE(i)].forEach((j) => focusIdx.add(j));

  // Gợi ý cung cần xem (tiếng Việt) để model nhỏ không chọn nhầm cung
  const fmt = (s) => s.name + (s.brightness ? ` (${s.brightness})` : '') + (s.mutagen ? ` hóa ${s.mutagen}` : '');
  const describe = (i) => {
    const p = vi.palaces[i];
    const major = p.majorStars.length ? p.majorStars.map(fmt).join(', ') : 'Vô chính diệu';
    const minor = p.minorStars.map(fmt).join(', ');
    return `cung ${p.name}: ${major}${minor ? ' | phụ tinh: ' + minor : ''} | đại hạn đi qua cung này: ${p.decadal.range[0]}–${p.decadal.range[1]} tuổi`;
  };
  const focus = [...mainIdx].map((i) => ({
    palace: vi.palaces[i].name,
    opposite: vi.palaces[OPPOSITE(i)].name,
    trine: TRINE(i).map((j) => vi.palaces[j].name),
    lines: [i, OPPOSITE(i), ...TRINE(i)].map(describe),
  }));
  // Đại hạn hiện tại (ghi thẳng để model nhỏ không tính nhầm)
  try {
    const h = vi.horoscope(new Date());
    const p = vi.palaces[h.decadal.index];
    focus.current = `Hiện tại ${h.age.nominalAge} tuổi âm, đang ở đại hạn cung ${p.name} (${p.decadal.range[0]}–${p.decadal.range[1]} tuổi).`;
  } catch {}
  if (!QUOTES.length) return { quotes: [], glossary: [], focus, focusIdx: [...focusIdx], zh };

  // 2. Từ khóa: tên cung, sao trong các cung trọng tâm, tứ hóa
  const palaceTerms = [...topicPalaces].flatMap((n) => PALACE_ALIASES[n] ?? [n]).filter((t) => t.length > 1);
  const starWeight = new Map(); // tên sao (zh) → trọng số
  const glossary = new Map(); // zh → vi
  for (const i of focusIdx) {
    const isMain = mainIdx.has(i);
    const pz = zh.palaces[i];
    const pv = vi.palaces[i];
    glossary.set(pz.name, pv.name);
    const groups = [
      [pz.majorStars, pv.majorStars, isMain ? 3 : 1.5],
      [pz.minorStars, pv.minorStars, isMain ? 1.5 : 0.75],
    ];
    for (const [zs, vs, w] of groups) {
      zs.forEach((s, k) => {
        starWeight.set(s.name, Math.max(starWeight.get(s.name) ?? 0, w));
        glossary.set(s.name, vs[k]?.name);
        if (s.mutagen) {
          starWeight.set(`化${s.mutagen}`, Math.max(starWeight.get(`化${s.mutagen}`) ?? 0, w * 0.6));
          starWeight.set(`${s.name}化${s.mutagen}`, w * 1.5);
        }
      });
    }
  }

  // 3. Chấm điểm từng câu
  const scored = [];
  for (const item of QUOTES) {
    const hay = item.text + ' ' + item.tag;
    let score = 0;
    let starHit = false;
    for (const [term, w] of starWeight) {
      if (hay.includes(term)) {
        score += w;
        starHit = true;
      }
    }
    const palaceHit = palaceTerms.some((t) => hay.includes(t));
    if (palaceHit) score += 1.5;
    if (starHit && palaceHit) score += 2;
    if (timing && /流年|大限|流月|斗君/.test(hay)) score += 1.5;

    // Nhãn chủ đề: câu thuộc mục "十二宫 › X宫" hoặc "主星 › Y"
    const tagPalace = item.tag.match(/十二宫 › (\S+?)宫/)?.[1];
    if (tagPalace) score = palaceTerms.includes(tagPalace) ? score + 3 : score * 0.3;
    const tagStar = item.tag.match(/主星 › ([^（\s]+)/)?.[1];
    if (tagStar && starWeight.get(tagStar) >= 1.5) score += 2;
    // Câu nhắc tới cung khác (mà không phải cung đang hỏi) thì giảm điểm
    if (!palaceHit && /(夫妻|子女|财帛|疾厄|迁移|仆役|交友|官禄|事业|田宅|福德|父母|兄弟)宫/.test(item.text)) score *= 0.5;
    if (score > 0) scored.push({ item, score: score / Math.sqrt(1 + item.text.length / 80) });
  }
  scored.sort((a, b) => b.score - a.score);

  // 4. Lấy top, tránh trùng lặp và giới hạn độ dài
  const picked = [];
  let chars = 0;
  for (const { item } of scored) {
    if (picked.length >= limit || chars > 2200) break;
    if (picked.some((p) => p.text === item.text)) continue;
    picked.push(item);
    chars += item.text.length;
  }

  return {
    overview,
    timing,
    focus,
    focusIdx: [...mainIdx, ...[...focusIdx].filter((i) => !mainIdx.has(i))],
    zh,
    quotes: picked,
    glossary: [...glossary].filter(([, v]) => v).map(([z, v]) => `${z} = ${v}`),
  };
}
