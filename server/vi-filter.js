// Bộ lọc đầu ra: bảo đảm người dùng không thấy chữ Hán.
// Nhận từng đoạn chữ (stream), gom theo dòng; dòng nào chủ yếu là chữ Hán thì bỏ hẳn,
// còn lại thì xóa phần chữ Hán (kèm ngoặc/nháy bao quanh) rồi mới gửi đi.
const CJK = /[㐀-鿿豈-﫿　-〿！-｠]/g;
const CJK_CHAR = /[㐀-鿿豈-﫿]/;

function cleanLine(line) {
  if (!CJK_CHAR.test(line)) return line;
  const cjkCount = (line.match(/[㐀-鿿豈-﫿]/g) || []).length;
  const letters = line.replace(/[\s\d\p{P}\p{S}]/gu, '').length || 1;
  if (cjkCount / letters > 0.3) return null; // dòng gần như toàn tiếng Trung → bỏ
  return line
    .replace(/[「『“"(（]\s*[^「『“"(（」』”")）]*[㐀-鿿][^「『“"(（」』”")）]*[」』”")）]/g, '') // (中文) / "中文"
    .replace(CJK, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1');
}

export function createViFilter(write) {
  let buf = '';
  let lastBlank = false;
  const emit = (line, newline) => {
    const cleaned = cleanLine(line);
    if (cleaned === null) return;
    const blank = cleaned.trim() === '';
    if (blank && lastBlank) return; // tránh dòng trống liên tiếp sau khi bỏ dòng
    lastBlank = blank;
    write(cleaned + (newline ? '\n' : ''));
  };
  return {
    push(text) {
      buf += text;
      let nl;
      while ((nl = buf.indexOf('\n')) >= 0) {
        emit(buf.slice(0, nl), true);
        buf = buf.slice(nl + 1);
      }
      // Dòng đang viết dở: nếu chưa có chữ Hán thì gửi luôn phần chắc chắn an toàn để chữ hiện ra liền mạch
      if (buf && !CJK_CHAR.test(buf) && buf.length > 40) {
        const cut = buf.lastIndexOf(' ');
        if (cut > 0) {
          write(buf.slice(0, cut + 1));
          lastBlank = false;
          buf = buf.slice(cut + 1);
        }
      }
    },
    end() {
      if (buf) emit(buf, false);
      buf = '';
    },
  };
}
