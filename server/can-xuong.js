// Cân xương tính số (lượng chỉ) — phép của Viên Thiên Cương, phổ biến trên lá số Tử Vi Việt Nam.
// Tổng = trọng lượng năm (can chi) + tháng âm + ngày âm + giờ sinh. Đơn vị: 1 lượng = 10 chỉ.
// Bảng số theo bản lưu truyền phổ thông; có thể đối chiếu/sửa tại đây.

const YEAR = {
  'Giáp Tý': 1.2, 'Bính Tý': 1.6, 'Mậu Tý': 1.5, 'Canh Tý': 0.7, 'Nhâm Tý': 0.5,
  'Ất Sửu': 0.9, 'Đinh Sửu': 0.8, 'Kỷ Sửu': 0.7, 'Tân Sửu': 0.7, 'Quý Sửu': 0.7,
  'Bính Dần': 0.6, 'Mậu Dần': 0.8, 'Canh Dần': 0.9, 'Nhâm Dần': 0.9, 'Giáp Dần': 1.2,
  'Đinh Mão': 0.7, 'Kỷ Mão': 1.9, 'Tân Mão': 1.2, 'Quý Mão': 1.2, 'Ất Mão': 0.8,
  'Mậu Thìn': 1.2, 'Canh Thìn': 1.2, 'Nhâm Thìn': 1.0, 'Giáp Thìn': 0.8, 'Bính Thìn': 0.8,
  'Kỷ Tỵ': 0.5, 'Tân Tỵ': 0.6, 'Quý Tỵ': 0.7, 'Ất Tỵ': 0.7, 'Đinh Tỵ': 0.6,
  'Canh Ngọ': 0.9, 'Nhâm Ngọ': 0.8, 'Giáp Ngọ': 1.5, 'Bính Ngọ': 1.3, 'Mậu Ngọ': 1.9,
  'Tân Mùi': 0.8, 'Quý Mùi': 0.7, 'Ất Mùi': 0.6, 'Đinh Mùi': 0.5, 'Kỷ Mùi': 0.6,
  'Nhâm Thân': 0.7, 'Giáp Thân': 0.5, 'Bính Thân': 0.5, 'Mậu Thân': 1.4, 'Canh Thân': 0.8,
  'Quý Dậu': 0.8, 'Ất Dậu': 1.5, 'Đinh Dậu': 1.4, 'Kỷ Dậu': 0.5, 'Tân Dậu': 1.6,
  'Giáp Tuất': 1.5, 'Bính Tuất': 0.6, 'Mậu Tuất': 1.4, 'Canh Tuất': 0.9, 'Nhâm Tuất': 1.0,
  'Ất Hợi': 0.9, 'Đinh Hợi': 1.6, 'Kỷ Hợi': 0.9, 'Tân Hợi': 1.7, 'Quý Hợi': 0.6,
};
const MONTH = [0.6, 0.7, 1.8, 0.9, 0.5, 1.6, 0.9, 1.5, 1.8, 0.8, 0.9, 0.5];
const DAY = [0.5, 1.0, 0.8, 1.5, 1.6, 1.5, 0.8, 1.6, 0.8, 1.6, 0.9, 1.7, 0.8, 1.7, 1.0, 0.8, 0.9, 1.8, 0.5, 1.5, 1.0, 0.9, 0.8, 0.9, 1.5, 1.8, 0.7, 0.8, 1.6, 0.6];
const HOUR = { Tý: 1.6, Sửu: 0.6, Dần: 0.7, Mão: 1.0, Thìn: 0.9, Tỵ: 1.6, Ngọ: 1.0, Mùi: 0.8, Thân: 0.8, Dậu: 0.9, Tuất: 0.6, Hợi: 0.6 };

// Lời bàn khái quát theo khoảng (diễn giải ngắn, không phải nguyên văn bài phú)
function meaningOf(total) {
  if (total < 3.0) return 'Số vất vả, phải tự lực từ sớm, ít nhờ cậy được gia đình; kiên trì thì về già mới yên ổn.';
  if (total < 3.5) return 'Đời nhiều lao tâm, công việc hay thay đổi; tuổi trung niên trở đi khá dần nếu chăm chỉ, tiết kiệm.';
  if (total < 4.0) return 'Số trung bình, đủ ăn đủ mặc; phải tự mình gây dựng, có cơ hội nhưng cần nắm bắt.';
  if (total < 4.5) return 'Số khá, có tài năng và quý nhân giúp; sự nghiệp ổn định, gia đạo êm ấm.';
  if (total < 5.0) return 'Số tốt, đường công danh thuận, tiền bạc dư dả, được người kính nể.';
  if (total < 6.0) return 'Số phúc lộc dồi dào, có địa vị, làm việc lớn dễ thành.';
  return 'Số rất tốt (hiếm), phú quý song toàn, có thể thành người có danh vọng lớn.';
}

/**
 * vi: lá số iztro (vi-VN) đã có resolved (ngày âm Việt Nam + giờ).
 */
export function canXuong(vi) {
  const r = vi.resolved;
  const yearCanChi = vi.chineseDate.split(' - ')[0].trim(); // "Canh Thìn"
  const hourName = r?.hourName ?? vi.time.replace(/^Giờ\s*/i, '').trim();
  const y = YEAR[yearCanChi];
  const m = MONTH[(r?.lunar.month ?? 1) - 1];
  const d = DAY[(r?.lunar.day ?? 1) - 1];
  const h = HOUR[hourName.charAt(0).toUpperCase() + hourName.slice(1)];
  if ([y, m, d, h].some((x) => x === undefined)) return null;
  const tenths = Math.round((y + m + d + h) * 10);
  const luong = Math.floor(tenths / 10);
  const chi = tenths % 10;
  return {
    luong,
    chi,
    text: `${luong} lượng ${chi} chỉ`,
    parts: { year: `${yearCanChi} ${y}`, month: `tháng ${r?.lunar.month} ${m}`, day: `ngày ${r?.lunar.day} ${d}`, hour: `giờ ${hourName} ${h}` },
    meaning: meaningOf(tenths / 10),
  };
}
