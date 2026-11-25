import { astro } from 'iztro';
import { resolveBirth } from './resolve-birth.js';
import { canXuong } from './can-xuong.js';

/**
 * Lập lá số bằng iztro, sau khi đã chuẩn hóa ngày giờ theo âm lịch Việt Nam và nơi sinh.
 * Trả về lá số iztro, kèm thuộc tính `resolved` (thông tin đã chỉnh).
 */
export function buildAstrolabe(birth, lang = 'vi-VN') {
  const resolved = resolveBirth(birth ?? {});
  const a = astro.bySolar(resolved.iztroDate, resolved.timeIndex, resolved.gender, true, lang);
  a.resolved = resolved;
  return a;
}

const fmtStar = (s) =>
  s.name + (s.brightness ? ` (${s.brightness})` : '') + (s.mutagen ? ` [Hóa ${s.mutagen}]` : '');

/** Chuyển lá số thành văn bản gọn để đưa cho AI đọc. */
export function astrolabeToText(a, now = new Date()) {
  const r = a.resolved;
  const lines = [
    `Giới tính: ${a.gender}`,
    `Nơi sinh: ${r?.place ?? '—'}`,
    `Ngày sinh dương lịch: ${r?.solarDate ?? a.solarDate}`,
    `Ngày sinh âm lịch (lịch Việt Nam): ${r ? `ngày ${r.lunar.day} tháng ${r.lunar.month}${r.lunar.leap ? ' (nhuận)' : ''} năm ${r.lunar.year}` : a.lunarDate}`,
    `Bát tự (can chi): ${a.chineseDate}`,
    `Giờ sinh: ${a.time} (${a.timeRange})${r?.adjustedTime ? `, giờ sau khi chỉnh: ${r.adjustedTime}` : ''}`,
    `Con giáp: ${a.zodiac} — Cung hoàng đạo: ${a.sign}`,
    `Ngũ hành cục: ${a.fiveElementsClass}`,
    `Mệnh chủ: ${a.soul} — Thân chủ: ${a.body}`,
    ...(() => {
      const cx = canXuong(a);
      return cx ? [`Cân xương (lượng chỉ): ${cx.text} — ${cx.meaning}`] : [];
    })(),
    '',
    '12 CUNG:',
  ];

  for (const p of a.palaces) {
    const tags = [p.isBodyPalace ? 'Thân cư' : '', p.isOriginalPalace ? 'Lai nhân cung' : ''].filter(Boolean);
    lines.push(
      `- Cung ${p.name} (${p.heavenlyStem} ${p.earthlyBranch})${tags.length ? ' [' + tags.join(', ') + ']' : ''}` +
        ` | Đại hạn ${p.decadal.range[0]}–${p.decadal.range[1]} tuổi`,
      `    Chính tinh: ${p.majorStars.length ? p.majorStars.map(fmtStar).join(', ') : 'Vô chính diệu'}`,
      `    Phụ tinh: ${p.minorStars.map(fmtStar).join(', ') || '—'}`,
      `    Tạp diệu: ${p.adjectiveStars.map((s) => s.name).join(', ') || '—'}`,
      `    Trường sinh: ${p.changsheng12} | Bác sĩ: ${p.boshi12}`,
    );
  }

  try {
    const h = a.horoscope(now);
    const name = (idx) => a.palaces[idx]?.name ?? '?';
    const hoa = (stars) => stars.map((s, i) => `${s} hóa ${['Lộc', 'Quyền', 'Khoa', 'Kỵ'][i]}`).join(', ');
    lines.push(
      '',
      `VẬN HẠN TẠI THỜI ĐIỂM ${now.toISOString().slice(0, 10)}:`,
      `- Tuổi âm: ${h.age.nominalAge}`,
      `- Đại hạn hiện tại đóng ở cung gốc: ${name(h.decadal.index)} (${h.decadal.heavenlyStem} ${h.decadal.earthlyBranch}), tứ hóa đại hạn: ${hoa(h.decadal.mutagen)}`,
      `- Lưu niên ${h.yearly.heavenlyStem} ${h.yearly.earthlyBranch} đóng ở cung gốc: ${name(h.yearly.index)}, tứ hóa lưu niên: ${hoa(h.yearly.mutagen)}`,
    );
  } catch {
    // vận hạn là phần phụ, bỏ qua nếu lỗi
  }

  return lines.join('\n');
}
