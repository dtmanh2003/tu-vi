// Lá số Tử Vi kiểu Việt Nam: 12 cung bao quanh, ô giữa ghi thông tin chung.
// Màu sao theo ngũ hành: Kim xám · Mộc xanh lá · Thủy đen · Hỏa đỏ · Thổ cam.

// Vị trí ô (hàng, cột) theo địa chi trên lưới 4×4
const POS = {
  Tỵ: [1, 1], Ngọ: [1, 2], Mùi: [1, 3], Thân: [1, 4],
  Thìn: [2, 1], Dậu: [2, 4],
  Mão: [3, 1], Tuất: [3, 4],
  Dần: [4, 1], Sửu: [4, 2], Tý: [4, 3], Hợi: [4, 4],
};
const EL_CLASS = { Kim: 'el-kim', Mộc: 'el-moc', Thủy: 'el-thuy', Hỏa: 'el-hoa', Thổ: 'el-tho' };
const short = (stem) => (stem ? stem[0] + '.' : '');

function Star({ s, major }) {
  const cls = [major ? 'major' : 'minor', s.el ? EL_CLASS[s.el] : 'el-none', s.bad ? 'bad' : '', s.good ? 'good' : '']
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls}>
      {major ? s.name.toUpperCase() : s.name}
      {s.b && <span className="b"> ({s.b})</span>}
      {s.hua && <span className={`hua hua-${s.hua}`}> {s.hua}</span>}
    </div>
  );
}

function Palace({ p }) {
  const [row, col] = POS[p.branch];
  return (
    <div className={`ls-cell ${p.name === 'Mệnh' ? 'is-menh' : ''}`} style={{ gridRow: row, gridColumn: col }}>
      <div className="ls-head">
        <span className="ls-cc">
          {short(p.stem)}
          {p.branch}
        </span>
        <span className={`ls-name ${p.name === 'Mệnh' ? 'menh' : ''}`}>
          {p.name.toUpperCase()}
          {p.isBody && <span className="than">{'<THÂN>'}</span>}
        </span>
        <span className="ls-dh">{p.decadal}</span>
      </div>
      <div className="ls-sub">
        <span>
          {p.sign}
          {p.el}
        </span>
        <span className="ls-majors">
          {p.majors.length ? p.majors.map((s) => <Star key={s.name} s={s} major />) : <div className="vcd">VÔ CHÍNH DIỆU</div>}
        </span>
        <span className="ls-month">{p.months.length ? `Th.${p.months.join(',')}` : ''}</span>
      </div>
      {(p.tuan || p.triet) && (
        <div className="ls-tt">
          {p.tuan && <span className="tuan">Tuần</span>}
          {p.triet && <span className="triet">Triệt</span>}
        </div>
      )}
      <div className="ls-minors">
        {p.minors.map((s, i) => (
          <Star key={s.name + i} s={s} />
        ))}
        {p.yearly.map((s, i) => (
          <div key={'y' + i} className={`minor luu ${s.el ? EL_CLASS[s.el] : 'el-none'} ${s.bad ? 'bad' : ''}`}>
            {s.name}
          </div>
        ))}
      </div>
      <div className="ls-foot">
        <span>ĐV.{p.dv ? p.dv.toUpperCase() : ''}</span>
        <span className="cs">{p.changsheng}</span>
        <span>LN.{p.ln ? p.ln.toUpperCase() : ''}</span>
      </div>
    </div>
  );
}

export default function LaSo({ data }) {
  if (!data) return null;
  const c = data.center;
  const rows = [
    ['Họ tên', c.name || '—'],
    ['Năm', `${c.year}`, c.yearCanChi],
    ['Tháng', c.month],
    ['Ngày', `${c.day}`, `dương lịch ${c.solar}`],
    ['Giờ', c.time],
    ['Nơi sinh', c.place],
    ['Năm xem', `${c.viewYear}${c.age ? `, ${c.age} tuổi` : ''}`],
    ['Âm dương', c.yinYang],
    ['Bản mệnh', `${c.napAm} – ${c.cuc}`, `(${c.relation})`],
    ['Cân lượng', c.canLuong],
    ['Chủ mệnh', c.soul],
    ['Chủ thân', c.body],
    ['Lai nhân cung', c.origin],
  ];
  return (
    <div className="laso-wrap">
      <div className="laso">
        {data.palaces.map((p) => (
          <Palace key={p.branch} p={p} />
        ))}
        <div className="ls-center" style={{ gridRow: '2 / 4', gridColumn: '2 / 4' }}>
          <div className="ls-title">Lá Số Tử Vi</div>
          <table>
            <tbody>
              {rows.map(([k, v, extra]) => (
                <tr key={k}>
                  <th>{k}:</th>
                  <td>
                    {v}
                    {extra && <span className="muted"> · {extra}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {c.canLuongMeaning && <p className="ls-cl">Cân lượng {c.canLuong}: {c.canLuongMeaning}</p>}
        </div>
      </div>
      <div className="ls-legend">
        <span>
          <b>M</b>:Miếu <b>V</b>:Vượng <b>Đ</b>:Đắc <b>L</b>:Lợi <b>B</b>:Bình/Bất <b>H</b>:Hãm
        </span>
        <span>
          <i className="el-kim">■</i> Kim <i className="el-moc">■</i> Mộc <i className="el-thuy">■</i> Thủy <i className="el-hoa">■</i>{' '}
          Hỏa <i className="el-tho">■</i> Thổ
        </span>
        <span>ĐV: cung đại vận · LN: cung lưu niên · Th.: lưu nguyệt · L.: sao lưu năm nay</span>
      </div>
    </div>
  );
}
