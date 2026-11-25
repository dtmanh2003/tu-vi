// Chuẩn hóa thông tin sinh trước khi lập lá số:
//  1. Âm lịch nhập vào → dương lịch (theo lịch Việt Nam)
//  2. Chỉnh giờ: miền Nam 1960–1975 (UTC+8), giờ mùa hè ở nước ngoài, giờ mặt trời thật (tùy chọn)
//  3. Giờ Tý muộn (23h) tính sang ngày hôm sau
//  4. Tính ngày âm theo lịch Việt Nam (UTC+7)
//  5. Tìm ngày dương "thay thế" mà lịch Trung Quốc (iztro dùng) cho ra đúng ngày âm đó
import { solar2lunar } from 'lunar-lite';
import { solarToLunar, lunarToSolar } from './vn-lunar.js';
import { PROVINCES, FOREIGN } from '../src/places.js';

const HOURS = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
const hhmm = (d) => `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;

// Phương trình thời gian (phút): giờ mặt trời thật − giờ mặt trời trung bình
function equationOfTime(date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const n = Math.floor((date - start) / 86400000);
  const B = ((2 * Math.PI) / 365) * (n - 81);
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

const SAIGON_UTC8_FROM = Date.UTC(1960, 0, 1);
const SAIGON_UTC8_TO = Date.UTC(1975, 5, 13);

export function resolveBirth(birth = {}) {
  const {
    date,
    calendar = 'solar',
    isLeapMonth = false,
    gender,
    timeMode = birth.time ? 'exact' : 'branch',
    time,
    timeIndex,
    place = 'Hà Nội',
    tzOffset = 7,
    dst = false,
    trueSolar = false,
  } = birth;

  if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(date ?? '')) throw new Error('Ngày sinh không hợp lệ (định dạng YYYY-MM-DD).');
  if (gender !== 'male' && gender !== 'female') throw new Error('Giới tính không hợp lệ.');
  let [y, m, d] = date.split('-').map(Number);

  const foreign = place === FOREIGN;
  const province = foreign ? null : PROVINCES.find((p) => p.name === place) ?? PROVINCES[0];
  const zone = foreign ? Number(tzOffset) : 7; // múi giờ chuẩn dùng để tính âm lịch
  if (!Number.isFinite(zone) || zone < -12 || zone > 14) throw new Error('Múi giờ không hợp lệ.');
  const notes = [];

  // 1. Âm lịch → dương lịch
  if (calendar === 'lunar') {
    const s = lunarToSolar(d, m, y, Boolean(isLeapMonth), zone);
    if (!s) throw new Error(`Năm ${y} không có tháng ${m} nhuận.`);
    [d, m, y] = s;
  }
  const clockDate = `${y}-${m}-${d}`;

  // 2. Giờ sinh
  let dt; // thời điểm "giờ địa phương" sau khi chỉnh, lưu dưới dạng UTC để cộng trừ dễ
  let branchMode = timeMode !== 'exact';
  let tIndex;
  if (branchMode) {
    tIndex = Number(timeIndex);
    if (!Number.isInteger(tIndex) || tIndex < 0 || tIndex > 12) throw new Error('Giờ sinh không hợp lệ.');
    dt = new Date(Date.UTC(y, m - 1, d, tIndex === 0 ? 0 : tIndex === 12 ? 23 : tIndex * 2 - 1, 30));
  } else {
    const t = /^(\d{1,2}):(\d{2})$/.exec(time ?? '');
    if (!t || +t[1] > 23 || +t[2] > 59) throw new Error('Giờ sinh không hợp lệ (định dạng HH:MM).');
    dt = new Date(Date.UTC(y, m - 1, d, +t[1], +t[2]));
    const clock = hhmm(dt);

    if (province?.south && dt >= SAIGON_UTC8_FROM && dt < SAIGON_UTC8_TO) {
      dt = new Date(dt - 60 * 60000);
      notes.push(`Sinh ở miền Nam giai đoạn 1960–1975 (đồng hồ dùng giờ UTC+8): lùi 1 tiếng, ${clock} → ${hhmm(dt)}.`);
    }
    if (foreign && dst) {
      const before = hhmm(dt);
      dt = new Date(dt - 60 * 60000);
      notes.push(`Giờ mùa hè: lùi 1 tiếng, ${before} → ${hhmm(dt)}.`);
    }
    if (trueSolar) {
      if (foreign) {
        notes.push('Chưa hỗ trợ giờ mặt trời thật cho nơi sinh ở nước ngoài, dùng giờ đồng hồ.');
      } else {
        const before = hhmm(dt);
        const delta = (province.lon - 15 * zone) * 4 + equationOfTime(dt);
        dt = new Date(dt.getTime() + Math.round(delta) * 60000);
        notes.push(
          `Giờ mặt trời thật tại ${province.name} (kinh độ ${province.lon}°): ${delta >= 0 ? '+' : ''}${Math.round(delta)} phút, ${before} → ${hhmm(dt)}.`,
        );
      }
    }
    const h = dt.getUTCHours();
    tIndex = h === 23 ? 12 : h === 0 ? 0 : Math.floor((h + 1) / 2);
  }

  // 3. Giờ Tý muộn (23:00–24:00) tính sang ngày hôm sau
  let dayDate = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()));
  if (tIndex === 12) {
    dayDate = new Date(dayDate.getTime() + 86400000);
    tIndex = 0;
    notes.push('Sinh giờ Tý muộn (23h–24h): tính sang ngày hôm sau theo lệ thường.');
  }

  // 4. Âm lịch Việt Nam
  const lunar = solarToLunar(dayDate.getUTCDate(), dayDate.getUTCMonth() + 1, dayDate.getUTCFullYear(), zone);
  const cn = solar2lunar(ymd(dayDate));
  if (cn.lunarYear !== lunar.year || cn.lunarMonth !== lunar.month || cn.lunarDay !== lunar.day || cn.isLeap !== lunar.leap) {
    const ours = foreign ? `âm lịch theo múi giờ nơi sinh (UTC${zone >= 0 ? '+' : ''}${zone})` : 'âm lịch Việt Nam';
    notes.push(
      `${ours[0].toUpperCase() + ours.slice(1)} khác âm lịch Trung Quốc ở ngày này ` +
        `(${lunar.day}/${lunar.month}${lunar.leap ? ' nhuận' : ''}/${lunar.year} so với ` +
        `${cn.lunarDay}/${cn.lunarMonth}${cn.isLeap ? ' nhuận' : ''}/${cn.lunarYear}) — lá số dùng ${ours}.`,
    );
  }

  // 5. Ngày dương thay thế cho iztro (lá số Tử Vi chỉ phụ thuộc vào ngày âm + giờ + giới tính)
  let iztroDate = null;
  for (let off = 0; off <= 60 && !iztroDate; off++) {
    for (const sign of off ? [-1, 1] : [1]) {
      const cand = new Date(dayDate.getTime() + sign * off * 86400000);
      const c = solar2lunar(ymd(cand));
      if (c.lunarYear === lunar.year && c.lunarMonth === lunar.month && c.lunarDay === lunar.day && c.isLeap === lunar.leap) {
        iztroDate = ymd(cand);
        break;
      }
    }
  }
  const warnings = [];
  if (!iztroDate) {
    // Rất hiếm: ngày âm này (vd. 30 hoặc tháng nhuận) không tồn tại trong lịch Trung Quốc
    iztroDate = ymd(dayDate);
    warnings.push('Ngày âm này không có trong lịch Trung Quốc mà thư viện dùng; lá số có thể lệch một ngày âm.');
  }

  return {
    gender,
    clockDate,
    solarDate: ymd(dayDate),
    adjustedTime: branchMode ? null : hhmm(dt),
    timeIndex: tIndex,
    hourName: HOURS[tIndex === 12 ? 0 : tIndex],
    lunar,
    iztroDate,
    place: foreign ? `${FOREIGN} (UTC${zone >= 0 ? '+' : ''}${zone})` : province.name,
    notes,
    warnings,
  };
}
