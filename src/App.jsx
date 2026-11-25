import { useState } from 'react';
import BirthForm from './BirthForm.jsx';
import LaSo from './LaSo.jsx';
import Chat from './Chat.jsx';
import Report from './Report.jsx';
import Forecast from './Forecast.jsx';

const DEFAULT = {
  name: '',
  calendar: 'solar',
  day: 16,
  month: 8,
  year: '2000',
  isLeapMonth: false,
  timeMode: 'exact',
  time: '04:10',
  timeIndex: 2,
  gender: 'male',
  place: 'Hà Nội',
  tzOffset: 7,
  dst: false,
  trueSolar: false,
};


export default function App() {
  const [birth, setBirth] = useState(null); // thông tin gửi lên server (cho chat)
  const [resolved, setResolved] = useState(null); // ngày giờ đã chỉnh (cho lá số)
  const [report, setReport] = useState(null); // báo cáo luận giải + dự đoán năm
  const [laSo, setLaSo] = useState(null); // dữ liệu vẽ lá số kiểu Việt Nam
  const [tab, setTab] = useState('chart');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(form) {
    const y = Number(form.year);
    const d = Number(form.day);
    const m = Number(form.month);
    if (!(y >= 1900 && y <= 2100)) return setError('Năm sinh phải là 4 chữ số, từ 1900 đến 2100.');
    if (form.calendar === 'solar' && new Date(y, m - 1, d).getDate() !== d)
      return setError(`Tháng ${m}/${y} không có ngày ${d}.`);
    const b = { ...form, date: `${y}-${m}-${d}` };
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(b),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi máy chủ.');
      setBirth(b);
      setResolved(data.resolved);
      setReport(data.report);
      setLaSo(data.laSo);
    } catch (err) {
      setError(err.message || 'Không kết nối được tới máy chủ.');
    } finally {
      setBusy(false);
    }
  }

  const r = resolved;
  return (
    <div className="app">
      <header>
        <h1>☯ Tử Vi Chatbot</h1>
        <p>Lập lá số Tử Vi Đẩu Số và hỏi đáp luận giải cùng AI</p>
      </header>

      <div className="layout">
        <aside>
          <BirthForm initial={DEFAULT} onSubmit={handleSubmit} busy={busy} />
          {error && <div className="card error">⚠️ {error}</div>}
          {birth && <Chat birth={birth} />}
        </aside>

        <main className="card chart">
          {r ? (
            <>
              {birth.name && <h2>Lá số: {birth.name}</h2>}
              <div className="birth-info">
                <div>
                  <strong>Dương lịch:</strong> {r.solarDate.split('-').reverse().join('/')}
                  {r.adjustedTime && <> · {r.adjustedTime}</>} · giờ {r.hourName} · {r.place}
                </div>
                <div>
                  <strong>Âm lịch:</strong> ngày {r.lunar.day} tháng {r.lunar.month}
                  {r.lunar.leap ? ' (nhuận)' : ''} năm {r.lunar.year}
                </div>
                {[...r.notes, ...r.warnings].map((n, i) => (
                  <div key={i} className="note-line">
                    • {n}
                  </div>
                ))}
              </div>
              <div className="tabs">
                {[
                  ['chart', 'Lá số'],
                  ['report', 'Luận giải'],
                  ['years', '10 năm tới'],
                ].map(([k, label]) => (
                  <button key={k} type="button" className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>
                    {label}
                  </button>
                ))}
              </div>
              {tab === 'report' && <Report report={report} />}
              {tab === 'years' && <Forecast years={report?.years} />}
              {tab === 'chart' && <LaSo data={laSo} />}
            </>
          ) : (
            <div className="empty">Nhập ngày giờ sinh rồi bấm “Lập lá số” để xem lá số và bắt đầu hỏi.</div>
          )}
        </main>
      </div>
      <footer className="site-footer">
        Nội dung mang tính tham khảo, giải trí. Lá số tính bằng thư viện{' '}
        <a href="https://github.com/SylarLong/iztro" target="_blank" rel="noreferrer">iztro</a> (MIT). Câu luận tham khảo trích từ
        bài giảng Thiên Kỷ của thầy Nghê Hải Hạ, theo bản tổng hợp{' '}
        <a href="https://github.com/Renhuai123/ziwei-doushu/tree/main/docs/tianji-ziwei" target="_blank" rel="noreferrer">
          Renhuai123/ziwei-doushu
        </a>{' '}
        (
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noreferrer">
          CC BY-NC-SA 4.0
        </a>
        , phi thương mại). Phần dịch tên chủ đề sang tiếng Việt được phân phối theo cùng giấy phép.
      </footer>
    </div>
  );
}
