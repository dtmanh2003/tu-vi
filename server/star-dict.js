// Từ điển sao Tử Vi bằng tiếng Việt — viết theo kiến thức Tử Vi phổ thông (Toàn Thư / Toàn Tập).
// Mỗi chính tinh: bản chất, khi sáng (Miếu/Vượng/Đắc), khi hãm, nghề hợp, và ý nghĩa ở vài cung chính.
// Bạn có thể tự sửa/bổ sung nội dung ở đây — server chỉ đưa vào prompt những mục khớp với lá số.

export const MAJOR = {
  'Tử Vi': {
    nature: 'Đế tinh, hành Thổ. Chủ quyền uy, tự trọng, có khí chất lãnh đạo, thích được tôn trọng.',
    bright: 'Đĩnh đạc, có uy, độ lượng, giỏi tổ chức; dễ lên vị trí quản lý.',
    dim: 'Dễ tự cao, cô độc, "vua không có quan" — có ý chí nhưng thiếu người giúp, nói nhiều làm ít.',
    career: 'quản lý, lãnh đạo, hành chính, công chức cấp cao, chủ doanh nghiệp',
    note: 'Tử Vi cần Tả Hữu, Xương Khúc, Khôi Việt phò tá mới phát huy; gặp Không Kiếp thì giảm quý khí, hợp tôn giáo/triết học.',
    'Phu Thê': 'Vợ/chồng có cá tính, tự trọng cao, có năng lực; nên kết hôn muộn, hôn nhân cần sự tôn trọng lẫn nhau.',
    'Quan Lộc': 'Sự nghiệp có địa vị, hợp làm quản lý, được cấp trên tín nhiệm.',
    'Tài Bạch': 'Tiền bạc ổn định, kiếm tiền nhờ địa vị, uy tín; biết giữ của.',
  },
  'Thiên Cơ': {
    nature: 'Thiện tinh, hành Mộc. Chủ trí tuệ, mưu lược, linh hoạt, hay suy nghĩ, thích thay đổi.',
    bright: 'Thông minh, nhanh nhạy, giỏi lập kế hoạch, khéo tay, hiểu biết rộng.',
    dim: 'Suy nghĩ nhiều mà thiếu quyết đoán, dễ lo âu, hay thay đổi công việc, tính toán thái quá.',
    career: 'tham mưu, kế hoạch, kỹ thuật, công nghệ, nghiên cứu, tư vấn, giáo dục',
    'Phu Thê': 'Vợ/chồng thông minh, nhanh nhẹn; nên chênh tuổi nhiều; tình cảm dễ thay đổi nếu gặp sát tinh.',
    'Quan Lộc': 'Hợp công việc dùng trí óc, hay thay đổi công việc hoặc phạm vi việc làm.',
    'Tài Bạch': 'Kiếm tiền bằng chất xám, tiền bạc lúc lên lúc xuống, cần tính toán kỹ.',
  },
  'Thái Dương': {
    nature: 'Quý tinh, hành Hỏa. Chủ danh tiếng, sự rộng lượng, nhiệt tình, cống hiến; tượng cho cha, chồng, nam giới.',
    bright: 'Hào phóng, nhiệt huyết, danh tiếng tốt, được quý nhân nam giúp; công danh sáng (đặc biệt sinh ban ngày).',
    dim: 'Vất vả, cho đi nhiều mà nhận ít, dễ mang tiếng thị phi; cần đề phòng bệnh mắt, huyết áp.',
    career: 'chính trị, giáo dục, truyền thông, ngoại giao, công tác xã hội, ngành liên quan năng lượng',
    'Phu Thê': 'Với nữ: chồng có danh vọng, nhiệt tình; với nam: vợ năng động, có thể là người "cầm trịch" trong nhà.',
    'Quan Lộc': 'Sự nghiệp gắn với danh tiếng, phục vụ cộng đồng, làm việc ở tổ chức lớn.',
    'Tài Bạch': 'Có tiền nhờ danh tiếng, tiêu pha rộng rãi, "tiền đến từ tiếng".',
  },
  'Vũ Khúc': {
    nature: 'Tài tinh, hành Kim. Chủ tiền bạc, quyết đoán, cứng rắn, thực tế, làm việc nhanh gọn.',
    bright: 'Giỏi kiếm tiền và quản lý tài chính, ý chí mạnh, dám làm; hợp kinh doanh.',
    dim: 'Cứng nhắc, cô độc, tiền bạc vào ra thất thường; dễ va chạm.',
    career: 'tài chính, ngân hàng, kinh doanh, kỹ thuật cơ khí/kim loại, quân đội, công an',
    'Phu Thê': 'Vợ/chồng cá tính mạnh, thực tế; hôn nhân dễ khắc khẩu, nên kết hôn muộn.',
    'Quan Lộc': 'Hợp ngành tài chính, kinh doanh hoặc võ nghiệp; làm việc quyết đoán, hiệu quả.',
    'Tài Bạch': 'Vị trí rất tốt cho Vũ Khúc: giỏi làm ra và tích lũy tiền.',
  },
  'Thiên Đồng': {
    nature: 'Phúc tinh, hành Thủy. Chủ hưởng thụ, hiền hòa, dễ gần, lạc quan, thích an nhàn.',
    bright: 'Có phúc, ít tranh giành, được người quý mến; "tiền khổ hậu sướng", về sau an nhàn.',
    dim: 'Lười, thiếu ý chí, dễ an phận, tình cảm hay dao động.',
    career: 'dịch vụ, ẩm thực, nghệ thuật giải trí, phúc lợi xã hội, giáo dục mầm non, công chức',
    'Phu Thê': 'Vợ/chồng hiền, tình cảm; hôn nhân êm nhưng cần tránh dựa dẫm.',
    'Quan Lộc': 'Hợp công việc ổn định, môi trường hòa nhã; không hợp cạnh tranh khốc liệt.',
    'Tài Bạch': 'Tiền bạc đủ dùng, ban đầu ít, về sau khá dần; thích hưởng thụ.',
  },
  'Liêm Trinh': {
    nature: 'Tù tinh, hành Hỏa (đới Mộc). Chủ nguyên tắc, cương trực, cảm xúc mạnh; vừa là quan tinh vừa là đào hoa tinh.',
    bright: 'Liêm chính, có năng lực, giỏi giao tế, hợp chính trị, pháp luật.',
    dim: 'Nóng nảy, dễ dính thị phi, kiện tụng, tai nạn; tình cảm phức tạp.',
    career: 'pháp luật, chính trị, quân đội/công an, kinh doanh, nghệ thuật, điện tử',
    note: 'Liêm Trinh gặp Thất Sát, Phá Quân, Tham Lang hoặc Kình Dương cần đề phòng tai nạn, kiện tụng.',
    'Phu Thê': 'Tình cảm sâu nhưng dễ trắc trở, ghen tuông; cần chân thành và kiên nhẫn.',
    'Quan Lộc': 'Hợp ngành có kỷ luật, quy tắc rõ; dễ thăng tiến trong cơ quan nhà nước nếu sao sáng.',
    'Tài Bạch': 'Kiếm tiền bằng năng lực và quan hệ; cần minh bạch để tránh rắc rối.',
  },
  'Thiên Phủ': {
    nature: 'Tài khố tinh, hành Thổ. Chủ kho tiền, sự ổn định, bảo thủ, chín chắn, có tài quản lý.',
    bright: 'Phúc hậu, giữ của tốt, tính toán chắc chắn, được tín nhiệm; đời sống sung túc.',
    dim: 'Bảo thủ, thiếu linh hoạt, kho rỗng (gặp Không Kiếp) thì hữu danh vô thực.',
    career: 'tài chính, kế toán, ngân hàng, quản lý tài sản, hành chính, bất động sản',
    'Phu Thê': 'Vợ/chồng chín chắn, biết lo toan; hôn nhân ổn định.',
    'Quan Lộc': 'Hợp vị trí quản lý ổn định, tổ chức lớn; thăng tiến đều.',
    'Tài Bạch': 'Rất tốt: giữ tiền giỏi, tài sản tích lũy dần dần.',
  },
  'Thái Âm': {
    nature: 'Phú tinh, hành Thủy. Chủ điền sản, sự dịu dàng, tinh tế, nội tâm; tượng cho mẹ, vợ, nữ giới.',
    bright: 'Tinh tế, có óc thẩm mỹ, tích lũy được tài sản và nhà đất; được quý nhân nữ giúp.',
    dim: 'Đa sầu đa cảm, tài sản khó giữ, vất vả; cần chú ý sức khỏe thận, mắt.',
    career: 'tài chính, bất động sản, thiết kế, nghệ thuật, văn chương, dịch vụ cho phụ nữ',
    'Phu Thê': 'Với nam: vợ dịu dàng, đảm đang; với nữ: chồng hiền, tình cảm.',
    'Quan Lộc': 'Hợp công việc văn phòng, sáng tạo, tài chính; không hợp va chạm mạnh.',
    'Tài Bạch': 'Tốt cho tích lũy, đặc biệt là nhà đất; tiền đến từ từ mà bền.',
  },
  'Tham Lang': {
    nature: 'Đào hoa tinh, hành Thủy/Mộc. Chủ ham muốn, đa tài, giao tiếp giỏi, thích hưởng thụ và mới lạ.',
    bright: 'Đa tài đa nghệ, khéo giao tế, có duyên; giỏi kinh doanh, ngoại giao.',
    dim: 'Ham vui, dễ sa đà tửu sắc cờ bạc, tham lam, thiếu kiên định.',
    career: 'kinh doanh, ngoại giao, nghệ thuật, giải trí, ẩm thực, làm đẹp, quan hệ công chúng',
    note: 'Tham Lang gặp Hỏa Tinh/Linh Tinh thành cách "Hỏa Tham"/"Linh Tham": dễ phát đột ngột.',
    'Phu Thê': 'Tình cảm phong phú, dễ có nhiều mối quan hệ; nên kết hôn muộn, cần chung thủy.',
    'Quan Lộc': 'Hợp nghề giao tiếp, kinh doanh, nghệ thuật; có thể làm nhiều nghề cùng lúc.',
    'Tài Bạch': 'Kiếm tiền nhờ giao tế, có thể có tiền bất ngờ nhưng cũng tiêu nhiều.',
  },
  'Cự Môn': {
    nature: 'Ám tinh, hành Thủy. Chủ ngôn ngữ, khẩu tài, hoài nghi, phân tích sâu; dễ gây thị phi.',
    bright: 'Ăn nói sắc bén, giỏi phân tích, nghiên cứu sâu; thành công nhờ lời nói, chuyên môn.',
    dim: 'Hay nghi ngờ, dễ khẩu thiệt thị phi, quan hệ kém, khó được hiểu.',
    career: 'luật sư, giáo viên, truyền thông, bán hàng, tư vấn, nghiên cứu, y dược, ẩm thực',
    'Phu Thê': 'Vợ chồng dễ bất đồng, khẩu thiệt; cần giao tiếp cởi mở, tránh nghi kỵ.',
    'Quan Lộc': 'Hợp nghề dùng lời nói hoặc chuyên môn sâu; cạnh tranh nhiều.',
    'Tài Bạch': 'Kiếm tiền bằng miệng/chuyên môn; cẩn thận tranh chấp tiền bạc.',
  },
  'Thiên Tướng': {
    nature: 'Ấn tinh, hành Thủy. Chủ sự công bằng, tận tâm, phục vụ, giữ chữ tín; là "người phụ tá giỏi".',
    bright: 'Đáng tin, chính trực, có lòng giúp người, được trọng dụng; ăn mặc chỉn chu.',
    dim: 'Thiếu chủ kiến, dễ bị người khác chi phối, vất vả vì người khác.',
    career: 'hành chính, nhân sự, thư ký, tư vấn, pháp luật, công chức, dịch vụ',
    'Phu Thê': 'Vợ/chồng hiền, biết lo; hôn nhân ổn định.',
    'Quan Lộc': 'Hợp vị trí phụ tá, quản lý cấp trung, công việc cần uy tín.',
    'Tài Bạch': 'Tiền bạc ổn định, kiếm được nhờ uy tín và sự tận tâm.',
  },
  'Thiên Lương': {
    nature: 'Ấm tinh (sao che chở), hành Thổ. Chủ phúc thọ, nhân hậu, chính trực, thích giúp đỡ, dạy bảo người khác.',
    bright: 'Đứng đắn, có trách nhiệm, được che chở, gặp nạn hóa lành; hợp vai trò người thầy, người cố vấn.',
    dim: 'Hay lo chuyện bao đồng, cô độc, dễ gặp rắc rối rồi mới được giải.',
    career: 'giáo dục, y tế, bảo hiểm, pháp luật, công tác xã hội, nghiên cứu, tôn giáo',
    'Phu Thê': 'Vợ/chồng lớn tuổi hơn hoặc chín chắn, hay chăm lo cho nhau.',
    'Quan Lộc': 'Hợp ngành giáo dục, y tế, giám sát, cố vấn.',
    'Tài Bạch': 'Tiền đủ dùng, không màng tiền lớn; có lộc từ người trên.',
  },
  'Thất Sát': {
    nature: 'Tướng tinh, hành Kim. Chủ uy quyền, quyết liệt, dũng cảm, độc lập, thích thử thách.',
    bright: 'Bản lĩnh, dám nghĩ dám làm, có thể lập nghiệp lớn; "Thất Sát triều Đẩu" là cách tốt.',
    dim: 'Nóng vội, cô độc, đời nhiều thăng trầm, dễ gặp tai nạn.',
    career: 'quân đội, công an, kinh doanh, kỹ thuật, ngoại khoa, thể thao, khởi nghiệp',
    'Phu Thê': 'Vợ/chồng cá tính mạnh; hôn nhân dễ va chạm, nên kết hôn muộn.',
    'Quan Lộc': 'Sự nghiệp nhiều biến động nhưng có thể làm lớn; hợp tự lập.',
    'Tài Bạch': 'Kiếm tiền bằng sức lực, mạo hiểm; tiền vào ra mạnh.',
  },
  'Phá Quân': {
    nature: 'Hao tinh, hành Thủy. Chủ phá cũ lập mới, đổi thay, tiên phong, không chịu gò bó.',
    bright: 'Dũng cảm, sáng tạo, dám đổi mới, có thể làm nên sự nghiệp khác người.',
    dim: 'Phá tán, liều lĩnh, hao tài, quan hệ dễ đổ vỡ.',
    career: 'khởi nghiệp, kỹ thuật, quân đội, vận tải, xây dựng, ngành cần đổi mới liên tục',
    'Phu Thê': 'Hôn nhân dễ có biến động; nên kết hôn muộn, chọn người kiên nhẫn.',
    'Quan Lộc': 'Hay thay đổi công việc, hợp tự làm chủ hoặc ngành mới.',
    'Tài Bạch': 'Tiền vào nhiều ra nhiều, khó giữ; nên có kế hoạch tích lũy.',
  },
};

