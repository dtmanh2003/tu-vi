import { useState } from 'react';
import { PROVINCES, FOREIGN, TIMEZONES } from './places.js';

// Chỉ số giờ của iztro: 0 = Tý sớm, 1..11 = Sửu..Hợi, 12 = Tý muộn
export const HOURS = [
  'Tý sớm (00:00–01:00)',
  'Sửu (01:00–03:00)',
  'Dần (03:00–05:00)',
  'Mão (05:00–07:00)',
  'Thìn (07:00–09:00)',
  'Tỵ (09:00–11:00)',
  'Ngọ (11:00–13:00)',
  'Mùi (13:00–15:00)',
  'Thân (15:00–17:00)',
  'Dậu (17:00–19:00)',
  'Tuất (19:00–21:00)',
  'Hợi (21:00–23:00)',
  'Tý muộn (23:00–24:00)',
];

export default function BirthForm({ initial, onSubmit, busy }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const foreign = form.place === FOREIGN;

  return (
    <form
      className="card form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ ...form, timeIndex: Number(form.timeIndex), tzOffset: Number(form.tzOffset) });
      }}
    >
      <label>
        Họ tên (không bắt buộc)
        <input value={form.name} onChange={set('name')} placeholder="Nguyễn Văn A" />
      </label>

      <div className="row">
        <label>
          Lịch
          <select value={form.calendar} onChange={set('calendar')}>
            <option value="solar">Dương lịch</option>
            <option value="lunar">Âm lịch</option>
          </select>
        </label>
      </div>

      <div className="row date-row">
        <label>
          Ngày
          <select value={form.day} onChange={set('day')}>
            {Array.from({ length: 31 }, (_, i) => i + 1)
              .filter((d) => form.calendar === 'solar' || d <= 30)
              .map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
          </select>
        </label>
        <label>
          Tháng
          <select value={form.month} onChange={set('month')}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label>
          Năm
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            required
            pattern="(19|20)\d{2}"
            title="Nhập năm 4 chữ số, ví dụ 1995"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value.replace(/\D/g, '').slice(0, 4) })}
            placeholder="vd. 1995"
          />
        </label>
      </div>

      {form.calendar === 'lunar' && (
        <label className="check">
          <input type="checkbox" checked={form.isLeapMonth} onChange={set('isLeapMonth')} /> Tháng nhuận
        </label>
      )}

      <div className="row">
        <label>
          Giờ sinh
          <select value={form.timeMode} onChange={set('timeMode')}>
            <option value="exact">Biết giờ:phút</option>
            <option value="branch">Chỉ biết canh giờ</option>
          </select>
        </label>
        {form.timeMode === 'exact' ? (
          <label>
            Giờ:phút (giờ đồng hồ)
            <input type="time" required value={form.time} onChange={set('time')} />
          </label>
        ) : (
          <label>
            Canh giờ
            <select value={form.timeIndex} onChange={set('timeIndex')}>
              {HOURS.map((h, i) => (
                <option key={i} value={i}>
                  {h}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="row">
        <label>
          Nơi sinh
          <select value={form.place} onChange={set('place')}>
            {PROVINCES.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
            <option value={FOREIGN}>{FOREIGN}</option>
          </select>
        </label>
        <label>
          Giới tính
          <select value={form.gender} onChange={set('gender')}>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </label>
      </div>

      {foreign && (
        <div className="row">
          <label>
            Múi giờ nơi sinh
            <select value={form.tzOffset} onChange={set('tzOffset')}>
              {TIMEZONES.map((z) => (
                <option key={z} value={z}>
                  UTC{z >= 0 ? '+' : ''}
                  {z}
                </option>
              ))}
            </select>
          </label>
          <label className="check">
            <input type="checkbox" checked={form.dst} onChange={set('dst')} disabled={form.timeMode !== 'exact'} /> Đang
            giờ mùa hè (DST)
          </label>
        </div>
      )}

      {!foreign && form.timeMode === 'exact' && (
        <label className="check">
          <input type="checkbox" checked={form.trueSolar} onChange={set('trueSolar')} /> Chỉnh theo giờ mặt trời thật
          <span className="hint">(tùy chọn, chỉ đáng kể khi sinh sát ranh giới 2 canh giờ)</span>
        </label>
      )}

      <button type="submit" disabled={busy}>
        {busy ? 'Đang lập…' : 'Lập lá số'}
      </button>
    </form>
  );
}
