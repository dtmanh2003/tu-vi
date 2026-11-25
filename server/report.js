// Báo cáo luận giải đầy đủ — do code tạo từ dữ liệu, không phụ thuộc AI (luôn cụ thể và đúng lá số).
import { findTinhHe, FIELD_OF_PALACE } from './tinh-he.js';
import { MAJOR, MINOR, MUTAGEN } from './star-dict.js';
import { forecastYears } from './yearly.js';
import { canXuong } from './can-xuong.js';

const ORDER = ['Mệnh', 'Quan Lộc', 'Tài Bạch', 'Phu Thê', 'Phúc Đức', 'Thiên Di', 'Điền Trạch', 'Tật Ách', 'Tử Nữ', 'Phụ Mẫu', 'Huynh Đệ', 'Nô Bộc'];
const PALACE_MEANING = {
  Mệnh: 'tính cách, năng lực, con người bạn',
  'Quan Lộc': 'công việc, sự nghiệp, học hành',
  'Tài Bạch': 'cách kiếm tiền và giữ tiền',
  'Phu Thê': 'tình duyên, người phối ngẫu, hôn nhân',
  'Phúc Đức': 'đời sống tinh thần, phúc phần, hưởng thụ',
  'Thiên Di': 'ra ngoài xã hội, đi xa, làm ăn bên ngoài',
  'Điền Trạch': 'nhà cửa, đất đai, tài sản cố định',
  'Tật Ách': 'sức khỏe, bệnh tật, tai ương',
  'Tử Nữ': 'con cái, học trò, người dưới',
  'Phụ Mẫu': 'cha mẹ, cấp trên, giấy tờ',
  'Huynh Đệ': 'anh chị em, bạn thân, đối tác ngang hàng',
  'Nô Bộc': 'bạn bè, đồng nghiệp, nhân viên',
};
const GOOD = ['Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt', 'Lộc Tồn'];
const BAD = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp'];

const fmt = (s) => s.name + (s.brightness ? ` (${s.brightness})` : '') + (s.mutagen ? ` hóa ${s.mutagen}` : '');

export function buildReport(vi, analysis) {
  const strengthOf = Object.fromEntries(analysis.strength.map((s) => [s.palace, s]));
  const opp = (i) => vi.palaces[(i + 6) % 12];

  const palaces = ORDER.map((name) => {
    const i = vi.palaces.findIndex((p) => p.name === name);
    const p = vi.palaces[i];
    const borrowed = !p.majorStars.length; // vô chính diệu → mượn sao cung đối
    const src = borrowed ? opp(i) : p;
    const th = findTinhHe(src);
    const field = FIELD_OF_PALACE[name];
    const points = [];

    // Lời luận tổ hợp sao
    if (th) {
      if (field && th[field]) points.push(`${th.key}${borrowed ? ` (mượn từ ${src.name})` : ''}: ${th[field]}`);
      else {
        // các cung khác: dùng bản chất sao
        for (const s of src.majorStars) {
          const d = MAJOR[s.name];
          if (!d) continue;
          const bright = ['Miếu', 'Vượng', 'Đắc'].includes(s.brightness);
          const dim = ['Hãm', 'Bất'].includes(s.brightness);
          points.push(`${s.name}${borrowed ? ` (mượn từ ${src.name})` : ''}: ${bright ? d.bright : dim ? d.dim : d.nature}`);
        }
      }
    }
    if (borrowed) points.unshift(`Cung vô chính diệu — phải mượn chính tinh cung đối (${src.name}) để luận, nên lĩnh vực này chịu ảnh hưởng nhiều từ hoàn cảnh bên ngoài.`);

    // Phụ tinh cát / sát
    const good = p.minorStars.filter((s) => GOOD.includes(s.name));
    const bad = p.minorStars.filter((s) => BAD.includes(s.name));
    for (const s of good) points.push(`${s.name}: ${MINOR[s.name]}`);
    for (const s of bad) points.push(`${s.name}: ${MINOR[s.name]}`);
    for (const s of [...p.majorStars, ...p.minorStars].filter((x) => x.mutagen))
      points.push(`${s.name} hóa ${s.mutagen}: ${MUTAGEN[s.mutagen] ?? ''}`);
    for (const s of p.adjectiveStars.filter((x) => MINOR[x.name])) points.push(`${s.name}: ${MINOR[s.name]}`);

    const st = strengthOf[name];
    return {
      name,
      meaning: PALACE_MEANING[name],
      branch: `${p.heavenlyStem} ${p.earthlyBranch}`,
      isBody: p.isBodyPalace,
      stars: p.majorStars.map(fmt),
      minor: p.minorStars.map(fmt),
      decadal: p.decadal.range,
      strength: st?.label,
      score: st?.total,
      points,
    };
  });

  let current = null;
  try {
    const h = vi.horoscope(new Date());
    const p = vi.palaces[h.decadal.index];
    current = { age: h.age.nominalAge, palace: p.name, range: p.decadal.range };
  } catch {}

  return {
    canXuong: canXuong(vi),
    patterns: analysis.patterns,
    palaces,
    strongest: analysis.strongest.map((s) => s.palace),
    weakest: analysis.weakest.map((s) => s.palace),
    decades: analysis.decades,
    current,
    years: forecastYears(vi),
  };
}