export const MINOR = {
  'Tả Phù': 'Cát tinh (phụ tá): được người giúp, có bạn bè/đồng nghiệp hỗ trợ; ở Phu Thê dễ có người thứ ba chen vào.',
  'Hữu Bật': 'Cát tinh (phụ tá): được giúp đỡ, khéo hợp tác; ở Phu Thê dễ có người thứ ba.',
  'Văn Xương': 'Cát tinh văn học: thông minh, học giỏi, thi cử tốt, có khiếu văn chương. Hãm thì học hành dang dở.',
  'Văn Khúc': 'Cát tinh văn nghệ: khéo ăn nói, có năng khiếu nghệ thuật, âm nhạc. Hãm thì dễ khẩu thiệt, tình cảm lôi thôi.',
  'Thiên Khôi': 'Quý nhân (dương): được người trên, người nam nâng đỡ; thi cử, thăng tiến thuận.',
  'Thiên Việt': 'Quý nhân (âm): được người nữ, người trong bóng tối giúp; gặp cơ hội tốt.',
  'Lộc Tồn': 'Tài tinh: chủ tiền bạc tích lũy, cẩn trọng, giữ của; luôn bị Kình Dương, Đà La kẹp hai bên.',
  'Thiên Mã': 'Chủ di chuyển, thay đổi, bôn ba; gặp Lộc thì tiền đến từ đi lại, buôn bán xa.',
  'Kình Dương': 'Sát tinh (dao sắc): quyết liệt, cạnh tranh, dễ tai nạn, phẫu thuật; nhập miếu thì thành uy dũng.',
  'Đà La': 'Sát tinh (trì trệ): chậm chạp, dây dưa, việc hay kéo dài; dễ ấm ức trong lòng.',
  'Hỏa Tinh': 'Sát tinh: nóng nảy, bột phát, việc đến nhanh đi nhanh; gặp Tham Lang thành cách phát đột ngột.',
  'Linh Tinh': 'Sát tinh: âm ỉ, nóng trong lòng, dễ gặp chuyện bất ngờ; gặp Tham Lang cũng có thể phát.',
  'Địa Không': 'Sát tinh: hư không, ý tưởng khác thường, hao tài; hợp sáng tạo, tôn giáo, triết học.',
  'Địa Kiếp': 'Sát tinh: kiếp tài, dễ mất mát tiền bạc, kế hoạch đổ vỡ; hợp nghề kỹ thuật, nghệ thuật.',
  'Hồng Loan': 'Đào hoa: duyên dáng, chủ hỷ sự cưới hỏi.',
  'Thiên Hỷ': 'Chủ việc vui, hỷ sự, sinh nở.',
  'Thiên Diêu': 'Đào hoa: quyến rũ, đa tình; dễ vướng chuyện tình cảm.',
  'Thiên Hình': 'Chủ hình phạt, kỷ luật, phẫu thuật; hợp ngành luật, quân đội, y (ngoại khoa).',
};

