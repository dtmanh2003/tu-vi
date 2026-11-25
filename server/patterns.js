// Nhận diện cách cục Tử Vi và chấm điểm các cung — để AI có dữ kiện cụ thể thay vì tự đoán.
// Ý tưởng tham khảo từ ziwei-doushu/lib/ziwei/patterns.ts (MIT); điều kiện và lời giải viết lại bằng tiếng Việt.
// Dùng lá số iztro bản tiếng Trung (tên sao ổn định) để so khớp, xuất kết quả bằng tiếng Việt.

const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const SHA4 = ['擎羊', '陀罗', '火星', '铃星'];
const KONGJIE = ['地空', '地劫'];
const JI6 = ['左辅', '右弼', '文昌', '文曲', '天魁', '天钺'];
const BRIGHT = ['庙', '旺'];
const OK = ['庙', '旺', '得', '利'];
const DIM = ['陷', '不'];

export function analyzeChart(zh, vi) {
  // ---- tiện ích ----
  const br = (p) => BRANCHES.indexOf(p.earthlyBranch);
  const byBranch = (b) => zh.palaces.find((p) => br(p) === ((b % 12) + 12) % 12);
  const viOf = (p) => vi.palaces[zh.palaces.indexOf(p)];
  const all = (p) => [...p.majorStars, ...p.minorStars, ...p.adjectiveStars];
  const has = (p, name) => all(p).some((s) => s.name === name);
  const star = (p, name) => all(p).find((s) => s.name === name);
  const where = (name) => zh.palaces.find((p) => has(p, name));
  const majors = (p) => p.majorStars.map((s) => s.name);
  const hua = (p, h) => all(p).some((s) => s.mutagen === h);
  const sanfang = (p) => [0, 4, 8, 6].map((d) => byBranch(br(p) + d));
  const inSet = (ps, name) => ps.some((p) => has(p, name));
  const huaIn = (ps, h) => ps.some((p) => hua(p, h));
  const count = (ps, names) => ps.reduce((n, p) => n + all(p).filter((s) => names.includes(s.name)).length, 0);
  const bright = (p, name) => BRIGHT.includes(star(p, name)?.brightness);
  const dim = (p, name) => DIM.includes(star(p, name)?.brightness);
  const neighbors = (p) => [byBranch(br(p) - 1), byBranch(br(p) + 1)];
  const flank = (p, a, b) => {
    const [x, y] = neighbors(p);
    return (has(x, a) && has(y, b)) || (has(x, b) && has(y, a));
  };
  const name = (p) => viOf(p).name;

  const ming = zh.palaces.find((p) => p.name === '命宫');
  const sf = sanfang(ming);
  const patterns = [];
  const add = (title, level, meaning, conds = {}) =>
    patterns.push({ title, level, meaning, ...conds, palaces: conds.palaces ?? ['Mệnh'] });

  // ================= CÁT CÁCH =================
  // Tử Phủ đồng cung
  {
    const p = where('紫微');
    if (p && has(p, '天府')) {
      const inMing = p === ming;
      const breaking = [];
      if (count([p], KONGJIE)) breaking.push('cung có Không Kiếp');
      if (count([p], SHA4) >= 2) breaking.push('cung có từ 2 sát tinh');
      add(
        'Tử Phủ đồng cung',
        inMing && !breaking.length ? 'rất tốt' : 'tốt',
        inMing
          ? 'Tử Vi và Thiên Phủ cùng ở Mệnh: người đĩnh đạc, có uy, có khả năng quản lý và giữ của; đời sống vật chất ổn định. Cần thêm Tả Hữu, Xương Khúc mới thành đại cách.'
          : `Tử Vi, Thiên Phủ đồng cung tại cung ${name(p)}: lĩnh vực của cung này được che chở, vững vàng.`,
        { breaking, palaces: [name(p)] },
      );
    }
  }
  // Quân thần khánh hội
  if (has(ming, '紫微') && inSet(sf, '左辅') && inSet(sf, '右弼')) {
    const bonus = [];
    if (inSet(sf, '文昌') || inSet(sf, '文曲')) bonus.push('có thêm Xương/Khúc');
    if (inSet(sf, '天魁') || inSet(sf, '天钺')) bonus.push('có Khôi/Việt');
    const breaking = count(sf, KONGJIE) >= 2 ? ['Không Kiếp hội chiếu'] : [];
    add(
      'Quân thần khánh hội',
      breaking.length ? 'tốt' : 'rất tốt',
      'Tử Vi (vua) thủ Mệnh có Tả Phù, Hữu Bật (bề tôi) hội về: được nhiều người giúp, hợp làm lãnh đạo, quản lý, càng làm việc tập thể càng thành công.',
      { bonus, breaking },
    );
  }
  // Phủ Tướng triều viên
  {
    const f = where('天府');
    const x = where('天相');
    if (f && x && f !== x && sf.includes(f) && sf.includes(x)) {
      const breaking = count([ming], SHA4) ? ['Mệnh có sát tinh'] : [];
      add(
        'Phủ Tướng triều viên',
        breaking.length ? 'tốt' : 'rất tốt',
        'Thiên Phủ và Thiên Tướng chiếu về Mệnh: cơm áo đầy đủ, được tín nhiệm, hợp công việc hành chính, quản lý, tài chính, có chức vị ổn định.',
        { breaking },
      );
    }
  }
  // Sát Phá Tham
  {
    const m = majors(ming).filter((s) => ['七杀', '破军', '贪狼'].includes(s));
    if (m.length) {
      const breaking = count(sf, SHA4) >= 3 ? ['tam phương có nhiều sát tinh: dễ thăng trầm mạnh'] : [];
      add(
        'Sát Phá Tham',
        'trung tính',
        'Mệnh thuộc bộ Sát Phá Tham: tính cách mạnh, thích thay đổi, dám mạo hiểm và khai phá; đời có nhiều biến động, thăng trầm rõ rệt. Hợp kinh doanh, kỹ thuật, quân đội/công an, công việc cần quyết đoán; kỵ môi trường quá tĩnh.',
        { breaking },
      );
    }
  }
  // Cơ Nguyệt Đồng Lương
  if (['天机', '太阴', '天同', '天梁'].every((s) => inSet(sf, s))) {
    add(
      'Cơ Nguyệt Đồng Lương',
      'tốt',
      'Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương hội đủ: người hiền hòa, chu đáo, giỏi tính toán và lập kế hoạch; hợp làm công chức, văn phòng, giáo dục, tư vấn, ngân hàng — "lấy lương bổng làm chính" hơn là kinh doanh mạo hiểm.',
    );
  }
  // Dương Lương Xương Lộc
  if (['太阳', '天梁', '文昌', '禄存'].every((s) => inSet(sf, s))) {
    const sun = where('太阳');
    const breaking = dim(sun, '太阳') ? ['Thái Dương hãm'] : [];
    add(
      'Dương Lương Xương Lộc',
      breaking.length ? 'tốt' : 'rất tốt',
      'Thái Dương, Thiên Lương, Văn Xương, Lộc Tồn hội Mệnh: cách thi cử đỗ đạt, học vấn cao, danh tiếng tốt; hợp học thuật, thi cử, làm việc trong cơ quan lớn.',
      { breaking },
    );
  }
  // Nhật Nguyệt
  {
    const sun = where('太阳');
    const moon = where('太阴');
    if (sun && moon && sf.includes(sun) && sf.includes(moon)) {
      if (bright(sun, '太阳') && bright(moon, '太阴'))
        add('Nhật Nguyệt tịnh minh', 'rất tốt', 'Thái Dương và Thái Âm đều sáng, cùng chiếu Mệnh: thông minh, danh và lợi đều có, được cả quý nhân nam lẫn nữ giúp đỡ.');
      if (dim(sun, '太阳') && dim(moon, '太阴'))
        add('Nhật Nguyệt phản bối', 'cần lưu ý', 'Thái Dương và Thái Âm đều hãm mà chiếu Mệnh: vất vả, phải tự lực, dễ thiếu sự hỗ trợ từ cha mẹ; thành công đến muộn nhưng có thể bền nếu kiên trì.');
    }
    if (sun && moon && br(ming) === 7 && !majors(ming).length && br(sun) === 3 && br(moon) === 11)
      add('Minh Châu xuất hải', 'rất tốt', 'Mệnh ở Mùi vô chính diệu, Thái Dương ở Mão, Thái Âm ở Hợi chiếu về: như ngọc sáng ra biển — đường công danh sáng, có tài năng nổi bật.');
    if (sun === ming && br(ming) === 3) add('Nhật chiếu Lôi môn', 'tốt', 'Thái Dương ở Mão thủ Mệnh: như mặt trời lúc bình minh — có chí lớn, hăng hái, danh tiếng lên dần.');
  }
  // Cự Môn
  if (has(ming, '巨门') && [0, 6].includes(br(ming)) && (hua(ming, '禄') || hua(ming, '权') || hua(ming, '科')))
    add('Thạch trung ẩn ngọc', 'tốt', 'Cự Môn ở Tý/Ngọ thủ Mệnh có hóa cát: như ngọc trong đá — tài năng ẩn, phải qua mài giũa mới thành, thường thành công nhờ ăn nói, chuyên môn, càng về sau càng tốt.');
  if (has(ming, '巨门') && has(ming, '太阳'))
    add('Cự Nhật đồng cung', bright(ming, '太阳') ? 'tốt' : 'trung tính', 'Cự Môn và Thái Dương cùng thủ Mệnh: giỏi ăn nói, hợp nghề dùng lời nói (giảng dạy, luật, truyền thông, bán hàng); có thể nổi tiếng ở nơi xa.');
  // Vũ Tham
  if (has(ming, '武曲') && has(ming, '贪狼'))
    add('Vũ Tham đồng hành', 'trung tính', 'Vũ Khúc và Tham Lang thủ Mệnh: "tiền bần hậu phú" — tuổi trẻ vất vả, sau 30 tuổi mới phát; hợp kinh doanh, tài chính.');
  // Giáp Mệnh
  if (flank(ming, '左辅', '右弼')) add('Tả Hữu giáp Mệnh', 'tốt', 'Tả Phù, Hữu Bật kẹp hai bên Mệnh: luôn có người giúp đỡ, được anh em bạn bè nâng đỡ.');
  if (flank(ming, '文昌', '文曲')) add('Xương Khúc giáp Mệnh', 'tốt', 'Văn Xương, Văn Khúc kẹp Mệnh: thông minh, học giỏi, có khiếu văn chương, thi cử thuận lợi.');
  if (flank(ming, '天魁', '天钺')) add('Khôi Việt giáp Mệnh', 'tốt', 'Thiên Khôi, Thiên Việt kẹp Mệnh: hay gặp quý nhân, có cơ hội được cất nhắc.');
  {
    const opp = byBranch(br(ming) + 6);
    if ((has(ming, '天魁') && has(opp, '天钺')) || (has(ming, '天钺') && has(opp, '天魁')))
      add('Tọa quý hướng quý', 'tốt', 'Khôi, Việt một sao ở Mệnh, một sao ở Thiên Di: quý nhân ở cả trong và ngoài, ra ngoài làm ăn dễ được giúp.');
  }
  // Lộc
  {
    const lucMa = sf.find((p) => has(p, '天马') && (has(p, '禄存') || hua(p, '禄')));
    if (lucMa)
      add('Lộc Mã giao trì', 'rất tốt', `Lộc và Thiên Mã cùng ở cung ${name(lucMa)} (trong tam phương Mệnh): tiền bạc đến từ di chuyển, buôn bán, làm ăn xa — càng năng động càng giàu.`, { palaces: [name(lucMa)] });
    if (inSet(sf, '禄存') && huaIn(sf, '禄')) add('Song Lộc', 'tốt', 'Lộc Tồn và Hóa Lộc cùng hội Mệnh: nguồn tài lộc dồi dào, có nhiều đường thu nhập.');
    if (huaIn(sf, '禄') && huaIn(sf, '权') && huaIn(sf, '科'))
      add('Tam kỳ gia hội', 'rất tốt', 'Hóa Lộc, Hóa Quyền, Hóa Khoa cùng hội Mệnh: có tiền, có quyền, có danh — cách tốt để thăng tiến.');
    if (has(ming, '禄存'))
      add('Lộc Tồn thủ Mệnh', 'trung tính', 'Lộc Tồn ở Mệnh: giỏi giữ của, cẩn trọng, có phần dè dặt; luôn bị Kình Dương, Đà La kẹp hai bên nên đời có áp lực, dễ cô độc.');
  }

  // ================= HUNG CÁCH / CẦN LƯU Ý =================
  if (has(ming, '禄存') && hua(ming, '忌'))
    add('Dương Đà giáp Kỵ', 'cần lưu ý', 'Mệnh có Hóa Kỵ, hai bên bị Kình Dương, Đà La kẹp: dễ bị kẹt, tiến thoái lưỡng nan, hay gặp thị phi; cần kiên nhẫn và tránh quyết định vội.');
  if (flank(ming, '火星', '铃星')) add('Hỏa Linh giáp Mệnh', 'cần lưu ý', 'Hỏa Tinh, Linh Tinh kẹp Mệnh: tính nóng, dễ gặp chuyện bất ngờ; nên rèn sự bình tĩnh.');
  if (flank(ming, '地空', '地劫')) add('Không Kiếp giáp Mệnh', 'cần lưu ý', 'Địa Không, Địa Kiếp kẹp Mệnh: dễ hao tài, kế hoạch hay đổ vỡ giữa chừng; không hợp đầu cơ, nên làm nghề chuyên môn, sáng tạo.');
  {
    const kj = count([ming], KONGJIE);
    if (kj)
      add('Không Kiếp thủ Mệnh', 'cần lưu ý', 'Có Địa Không/Địa Kiếp ở Mệnh: suy nghĩ khác người, có óc sáng tạo, nhưng tiền bạc khó giữ, dễ "được rồi lại mất"; hợp nghề kỹ thuật, nghệ thuật, nghiên cứu, tôn giáo hơn là buôn bán.');
  }
  if (br(ming) === 6 && has(ming, '擎羊'))
    add('Mã đầu đới tiễn', 'trung tính', 'Kình Dương ở Ngọ thủ Mệnh: "đầu ngựa đeo tên" — tính quyết liệt, dễ thành danh trong võ nghiệp, kinh doanh cạnh tranh; nhưng cần đề phòng tai nạn, thương tích.');
  if (hua(ming, '忌')) {
    const s = all(ming).find((x) => x.mutagen === '忌');
    add('Hóa Kỵ thủ Mệnh', 'cần lưu ý', `${viOf(ming).majorStars.concat(viOf(ming).minorStars).find((x) => x.mutagen)?.name ?? s.name} hóa Kỵ ở Mệnh: hay lo nghĩ, dễ tự làm khó mình ("nghĩ quẩn"), có điều canh cánh trong lòng; cần học cách buông bỏ.`);
  }
  if (!majors(ming).length) {
    const opp = byBranch(br(ming) + 6);
    add(
      'Mệnh vô chính diệu',
      'trung tính',
      `Mệnh không có chính tinh, phải mượn sao cung Thiên Di (${viOf(opp).majorStars.map((s) => s.name).join(', ') || 'cũng trống'}) để luận: tính cách dễ chịu ảnh hưởng môi trường, linh hoạt; thường hợp rời quê lập nghiệp.`,
    );
  }
  if (count(sf, SHA4) >= 3)
    add('Sát tinh hội Mệnh', 'cần lưu ý', `Tam phương tứ chính của Mệnh có ${count(sf, SHA4)} sát tinh (Kình, Đà, Hỏa, Linh): đời nhiều thử thách, cạnh tranh; nếu chính tinh sáng thì lại thành người bản lĩnh, "sát tinh nhập miếu phản vi cát".`);

  // ================= CHẤM ĐIỂM CÁC CUNG =================
  const GOOD_HUA = { 禄: 2, 权: 1.5, 科: 1.5 };
  const scorePalace = (p) => {
    let s = 0;
    for (const st of p.majorStars) s += OK.includes(st.brightness) ? 1.5 : DIM.includes(st.brightness) ? -1 : 0.5;
    s += all(p).filter((x) => JI6.includes(x.name)).length * 1;
    s += has(p, '禄存') ? 1.5 : 0;
    s -= all(p).filter((x) => SHA4.includes(x.name)).length * 1;
    s -= all(p).filter((x) => KONGJIE.includes(x.name)).length * 1.2;
    for (const x of all(p)) s += x.mutagen === '忌' ? -2 : GOOD_HUA[x.mutagen] ?? 0;
    return s;
  };
  const strength = zh.palaces.map((p) => {
    const own = scorePalace(p);
    const total = own + 0.5 * sanfang(p).slice(1).reduce((n, q) => n + scorePalace(q), 0);
    return { palace: name(p), own: +own.toFixed(1), total: +total.toFixed(1) };
  });
  const ranked = [...strength].sort((a, b) => b.total - a.total);
  const label = (t) => (t >= 5 ? 'mạnh' : t >= 2 ? 'khá' : t >= -1 ? 'trung bình' : 'yếu');
  for (const s of strength) s.label = label(s.total);

  // Dòng thời gian đại hạn (10 năm) kèm sức mạnh cung
  const decades = vi.palaces
    .map((p, i) => ({ from: p.decadal.range[0], to: p.decadal.range[1], palace: p.name, label: strength[i].label }))
    .sort((a, b) => a.from - b.from)
    .filter((d) => d.from < 95);

  return { patterns, strength, strongest: ranked.slice(0, 3), weakest: ranked.slice(-3).reverse(), decades };
}

