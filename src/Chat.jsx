import { useEffect, useRef, useState } from 'react';

const SUGGESTIONS = [
  'Tổng quan lá số của tôi thế nào?',
  'Tôi hợp với công việc, ngành nghề nào?',
  'Năm nay vận hạn của tôi ra sao?',
  'Tình duyên của tôi có gì cần lưu ý?',
];

export default function Chat({ birth }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState('fast');
  const boxRef = useRef(null); // khung tin nhắn (tự cuộn bên trong, không kéo cả trang)
  const stickRef = useRef(true); // đang ở cuối khung → mới tự cuộn theo chữ mới
  const [showJump, setShowJump] = useState(false);
  const abortRef = useRef(null);

  // Đổi lá số → hủy câu trả lời đang chạy và bắt đầu cuộc trò chuyện mới
  useEffect(() => {
    abortRef.current?.abort();
    setMessages([]);
    setBusy(false);
    return () => abortRef.current?.abort();
  }, [birth]);
  // Chỉ tự cuộn khi người dùng đang ở cuối; nếu họ kéo lên đọc thì để yên
  useEffect(() => {
    const box = boxRef.current;
    if (box && stickRef.current) box.scrollTop = box.scrollHeight;
  }, [messages]);

  function onScroll() {
    const box = boxRef.current;
    if (!box) return;
    const atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 40;
    stickRef.current = atBottom;
    setShowJump(!atBottom);
  }

  function jumpToBottom() {
    const box = boxRef.current;
    if (!box) return;
    stickRef.current = true;
    setShowJump(false);
    box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
  }

  async function send(text) {
    const q = text.trim();
    if (!q || busy) return;
    const history = [...messages, { role: 'user', content: q }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setInput('');
    setBusy(true);
    stickRef.current = true; // gửi câu mới → xuống cuối để thấy câu trả lời
    setShowJump(false);
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const append = (chunk) =>
      setMessages((ms) => {
        if (ctrl.signal.aborted || ms.at(-1)?.role !== 'assistant') return ms;
        const copy = ms.slice();
        const last = copy[copy.length - 1];
        copy[copy.length - 1] = { ...last, content: last.content + chunk };
        return copy;
      });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birth, messages: history, mode }),
        signal: ctrl.signal,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        append(`⚠️ ${data.error || 'Lỗi máy chủ.'}`);
        return;
      }
      try {
        const sources = JSON.parse(decodeURIComponent(res.headers.get('X-Sources') || '%5B%5D'));
        setMessages((ms) => {
          if (ctrl.signal.aborted || ms.at(-1)?.role !== 'assistant') return ms;
          const copy = ms.slice();
          copy[copy.length - 1] = { ...copy[copy.length - 1], sources };
          return copy;
        });
      } catch {}
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        append(decoder.decode(value, { stream: true }));
      }
    } catch {
      append('⚠️ Không kết nối được tới máy chủ.');
    } finally {
      if (abortRef.current === ctrl) setBusy(false);
    }
  }

  return (
    <div className="card chat">
      <div className="chat-head">
        <h2>Hỏi Thầy Tử Vi</h2>
        <select value={mode} onChange={(e) => setMode(e.target.value)} disabled={busy} title="Chế độ luận giải">
          <option value="fast">Nhanh (~30 giây)</option>
          <option value="deep">Kỹ (~2–3 phút)</option>
        </select>
      </div>
      <div className="messages-wrap">
      <div className="messages" ref={boxRef} onScroll={onScroll}>
        {messages.length === 0 && (
          <div className="suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.content || (busy && i === messages.length - 1 ? mode === 'deep' ? 'Đang luận kỹ, có thể mất vài phút…' : 'Đang xem lá số…' : '')}
            {m.sources?.length > 0 && m.content && (
              <details className="sources">
                <summary>Tài liệu tham khảo: bài giảng Thiên Kỷ của thầy Nghê Hải Hạ</summary>
                <ol>
                  {m.sources.map((s, k) => (
                    <li key={k}>
                      <strong>{s.topic}</strong>
                      <br />
                      {s.lecture}, phút {s.time} ·{' '}
                      <a href={s.url} target="_blank" rel="noreferrer">
                        xem đoạn video gốc
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            )}
          </div>
        ))}
      </div>
      {showJump && (
        <button type="button" className="jump" onClick={jumpToBottom}>
          ↓ Xuống cuối
        </button>
      )}
      </div>
      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Nhập câu hỏi về lá số…" disabled={busy} />
        <button type="submit" disabled={busy || !input.trim()}>
          Gửi
        </button>
      </form>
      <p className="note">Nội dung chỉ mang tính tham khảo, giải trí.</p>
    </div>
  );
}
