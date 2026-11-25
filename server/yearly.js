// Dự đoán từng năm (lưu niên): biến động cụ thể và lý do theo lá số.
// Quy tắc dựa trên: cung lưu niên Mệnh, tứ hóa lưu niên rơi vào cung nào, các sao lưu (Mã, Lộc, Kình, Đà, Loan, Hỷ),
// năm tuổi / xung Thái Tuế, năm chuyển đại hạn.

const DOMAIN = {
  Mệnh: 'Bản thân',
  'Quan Lộc': 'Công việc',
  'Tài Bạch': 'Tiền bạc',
  'Phu Thê': 'Tình cảm, hôn nhân',
  'Tật Ách': 'Sức khỏe',
  'Điền Trạch': 'Nhà cửa, tài sản',
  'Thiên Di': 'Đi lại, làm ăn xa',
  'Tử Nữ': 'Con cái',
  'Phụ Mẫu': 'Cha mẹ, giấy tờ',
  'Huynh Đệ': 'Anh chị em',
  'Nô Bộc': 'Bạn bè, đồng nghiệp',
  'Phúc Đức': 'Tinh thần',
};

// Ý nghĩa cụ thể của từng hóa khi rơi vào từng cung
const HUA = {
  Lộc: {
    Mệnh: 'nhiều cơ hội tự tìm đến, tâm trạng thoải mái, dễ được người khác ủng hộ',
    'Quan Lộc': 'công việc thuận, có thêm dự án/khách hàng, có thể tăng lương hoặc nhận việc mới tốt hơn',
    'Tài Bạch': 'thu nhập tăng, có khoản tiền mới (thưởng, làm thêm, kinh doanh có lời)',
    'Phu Thê': 'tình cảm ấm áp; người độc thân dễ gặp người hợp ý, có thể tính chuyện cưới hỏi',
    'Tật Ách': 'sức khỏe ổn, bệnh cũ dễ chữa',
    'Điền Trạch': 'thuận cho mua bán, sửa sang nhà cửa, tích lũy tài sản',
    'Thiên Di': 'đi xa có lợi, làm ăn với bên ngoài/nơi xa thuận lợi',
    'Tử Nữ': 'tin vui về con cái (có thể sinh con), con cái thuận lợi',
    'Phụ Mẫu': 'được cha mẹ/cấp trên giúp đỡ, giấy tờ thuận',
    'Huynh Đệ': 'anh em hòa thuận, có thể hợp tác',
    'Nô Bộc': 'được bạn bè, đồng nghiệp giúp; quan hệ xã hội mở rộng',
    'Phúc Đức': 'tinh thần vui vẻ, có lộc hưởng thụ, du lịch',
  },
  Quyền: {
    Mệnh: 'chủ động, quyết đoán hơn, muốn tự làm chủ các việc lớn',
    'Quan Lộc': 'được giao trách nhiệm lớn hơn, có thể thăng chức hoặc nắm quyền quyết định',
    'Tài Bạch': 'tự chủ tài chính, dám đầu tư/kinh doanh, kiểm soát được dòng tiền',
    'Phu Thê': 'người kia (hoặc mình) mạnh mẽ hơn trong quan hệ, dễ tranh quyền quyết định',
    'Tật Ách': 'cần chú ý sức khỏe do làm việc quá sức',
    'Điền Trạch': 'có quyết định lớn về nhà đất (mua, sửa, chuyển)',
    'Thiên Di': 'hoạt động bên ngoài nhiều, có uy tín khi đi xa',
    'Tử Nữ': 'con cái có chính kiến, phải quan tâm dạy dỗ nhiều',
    'Phụ Mẫu': 'làm việc với cấp trên/cơ quan nhà nước nhiều',
    'Huynh Đệ': 'anh em có việc cần mình đứng ra quyết',
    'Nô Bộc': 'có người dưới quyền, quản lý nhóm',
    'Phúc Đức': 'nhiều ý tưởng, muốn làm việc lớn',
  },
  Khoa: {
    Mệnh: 'được người khác ghi nhận, danh tiếng tốt, có quý nhân',
    'Quan Lộc': 'thi cử, học thêm, lấy chứng chỉ thuận lợi; được ghi nhận thành tích',
    'Tài Bạch': 'tiền bạc ổn định, có quý nhân giúp khi kẹt tiền',
    'Phu Thê': 'tình cảm nhẹ nhàng, có thể được giới thiệu người tốt',
    'Tật Ách': 'gặp thầy giỏi thuốc hay nếu có bệnh',
    'Điền Trạch': 'giấy tờ nhà đất thuận lợi',
    'Thiên Di': 'đi xa gặp quý nhân, có tiếng tăm bên ngoài',
    'Tử Nữ': 'con cái học hành tốt',
    'Phụ Mẫu': 'giấy tờ, thủ tục, thi cử suôn sẻ',
    'Huynh Đệ': 'anh em giúp đỡ nhau',
    'Nô Bộc': 'bạn bè giới thiệu cơ hội tốt',
    'Phúc Đức': 'tâm an, hợp học hỏi, tu dưỡng',
  },
  Kỵ: {
    Mệnh: 'hay lo nghĩ, tự gây áp lực cho mình, dễ quyết định sai khi nóng vội',
    'Quan Lộc': 'áp lực công việc, dễ bất mãn với cấp trên, có thể đổi việc hoặc bị điều chuyển',
    'Tài Bạch': 'kẹt tiền, hao tài; không nên cho vay, đứng ra bảo lãnh hay đầu tư mạo hiểm',
    'Phu Thê': 'dễ hiểu lầm, cãi vã trong tình cảm; người độc thân khó tiến triển',
    'Tật Ách': 'cần chú ý sức khỏe, nên khám định kỳ, tránh thức khuya',
    'Điền Trạch': 'phiền về nhà cửa (sửa chữa, chuyển nhà, tranh chấp đất, chi phí nhà lớn)',
    'Thiên Di': 'đi xa trắc trở, cẩn thận giao thông; làm ăn bên ngoài dễ vướng',
    'Tử Nữ': 'lo lắng về con cái',
    'Phụ Mẫu': 'lo cho sức khỏe cha mẹ; giấy tờ, thủ tục dễ vướng',
    'Huynh Đệ': 'bất hòa với anh em, dễ mất tiền vì người thân',
    'Nô Bộc': 'bị bạn bè/đồng nghiệp làm phiền, cẩn thận bị lợi dụng',
    'Phúc Đức': 'tâm trạng bất an, khó ngủ, suy nghĩ nhiều',
  },
};
const HUA_SCORE = { Lộc: 2, Quyền: 1, Khoa: 1, Kỵ: -2 };
const SIGNED = { Lộc: 'good', Quyền: 'good', Khoa: 'good', Kỵ: 'bad' };
const BRANCH_ORDER = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