export const MUTAGEN = {
  Lộc: 'Hóa Lộc: thêm tiền bạc, cơ hội, sự thuận lợi và duyên cho sao và cung đó.',
  Quyền: 'Hóa Quyền: thêm quyền lực, năng lực, ý chí, sự chủ động; quá mức thì độc đoán.',
  Khoa: 'Hóa Khoa: thêm danh tiếng, học vấn, quý nhân, sự uy tín; gặp nạn hóa giải nhẹ.',
  Kỵ: 'Hóa Kỵ: trắc trở, lo nghĩ, thiếu hụt, thị phi ở lĩnh vực của cung đó; cũng là chỗ mình chấp niệm nhiều nhất.',
};

export const BRIGHTNESS = 'Độ sáng: Miếu > Vượng > Đắc > Lợi > Bình > Bất > Hãm. Sao càng sáng thì mặt tốt càng rõ; sao hãm thì mặt xấu lộ ra.';

const SHORT_PALACE = { 'Quan Lộc': 'Quan Lộc', 'Tài Bạch': 'Tài Bạch', 'Phu Thê': 'Phu Thê' };
const isBright = (b) => ['Miếu', 'Vượng', 'Đắc'].includes(b);
const isDim = (b) => ['Hãm', 'Bất'].includes(b);

