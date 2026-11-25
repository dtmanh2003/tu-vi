// Dữ liệu để vẽ lá số kiểu Việt Nam: ô giữa (thông tin chung) + 12 cung (sao tô màu ngũ hành, độ sáng viết tắt,
// Tuần/Triệt, Tràng sinh, Bác sĩ, Thái Tuế, đại vận/lưu niên, lưu nguyệt, sao lưu).
import { lunarToSolar } from './vn-lunar.js';
import { canXuong } from './can-xuong.js';

const STEMS = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const BRANCHES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const BRANCH_ELEMENT = ['Thủy', 'Thổ', 'Mộc', 'Mộc', 'Thổ', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Thủy'];

// Nạp âm 60 hoa giáp (mỗi cặp 2 năm)
const NAP_AM = [
  'Hải Trung Kim', 'Lư Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim', 'Sơn Đầu Hỏa',
  'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc', 'Tuyền Trung Thủy', 'Ốc Thượng Thổ',
  'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy', 'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc',
  'Bích Thượng Thổ', 'Kim Bạch Kim', 'Phúc Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Trạch Thổ', 'Thoa Xuyến Kim',
  'Tang Đố Mộc', 'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy',
];
const SINH = { Kim: 'Thủy', Thủy: 'Mộc', Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim' };
const KHAC = { Kim: 'Mộc', Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim' };

function relation(menh, cuc) {
  if (menh === cuc) return `Mệnh ${menh} hòa Cục ${cuc}`;
  if (SINH[menh] === cuc) return `Mệnh ${menh} sinh Cục ${cuc}`;
  if (SINH[cuc] === menh) return `Cục ${cuc} sinh Mệnh ${menh}`;
  if (KHAC[menh] === cuc) return `Mệnh ${menh} khắc Cục ${cuc}`;
  return `Cục ${cuc} khắc Mệnh ${menh}`;
}

// Ngũ hành của sao (để tô màu). Sao không có trong bảng: màu trung tính.
const ELEMENT = {
  // chính tinh
  'Tử Vi': 'Thổ', 'Thiên Cơ': 'Mộc', 'Thái Dương': 'Hỏa', 'Vũ Khúc': 'Kim', 'Thiên Đồng': 'Thủy', 'Liêm Trinh': 'Hỏa',
  'Thiên Phủ': 'Thổ', 'Thái Âm': 'Thủy', 'Tham Lang': 'Thủy', 'Cự Môn': 'Thủy', 'Thiên Tướng': 'Thủy',
  'Thiên Lương': 'Mộc', 'Thất Sát': 'Kim', 'Phá Quân': 'Thủy',
  // phụ tinh
  'Tả Phù': 'Thổ', 'Hữu Bật': 'Thủy', 'Văn Xương': 'Kim', 'Văn Khúc': 'Thủy', 'Thiên Khôi': 'Hỏa', 'Thiên Việt': 'Hỏa',
  'Lộc Tồn': 'Thổ', 'Thiên Mã': 'Hỏa', 'Kình Dương': 'Kim', 'Đà La': 'Kim', 'Hỏa Tinh': 'Hỏa', 'Linh Tinh': 'Hỏa',
  'Địa Không': 'Hỏa', 'Địa Kiếp': 'Hỏa',
  // tạp diệu thường gặp
  'Hồng Loan': 'Thủy', 'Thiên Hỷ': 'Thủy', 'Thiên Hình': 'Hỏa', 'Thiên Diêu': 'Thủy', 'Thiên Khốc': 'Kim', 'Thiên Hư': 'Thủy',
  'Long Trì': 'Thủy', 'Phụng Các': 'Thổ', 'Giải Thần': 'Mộc', 'Thiên Quan': 'Hỏa', 'Thiên Phúc': 'Thổ', 'Ân Quang': 'Mộc',
  'Thiên Quý': 'Thổ', 'Tam Thai': 'Thủy', 'Bát Tọa': 'Mộc', 'Thiên Đức': 'Hỏa', 'Nguyệt Đức': 'Hỏa', 'Thiên Tài': 'Thổ',
  'Thiên Thọ': 'Thổ', 'Thiên Trù': 'Thổ', 'Hoa Cái': 'Kim', 'Hàm Trì': 'Mộc', 'Cô Thần': 'Thổ', 'Quả Tú': 'Thổ',
  'Phá Toái': 'Hỏa', 'Thiên Không': 'Hỏa', 'Thiên Thương': 'Thổ', 'Thiên Sứ': 'Thủy', 'Đài Phụ': 'Kim', 'Phong Cáo': 'Thổ',
  'Thiên Nguyệt': 'Hỏa', 'Âm Sát': 'Thủy', 'Thiên Vu': 'Thủy', 'Niên Giải': 'Mộc', 'Không Vong': 'Hỏa',
  // vòng Bác sĩ
  'Bác Sỹ': 'Thủy', 'Lực Sỹ': 'Hỏa', 'Thanh Long': 'Thủy', 'Tiểu Hao': 'Hỏa', 'Tướng Quân': 'Mộc', 'Tấu Thư': 'Kim',
  'Phi Liêm': 'Hỏa', 'Hỷ Thần': 'Hỏa', 'Bệnh Phù': 'Thổ', 'Đại Hao': 'Hỏa', 'Phục Binh': 'Hỏa', 'Quan Phủ': 'Hỏa',
  // vòng Thái Tuế (tên Việt)
  'Thái Tuế': 'Hỏa', 'Thiếu Dương': 'Hỏa', 'Tang Môn': 'Mộc', 'Thiếu Âm': 'Thủy', 'Quan Phù': 'Hỏa', 'Tử Phù': 'Kim',
  'Tuế Phá': 'Hỏa', 'Long Đức': 'Thủy', 'Bạch Hổ': 'Kim', 'Phúc Đức': 'Thổ', 'Điếu Khách': 'Hỏa', 'Trực Phù': 'Kim',
};
// Tên vòng Thái Tuế của iztro (phái Trung Quốc) → tên dùng ở Việt Nam
const SUIQIAN_VI = {
  'Tuế Kiện': 'Thái Tuế', 'Hối Khí': 'Thiếu Dương', 'Tang Môn': 'Tang Môn', 'Quán Tác': 'Thiếu Âm', 'Quan Phù': 'Quan Phù',
  'Tiểu Hao': 'Tử Phù', 'Đại Hao': 'Tuế Phá', 'Long Đức': 'Long Đức', 'Bạch Hổ': 'Bạch Hổ', 'Thiên Đức': 'Phúc Đức',
  'Điếu Khách': 'Điếu Khách', 'Bệnh Phù': 'Trực Phù',
};
const LUU_FULL = {
  'Lưu Lộc': 'Lộc Tồn', 'Lưu Dương': 'Kình Dương', 'Lưu Đà': 'Đà La', 'Lưu Mã': 'Thiên Mã', 'Lưu Khôi': 'Thiên Khôi',
  'Lưu Việt': 'Thiên Việt', 'Lưu Xương': 'Văn Xương', 'Lưu Khúc': 'Văn Khúc', 'Lưu Loan': 'Hồng Loan', 'Lưu Hỷ': 'Thiên Hỷ',
};
const BRIGHT_ABBR ={ Miếu: 'M', Vượng: 'V', Đắc: 'Đ', Lợi: 'L', Bình: 'B', Bất: 'B', Hãm: 'H' };
const GOOD_TYPES = ['soft', 'lucun', 'tianma', 'helper'];

const star = (s, extra = {}) => ({
  name: s.name,
  b: BRIGHT_ABBR[s.brightness] ?? '',
  el: ELEMENT[s.name] ?? null,
  hua: s.mutagen ?? '',
  bad: s.type === 'tough',
  good: GOOD_TYPES.includes(s.type),
  ...extra,
});

export function buildLaSo(vi, { name = '', now = new Date() } = {}) {
  const r = vi.resolved;
  const [yearStem, yearBranch] = vi.chineseDate.split(' - ')[0].split(' ');
  const stemIdx = STEMS.indexOf(yearStem);
  const branchIdx = BRANCHES.indexOf(yearBranch);
  const cycle = (6 * stemIdx - 5 * branchIdx + 60) % 60; // vị trí trong 60 hoa giáp
  const napAm = NAP_AM[Math.floor(cycle / 2)];
  const menhEl = napAm.split(' ').at(-1);
  const cucEl = vi.fiveElementsClass.split(' ')[0];
  const yinYang = `${stemIdx % 2 === 0 ? 'Dương' : 'Âm'} ${vi.gender}`;

  // Đại vận, lưu niên, lưu nguyệt, sao lưu (năm hiện tại)
  let decNames = [];
  let yrNames = [];
  const monthAt = Array.from({ length: 12 }, () => []);
  const yearlyStars = Array.from({ length: 12 }, () => []);
  let viewYear = '';
  let age = null;
  try {
    const h = vi.horoscope(now);
    decNames = h.decadal.palaceNames;
    yrNames = h.yearly.palaceNames;
    viewYear = `${h.yearly.heavenlyStem} ${h.yearly.earthlyBranch} (${now.getFullYear()})`;
    age = h.age.nominalAge;
    (h.yearly.stars ?? []).forEach((arr, i) =>
      arr.forEach((s) => {
        const full = LUU_FULL[s.name] ?? s.name.replace(/^Lưu /, '');
        yearlyStars[i].push({ name: `L.${full}`, el: ELEMENT[full] ?? null, bad: s.type === 'tough' });
      }),
    );
    // Hóa lưu niên
    ['Lộc', 'Quyền', 'Khoa', 'Kỵ'].forEach((hua, k) => {
      const nm = h.yearly.mutagen[k];
      const i = vi.palaces.findIndex((p) => [...p.majorStars, ...p.minorStars].some((s) => s.name === nm));
      if (i >= 0) yearlyStars[i].push({ name: `L.Hóa ${hua}`, el: null, bad: hua === 'Kỵ', good: hua !== 'Kỵ' });
    });
    // Lưu nguyệt: tháng âm 1..12 của năm âm hiện tại rơi vào cung nào
    const lunarYear = h.yearly.earthlyBranch ? now.getFullYear() : now.getFullYear();
    for (let m = 1; m <= 12; m++) {
      const s = lunarToSolar(15, m, lunarYear, false, 7);
      if (!s) continue;
      const hm = vi.horoscope(new Date(s[2], s[1] - 1, s[0]));
      monthAt[hm.monthly.index].push(m);
    }
  } catch {}

  const palaces = vi.palaces.map((p, i) => {
    const adjective = p.adjectiveStars.filter((s) => !['Tuần Không', 'Triệt Lộ'].includes(s.name));
    return {
      name: p.name,
      branch: p.earthlyBranch,
      stem: p.heavenlyStem,
      el: BRANCH_ELEMENT[BRANCHES.indexOf(p.earthlyBranch)],
      sign: BRANCHES.indexOf(p.earthlyBranch) % 2 === 0 ? '+' : '-',
      isBody: p.isBodyPalace,
      isOrigin: p.isOriginalPalace,
      decadal: p.decadal.range[0],
      majors: p.majorStars.map((s) => star(s)),
      minors: [
        ...p.minorStars.map((s) => star(s)),
        ...adjective.map((s) => star(s)),
        star({ name: p.boshi12, type: ['Bác Sỹ', 'Thanh Long', 'Tướng Quân', 'Hỷ Thần'].includes(p.boshi12) ? 'helper' : 'adjective' }),
        star({ name: SUIQIAN_VI[p.suiqian12] ?? p.suiqian12, type: ['Long Đức', 'Phúc Đức'].includes(SUIQIAN_VI[p.suiqian12]) ? 'helper' : 'adjective' }),
      ],
      tuan: p.adjectiveStars.some((s) => s.name === 'Tuần Không'),
      triet: p.adjectiveStars.some((s) => s.name === 'Triệt Lộ'),
      changsheng: p.changsheng12,
      dv: decNames[i] ?? '',
      ln: yrNames[i] ?? '',
      months: monthAt[i],
      yearly: yearlyStars[i],
    };
  });

  const cx = canXuong(vi);
  const lunarStr = (n, leap) => `${n}${leap ? ' (nhuận)' : ''}`;
  const mp = vi.palaces.find((p) => p.name === 'Mệnh');
  return {
    center: {
      name,
      year: `${r.lunar.year}`,
      yearCanChi: `${yearStem} ${yearBranch}`,
      month: lunarStr(r.lunar.month, r.lunar.leap),
      day: `${r.lunar.day}`,
      solar: r.solarDate.split('-').reverse().join('/'),
      time: r.adjustedTime ? `${r.adjustedTime} (giờ ${r.hourName})` : `giờ ${r.hourName}`,
      viewYear,
      age,
      yinYang,
      napAm,
      cuc: vi.fiveElementsClass,
      relation: relation(menhEl, cucEl),
      canLuong: cx?.text ?? '',
      canLuongMeaning: cx?.meaning ?? '',
      soul: vi.soul,
      body: vi.body,
      origin: vi.palaces.find((p) => p.isOriginalPalace)?.name ?? '',
      menhBranch: mp?.earthlyBranch,
      place: r.place,
    },
    palaces,
  };
}
