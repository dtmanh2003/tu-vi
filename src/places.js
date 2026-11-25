// 63 tỉnh/thành (theo địa giới trước 7/2025 — tên thường ghi trên giấy khai sinh).
// lon: kinh độ tỉnh lỵ (độ Đông) để tính giờ mặt trời thật.
// south: thuộc miền Nam cũ (từ Quảng Trị trở vào) — dùng giờ UTC+8 từ 1/1/1960 đến 13/6/1975.
export const PROVINCES = [
  // Miền Bắc
  ['Hà Nội', 105.85], ['Hải Phòng', 106.68], ['Hà Giang', 104.98], ['Cao Bằng', 106.26], ['Bắc Kạn', 105.83],
  ['Tuyên Quang', 105.22], ['Lào Cai', 103.97], ['Điện Biên', 103.02], ['Lai Châu', 103.46], ['Sơn La', 103.91],
  ['Yên Bái', 104.87], ['Hòa Bình', 105.34], ['Thái Nguyên', 105.84], ['Lạng Sơn', 106.76], ['Quảng Ninh', 107.08],
  ['Bắc Giang', 106.2], ['Phú Thọ', 105.4], ['Vĩnh Phúc', 105.6], ['Bắc Ninh', 106.07], ['Hải Dương', 106.33],
  ['Hưng Yên', 106.05], ['Thái Bình', 106.34], ['Hà Nam', 105.92], ['Nam Định', 106.17], ['Ninh Bình', 105.97],
  // Bắc Trung Bộ
  ['Thanh Hóa', 105.78], ['Nghệ An', 105.68], ['Hà Tĩnh', 105.9], ['Quảng Bình', 106.6],
  ['Quảng Trị', 107.1, true], ['Thừa Thiên Huế', 107.58, true],
  // Nam Trung Bộ & Tây Nguyên
  ['Đà Nẵng', 108.22, true], ['Quảng Nam', 108.47, true], ['Quảng Ngãi', 108.8, true], ['Bình Định', 109.22, true],
  ['Phú Yên', 109.3, true], ['Khánh Hòa', 109.19, true], ['Ninh Thuận', 108.99, true], ['Bình Thuận', 108.1, true],
  ['Kon Tum', 108.0, true], ['Gia Lai', 108.0, true], ['Đắk Lắk', 108.05, true], ['Đắk Nông', 107.69, true],
  ['Lâm Đồng', 108.44, true],
  // Đông Nam Bộ
  ['TP. Hồ Chí Minh', 106.7, true], ['Bình Phước', 106.9, true], ['Tây Ninh', 106.1, true], ['Bình Dương', 106.65, true],
  ['Đồng Nai', 106.82, true], ['Bà Rịa - Vũng Tàu', 107.08, true],
  // Tây Nam Bộ
  ['Long An', 106.41, true], ['Tiền Giang', 106.36, true], ['Bến Tre', 106.38, true], ['Trà Vinh', 106.34, true],
  ['Vĩnh Long', 105.97, true], ['Đồng Tháp', 105.63, true], ['An Giang', 105.43, true], ['Kiên Giang', 105.08, true],
  ['Cần Thơ', 105.78, true], ['Hậu Giang', 105.47, true], ['Sóc Trăng', 105.97, true], ['Bạc Liêu', 105.72, true],
  ['Cà Mau', 105.15, true],
].map(([name, lon, south = false]) => ({ name, lon, south }));

export const FOREIGN = 'Nước ngoài';

// Múi giờ chuẩn cho người sinh ở nước ngoài
export const TIMEZONES = [-10, -9, -8, -7, -6, -5, -4, -3, 0, 1, 2, 3, 4, 5, 5.5, 6, 7, 8, 9, 9.5, 10, 11, 12];
