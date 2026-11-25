const LEVEL_CLASS = { 'rất tốt': 'good', tốt: 'good', 'trung tính': 'neutral', 'cần lưu ý': 'bad' };

export default function Report({ report }) {
  if (!report) return null;
  const { patterns, palaces, strongest, weakest, current, decades } = report;
  return (
    <div className="report">
      <section>
        <h3>Tóm tắt</h3>
        <ul className="summary">
          <li>
            <strong>Cung mạnh nhất:</strong> {strongest.join(', ')} · <strong>Cung yếu nhất:</strong> {weakest.join(', ')}
          </li>
          {report.canXuong && (
            <li>
              <strong>Cân xương:</strong> {report.canXuong.text} — {report.canXuong.meaning}{' '}
              <span className="muted">
                ({report.canXuong.parts.year} + {report.canXuong.parts.month} + {report.canXuong.parts.day} +{' '}
                {report.canXuong.parts.hour})
              </span>
            </li>
          )}
          {current && (
            <li>
              <strong>Hiện tại:</strong> {current.age} tuổi âm, đang ở đại hạn cung {current.palace} ({current.range[0]}–
              {current.range[1]} tuổi)
            </li>
          )}
        </ul>
      </section>

      <section>
        <h3>Cách cục</h3>
        {patterns.length === 0 && <p className="muted">Lá số không có cách cục đặc biệt nổi bật.</p>}
        {patterns.map((p) => (
          <div key={p.title} className={`pattern ${LEVEL_CLASS[p.level] ?? ''}`}>
            <div>
              <strong>{p.title}</strong> <span className="badge">{p.level}</span>{' '}
              <span className="muted">· cung {p.palaces.join(', ')}</span>
            </div>
            <div>{p.meaning}</div>
            {p.bonus?.length > 0 && <div className="muted">+ Tăng thêm: {p.bonus.join('; ')}</div>}
            {p.breaking?.length > 0 && <div className="muted">− Phá cách: {p.breaking.join('; ')}</div>}
          </div>
        ))}
      </section>

      <section>
        <h3>Luận từng cung</h3>
        {palaces.map((p) => (
          <details key={p.name} className="palace" open={['Mệnh', 'Quan Lộc', 'Tài Bạch', 'Phu Thê'].includes(p.name)}>
            <summary>
              <strong>
                Cung {p.name}
                {p.isBody ? ' (Thân cư)' : ''}
              </strong>{' '}
              <span className={`badge s-${p.strength}`}>{p.strength}</span>
              <span className="muted">
                {' '}
                · {p.branch} · {p.stars.length ? p.stars.join(', ') : 'Vô chính diệu'} · đại hạn {p.decadal[0]}–{p.decadal[1]} tuổi
              </span>
            </summary>
            <p className="muted">Chủ về: {p.meaning}.</p>
            {p.minor.length > 0 && <p className="muted">Phụ tinh: {p.minor.join(', ')}</p>}
            <ul>
              {p.points.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </details>
        ))}
      </section>

      <section>
        <h3>Các giai đoạn trong đời (đại hạn 10 năm)</h3>
        <div className="decades">
          {decades.map((d) => (
            <div
              key={d.from}
              className={`decade s-${d.label} ${current && d.palace === current.palace ? 'current' : ''}`}
              title={`Cung ${d.palace}: ${d.label}`}
            >
              <div className="age">
                {d.from}–{d.to}
              </div>
              <div>{d.palace}</div>
              <div className="muted">{d.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