/** Văn bản tóm tắt cách cục + điểm cung cho prompt */
export function analysisToText(an) {
  const lines = ['CÁCH CỤC PHÁT HIỆN TỰ ĐỘNG (đã kiểm tra theo điều kiện cổ thư — đây là dữ kiện chắc chắn):'];
  if (!an.patterns.length) lines.push('- Không có cách cục đặc biệt nào nổi bật.');
  for (const p of an.patterns) {
    lines.push(`- ${p.title} [${p.level}] (cung ${p.palaces.join(', ')}): ${p.meaning}`);
    if (p.bonus?.length) lines.push(`    + Tăng thêm: ${p.bonus.join('; ')}`);
    if (p.breaking?.length) lines.push(`    − Phá cách / giảm: ${p.breaking.join('; ')}`);
  }
  lines.push('', 'SỨC MẠNH CÁC CUNG (tính theo độ sáng chính tinh, cát tinh, sát tinh, tứ hóa của cung và tam phương):');
  lines.push(an.strength.map((s) => `${s.palace}: ${s.label} (${s.total})`).join('; '));
  lines.push(
    `→ Mạnh nhất: ${an.strongest.map((s) => s.palace).join(', ')}. Yếu nhất: ${an.weakest.map((s) => s.palace).join(', ')}.`,
  );
  lines.push(
    '',
    'CÁC ĐẠI HẠN 10 NĂM (tuổi âm → cung, sức mạnh cung):',
    an.decades.map((d) => `${d.from}–${d.to}: ${d.palace} (${d.label})`).join('; '),
  );
  return lines.join('\n');
}
