const TONE = { good: '▲', bad: '▼', change: '↻', info: '•' };

export default function Forecast({ years }) {
  if (!years?.length) return null;
  return (
    <div className="forecast">
      <p className="muted">
        Tính tự động từ cung lưu niên, tứ hóa lưu niên, các sao lưu (Lộc, Mã, Kình, Đà, Hồng Loan, Thiên Hỷ), năm tuổi và năm chuyển
        đại hạn. ▲ thuận lợi · ▼ cần lưu ý · ↻ biến động/thay đổi.
      </p>
      {years.map((y) => (
        <div key={y.year} className={`year r-${y.rating.replace(/\s/g, '-')}`}>
          <div className="year-head">
            <strong>
              {y.year} · {y.canChi}
            </strong>
            <span className="muted"> · {y.age} tuổi · lưu niên ở cung {y.yearlyPalace} · đại hạn {y.decadal}</span>
            <span className="badge">{y.rating}</span>
          </div>
          <ul>
            {y.events.map((e, i) => (
              <li key={i} className={`ev ${e.tone}`}>
                <span className="tone">{TONE[e.tone]}</span> <strong>{e.title}:</strong> {e.text}
                <div className="why">Vì: {e.why}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