/**
 * Tạo phần "kiến thức về sao" cho các cung trọng tâm.
 * focusIdx: chỉ số cung (theo vi.palaces) cần giải thích.
 */
export function starKnowledge(vi, focusIdx) {
  const lines = [];
  const seenMinor = new Set();
  const huaSeen = new Set();
  for (const i of focusIdx) {
    const p = vi.palaces[i];
    for (const s of p.majorStars) {
      const d = MAJOR[s.name];
      if (!d) continue;
      const state = isBright(s.brightness) ? d.bright : isDim(s.brightness) ? d.dim : `${d.bright} Khi sao kém sáng: ${d.dim}`;
      const inPalace = d[SHORT_PALACE[p.name]] ? ` Ở cung ${p.name}: ${d[SHORT_PALACE[p.name]]}` : '';
      lines.push(
        `- ${s.name} (${s.brightness || 'không rõ độ sáng'}) tại cung ${p.name}: ${d.nature} Với độ sáng này: ${state}${inPalace} Nghề hợp: ${d.career}.${d.note ? ' Lưu ý: ' + d.note : ''}`,
      );
      if (s.mutagen) huaSeen.add(s.mutagen);
    }
    for (const s of p.minorStars) {
      if (s.mutagen) huaSeen.add(s.mutagen);
      if (!MINOR[s.name] || seenMinor.has(s.name)) continue;
      seenMinor.add(s.name);
      lines.push(`- ${s.name} (ở cung ${p.name}): ${MINOR[s.name]}`);
    }
    for (const s of p.adjectiveStars) {
      if (!MINOR[s.name] || seenMinor.has(s.name)) continue;
      seenMinor.add(s.name);
      lines.push(`- ${s.name} (ở cung ${p.name}): ${MINOR[s.name]}`);
    }
  }
  for (const h of huaSeen) if (MUTAGEN[h]) lines.push(`- ${MUTAGEN[h]}`);
  lines.push(`- ${BRIGHTNESS}`);
  return lines.join('\n');
}