function findStarPalace(vi, starName) {
  return vi.palaces.find((p) => [...p.majorStars, ...p.minorStars].some((s) => s.name === starName));
}
function lưuStarIndex(yearlyStars, name) {
  const i = yearlyStars.findIndex((arr) => arr.some((s) => s.name === name));
  return i;
}

export function forecastYears(vi, fromYear = new Date().getFullYear(), years = 10) {
  const natalYearBranch = vi.chineseDate.split(' - ')[0].split(' ')[1];
  const out = [];
  let prevDecadal = null;

  for (let y = fromYear; y < fromYear + years; y++) {
    const h = vi.horoscope(new Date(y, 6, 1)); // giữa năm âm lịch
    const yp = vi.palaces[h.yearly.index]; // cung lưu niên Mệnh (theo cung gốc)
    const dp = vi.palaces[h.decadal.index];
    const age = h.age.nominalAge;
    const events = [];
    let score = 0;
    const add = (tone, title, text, why, s = 0) => {
      events.push({ tone, title, text, why });
      score += s;
    };

    // 1. Năm tuổi, xung Thái Tuế
    const yb = h.yearly.earthlyBranch;
    if (yb === natalYearBranch)
      add('change', 'Năm tuổi', 'năm bản mệnh: nhiều thay đổi, nên thận trọng với quyết định lớn (đổi việc, đầu tư lớn)', `Năm ${h.yearly.heavenlyStem} ${yb} trùng chi năm sinh`, -0.5);
    else if (Math.abs(BRANCH_ORDER.indexOf(yb) - BRANCH_ORDER.indexOf(natalYearBranch)) === 6)
      add('change', 'Xung Thái Tuế', 'năm dễ biến động, hay phải di chuyển, thay đổi môi trường', `Chi năm ${yb} xung chi năm sinh ${natalYearBranch}`, -0.5);

    // 2. Chuyển đại hạn
    if (prevDecadal !== null && prevDecadal !== h.decadal.index)
      add('change', 'Chuyển đại hạn', `bước sang đại hạn mới ở cung ${dp.name} (${dp.decadal.range[0]}–${dp.decadal.range[1]} tuổi): bước ngoặt cho 10 năm tới, trọng tâm cuộc sống chuyển sang mảng "${DOMAIN[dp.name] ?? dp.name}"`, `Tuổi ${age} bắt đầu đại hạn mới`);
    prevDecadal = h.decadal.index;

    // 3. Cung lưu niên Mệnh rơi vào cung nào của lá số gốc
    const ypMajors = yp.majorStars.map((s) => s.name);
    add('info', 'Trọng tâm năm', `chuyện "${DOMAIN[yp.name] ?? yp.name}" nổi bật trong năm`, `Lưu niên Mệnh đóng ở cung ${yp.name} gốc (${ypMajors.join(', ') || 'vô chính diệu'})`);
    if (ypMajors.some((n) => ['Thất Sát', 'Phá Quân', 'Tham Lang'].includes(n)))
      add('change', 'Biến động lớn', 'năm có thay đổi rõ rệt: dễ đổi việc, đổi chỗ ở hoặc thay đổi kế hoạch lớn', `Lưu niên Mệnh gặp ${ypMajors.filter((n) => ['Thất Sát', 'Phá Quân', 'Tham Lang'].includes(n)).join(', ')} (bộ Sát Phá Tham)`, -0.5);

    // 4. Tứ hóa lưu niên
    ['Lộc', 'Quyền', 'Khoa', 'Kỵ'].forEach((hua, k) => {
      const star = h.yearly.mutagen[k];
      const p = star && findStarPalace(vi, star);
      if (!p) return;
      // Quyền ở Tật Ách là dấu hiệu quá sức, không phải điềm tốt
      const tone = hua === 'Quyền' && p.name === 'Tật Ách' ? 'bad' : SIGNED[hua];
      const s = tone === 'bad' && hua === 'Quyền' ? -0.5 : HUA_SCORE[hua];
      add(tone, `${DOMAIN[p.name] ?? p.name}`, HUA[hua][p.name] ?? '', `${star} hóa ${hua} (lưu niên) rơi vào cung ${p.name}`, s);
    });

    // 5. Sao lưu
    const ys = h.yearly.stars ?? [];
    const near = (i) => i === h.yearly.index || i === (h.yearly.index + 6) % 12;
    const ma = lưuStarIndex(ys, 'Lưu Mã');
    const natalMa = findStarPalace(vi, 'Thiên Mã');
    if (near(ma) || (natalMa && natalMa === yp))
      add('change', 'Di chuyển', 'có đi xa, công tác, đổi chỗ ở hoặc chỗ làm', near(ma) ? 'Lưu Mã chiếu cung lưu niên Mệnh' : 'Lưu niên Mệnh gặp Thiên Mã gốc');
    const loc = lưuStarIndex(ys, 'Lưu Lộc');
    if (loc >= 0 && ['Tài Bạch', 'Quan Lộc', 'Điền Trạch'].includes(vi.palaces[loc].name))
      add('good', 'Tiền bạc', `có thêm nguồn tiền liên quan "${DOMAIN[vi.palaces[loc].name]}"`, `Lưu Lộc Tồn vào cung ${vi.palaces[loc].name}`, 1);
    for (const sat of ['Lưu Dương', 'Lưu Đà']) {
      const i = lưuStarIndex(ys, sat);
      if (i === h.yearly.index)
        add('bad', 'Va chạm', sat === 'Lưu Dương' ? 'dễ tranh chấp, va chạm, cẩn thận tai nạn nhỏ/vết thương' : 'việc hay bị chậm trễ, dây dưa, dễ ấm ức', `${sat === 'Lưu Dương' ? 'Lưu Kình Dương' : 'Lưu Đà La'} ở cung lưu niên Mệnh`, -1);
    }
    const phu = vi.palaces.findIndex((p) => p.name === 'Phu Thê');
    const loan = lưuStarIndex(ys, 'Lưu Loan');
    const hy = lưuStarIndex(ys, 'Lưu Hỷ');
    if ([loan, hy].some((i) => i === h.yearly.index || i === phu))
      add('good', 'Hỷ sự', 'có tin vui tình cảm: người độc thân dễ có người yêu, có thể cưới hỏi; gia đình có việc vui', `${loan === h.yearly.index || loan === phu ? 'Lưu Hồng Loan' : 'Lưu Thiên Hỷ'} vào cung ${loan === phu || hy === phu ? 'Phu Thê' : 'lưu niên Mệnh'}`, 0.5);

    const rating = score >= 3 ? 'Tốt' : score >= 1 ? 'Khá' : score > -1.5 ? 'Bình thường' : 'Cần cẩn trọng';
    out.push({
      year: y,
      canChi: `${h.yearly.heavenlyStem} ${h.yearly.earthlyBranch}`,
      age,
      yearlyPalace: yp.name,
      decadal: `${dp.name} (${dp.decadal.range[0]}–${dp.decadal.range[1]})`,
      mutagen: h.yearly.mutagen,
      rating,
      score: +score.toFixed(1),
      events,
    });
  }
  return out;
}

/** Văn bản ngắn cho prompt chatbot */
export function forecastToText(rows) {
  return [
    'DỰ ĐOÁN TỪNG NĂM (tính tự động từ lưu niên, tứ hóa lưu niên, sao lưu — dùng để nói cụ thể năm nào xảy ra biến động gì):',
    ...rows.map(
      (r) =>
        `- ${r.year} (${r.canChi}, ${r.age} tuổi) — ${r.rating}; đại hạn ${r.decadal}; ` +
        r.events
          .filter((e) => e.tone !== 'info')
          .map((e) => `[${e.title}] ${e.text} (vì ${e.why})`)
          .join('; '),
    ),
  ].join('\n');
}
