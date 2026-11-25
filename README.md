# Tử Vi Chatbot

*A web app that builds a Vietnamese Tử Vi Đẩu Số (Zi Wei Dou Shu) birth chart and lets you ask an AI about it. Runs locally with Ollama, or with the Claude API. React + Vite front end, Node/Express server, charts calculated with iztro and converted to the Vietnamese lunar calendar.*

Web app lập lá số Tử Vi Đẩu Số và hỏi đáp luận giải với AI. Mặc định chạy **hoàn toàn local**.

- **Tính lá số**: [iztro](https://github.com/SylarLong/iztro), chạy ở server, có tiếng Việt
- **Hiển thị lá số**: [react-iztro](https://github.com/SylarLong/react-iztro)
- **Chatbot**: mặc định dùng [Ollama](https://ollama.com) chạy local (`qwen2.5:7b`). Có thể đổi sang Claude API.
  Server tính lá số trước rồi gửi bản tóm tắt cho AI, nên AI chỉ diễn giải chứ không tự tính lá số.

## Chạy thử

1. Cài Node.js 20 trở lên và [Ollama](https://ollama.com).
2. Tải model, cài thư viện và tạo kho kiến thức:
   ```bash
   ollama pull qwen2.5:7b
   npm install
   git clone --depth 1 https://github.com/Renhuai123/ziwei-doushu.git references/ziwei-doushu
   npm run kb
   ```
3. Tạo file `.env` từ `.env.example`. Mặc định đã là chạy local, không cần sửa gì.
4. Chạy chế độ dev (API ở cổng 3001, đổi bằng `API_PORT`; web ở cổng 5173):
   ```bash
   npm run dev
   ```
5. Mở http://localhost:5173

Chạy production: `npm run build` rồi `npm start`, sau đó mở http://localhost:3001

## Đổi AI

Đổi trong `.env`, sau đó khởi động lại server:

| Muốn | Đặt |
|---|---|
| Model local khác | `OLLAMA_MODEL=qwen3:8b` (chạy `ollama pull qwen3:8b` trước) |
| Dùng Claude API | `LLM_PROVIDER=claude` và điền `ANTHROPIC_API_KEY=` |

Model 7–8B chạy tốt trên GPU 8GB. Model càng lớn thì luận giải càng tốt nhưng chạy càng chậm.

## Ngày giờ sinh được chuẩn hóa thế nào

Trước khi lập lá số, server ([server/resolve-birth.js](server/resolve-birth.js)) làm các bước:

1. **Âm lịch Việt Nam (UTC+7)** theo thuật toán Hồ Ngọc Đức ([server/vn-lunar.js](server/vn-lunar.js)).
   iztro dùng âm lịch Trung Quốc (UTC+8), nên server tìm một ngày dương "thay thế" có cùng ngày âm Việt Nam để đưa cho iztro.
   Ví dụ 21/1/1985 là mùng 1 Tết Ất Sửu ở Việt Nam, nhưng là 1/12 năm Giáp Tý ở Trung Quốc.
2. **Nơi sinh**:
   - Miền Nam (từ Quảng Trị trở vào) giai đoạn 1/1/1960 – 13/6/1975 dùng giờ UTC+8, nên lùi 1 tiếng.
   - Sinh ở nước ngoài: chọn múi giờ (và giờ mùa hè nếu có). Âm lịch được tính theo múi giờ nơi sinh.
3. **Giờ mặt trời thật** (tùy chọn, mặc định tắt): chỉnh theo kinh độ tỉnh lỵ và phương trình thời gian.
4. **Giờ Tý muộn** (23h–24h) được tính sang ngày hôm sau.

Thông tin sau khi chỉnh và lý do chỉnh hiện ngay phía trên lá số.
Lưu ý: ô trung tâm của lá số react-iztro có thể hiện ngày dương "thay thế"; ngày đúng là dòng phía trên lá số.

## Ba tab: Lá số · Luận giải · 10 năm tới

- **Luận giải** ([server/report.js](server/report.js)): do code tạo từ dữ liệu, không phụ thuộc AI — cách cục, luận từng cung
  theo **tinh hệ** (38 tổ hợp chính tinh trong [server/tinh-he.js](server/tinh-he.js)), phụ tinh, tứ hóa, sức mạnh cung, các đại hạn.
- **10 năm tới** ([server/yearly.js](server/yearly.js)): mỗi năm nêu biến động cụ thể (đổi việc, hao tài, hỷ sự, di chuyển, sức khỏe,
  năm tuổi, chuyển đại hạn…) kèm lý do (tứ hóa lưu niên rơi vào cung nào, sao lưu Mã/Lộc/Kình/Đà/Loan/Hỷ).
- Chatbot cũng nhận cả tinh hệ và bảng 10 năm, nên trả lời được "năm nào, biến động gì".

Chế độ chat: **Nhanh** = `qwen2.5:7b` (~30 giây), **Kỹ** = `qwen3:8b` (~2–3 phút). Đổi trong `.env` (`OLLAMA_MODEL`, `OLLAMA_MODEL_DEEP`).
So sánh model: `node scripts/compare-models.js qwen2.5:7b qwen3:8b` (đổi câu hỏi bằng biến `Q`).

## AI được cung cấp gì để luận cho cụ thể

Với mỗi câu hỏi, server ghép vào prompt:

1. **Lá số đầy đủ** (12 cung, sao, độ sáng, tứ hóa, đại hạn, lưu niên).
2. **Cách cục tự phát hiện** ([server/patterns.js](server/patterns.js)): Tử Phủ đồng cung, Quân thần khánh hội, Phủ Tướng triều viên,
   Sát Phá Tham, Cơ Nguyệt Đồng Lương, Dương Lương Xương Lộc, Nhật Nguyệt tịnh minh/phản bối, Minh Châu xuất hải, Lộc Mã giao trì,
   Tam kỳ gia hội, các cách giáp Mệnh (Tả Hữu, Xương Khúc, Khôi Việt, Hỏa Linh, Không Kiếp), Dương Đà giáp Kỵ, Mã đầu đới tiễn…
   kèm điều kiện tăng thêm và phá cách.
3. **Điểm sức mạnh 12 cung** và **dòng thời gian đại hạn** để AI nói được cung nào mạnh/yếu, độ tuổi nào thuận lợi.
4. **Từ điển sao tiếng Việt** ([server/star-dict.js](server/star-dict.js)): 14 chính tinh (bản chất, khi sáng/khi hãm, nghề hợp,
   ý nghĩa ở Quan Lộc/Tài Bạch/Phu Thê), lục cát, lục sát, Lộc Tồn, Thiên Mã, tứ hóa. Chỉ những sao có trong các cung liên quan mới được đưa vào.
   Bạn có thể tự sửa/bổ sung nội dung ở file này.
5. **Câu luận Nghê Hải Hạ** liên quan (xem dưới).
6. **Cấu trúc trả lời bắt buộc**: căn cứ → luận giải → kết luận cụ thể → thời điểm → lời khuyên
   (câu hỏi tổng quan thì luận lần lượt Mệnh, Quan, Tài, Phu Thê, Phúc, các giai đoạn đời).

## Kho kiến thức Nghê Hải Hạ

Chatbot tra cứu **1848 câu luận** của thầy Nghê Hải Hạ (《天纪·紫微斗数》), lấy từ repo
[Renhuai123/ziwei-doushu](https://github.com/Renhuai123/ziwei-doushu/tree/main/docs/tianji-ziwei).
Với mỗi câu hỏi, server xác định cung cần xem (sự nghiệp → Quan Lộc, tình duyên → Phu Thê, năm nay → cung lưu niên/đại hạn…),
lấy các sao trong cung đó và tam phương tứ chính, rồi chọn khoảng 24 câu luận khớp nhất để đưa cho AI.
Dưới mỗi câu trả lời có link tới đúng đoạn video gốc.

> Giấy phép của các câu luận là **CC BY-NC-SA 4.0**: chỉ dùng **phi thương mại** và phải ghi nguồn.
> Nếu sau này làm app thương mại, cần bỏ kho này hoặc thay bằng nội dung tự viết.

## Cấu trúc

```
server/
  index.js    Express: POST /api/chart, POST /api/chat (stream)
  llm.js      Gọi AI: Ollama (local) hoặc Claude API
  knowledge.js Chọn câu luận Nghê Hải Hạ theo lá số + câu hỏi
scripts/
  build-knowledge.js  Tạo data/tianji.json từ references/ziwei-doushu
  chart.js    Lập lá số bằng iztro và chuyển thành văn bản cho AI
  prompt.js   System prompt cho "Thầy Tử Vi"
src/
  App.jsx       Bố cục trang + lá số (react-iztro)
  BirthForm.jsx Form ngày giờ sinh
  Chat.jsx      Khung chat, nhận câu trả lời dạng stream
```

## Ghi chú

- Giờ sinh dùng chỉ số của iztro: 0 = Tý sớm (00–01h), 1–11 = Sửu…Hợi, 12 = Tý muộn (23–24h).
- Muốn sửa giọng văn hoặc cách luận giải thì chỉnh `server/prompt.js`.
- `data/tags.vi.json` là bản dịch tiếng Việt các tiêu đề trong bộ câu luận Nghê Hải Hạ, nên cũng theo giấy phép **CC BY-NC-SA 4.0** như bộ dữ liệu gốc.
