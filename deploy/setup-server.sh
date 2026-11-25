#!/usr/bin/env bash
# Cài web Tử Vi lên máy ảo Ubuntu (Oracle Cloud Always Free, chip ARM Ampere).
# Cần sẵn: /tmp/tu-vi.tgz (code), /tmp/ngrok.yml (cấu hình ngrok), biến NGROK_DOMAIN.
#   NGROK_DOMAIN=xxx.ngrok-free.dev bash setup-server.sh
set -euo pipefail
APP_DIR=/opt/tu-vi
USER_NAME="$(whoami)"
: "${NGROK_DOMAIN:?Thiếu NGROK_DOMAIN}"

echo "== 1. Cập nhật hệ thống =="
sudo apt-get update -y
sudo apt-get install -y curl ca-certificates tar gnupg

echo "== 2. Node.js 22 =="
if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
node -v

echo "== 3. Ollama + model =="
if ! command -v ollama >/dev/null; then
  curl -fsSL https://ollama.com/install.sh | sh
fi
sudo systemctl enable --now ollama
for i in $(seq 1 30); do curl -s http://localhost:11434/api/version >/dev/null && break; sleep 2; done
ollama pull qwen2.5:7b

echo "== 4. ngrok =="
if ! command -v ngrok >/dev/null; then
  curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
  echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list >/dev/null
  sudo apt-get update -y && sudo apt-get install -y ngrok
fi
mkdir -p "$HOME/.config/ngrok"
install -m 600 /tmp/ngrok.yml "$HOME/.config/ngrok/ngrok.yml"
rm -f /tmp/ngrok.yml

echo "== 5. Code web =="
sudo mkdir -p "$APP_DIR"
sudo tar -xzf /tmp/tu-vi.tgz -C "$APP_DIR"
sudo chown -R "$USER_NAME:$USER_NAME" "$APP_DIR"
cd "$APP_DIR"
cat > .env <<EOF
LLM_PROVIDER=ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
OLLAMA_MODEL_DEEP=qwen2.5:7b
OLLAMA_THINK=false
API_PORT=3001
# Máy chủ chỉ có CPU: mỗi lần trả lời 1 người để không bị nghẽn
CHAT_CONCURRENT=1
CHAT_LIMIT=6
EOF
npm ci --no-audit --no-fund
npm run build

echo "== 6. Dịch vụ tự chạy (systemd) =="
sudo tee /etc/systemd/system/tuvi.service >/dev/null <<EOF
[Unit]
Description=Web Tu Vi
After=network-online.target ollama.service
Wants=network-online.target

[Service]
User=$USER_NAME
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

sudo tee /etc/systemd/system/tuvi-ngrok.service >/dev/null <<EOF
[Unit]
Description=ngrok tunnel cho Web Tu Vi
After=network-online.target tuvi.service
Wants=network-online.target

[Service]
User=$USER_NAME
ExecStart=/usr/bin/ngrok http 3001 --url https://$NGROK_DOMAIN --log stdout --log-level warn
Restart=always
RestartSec=15

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now tuvi.service
sleep 3
sudo systemctl enable --now tuvi-ngrok.service
sleep 5
systemctl --no-pager --lines=3 status tuvi.service tuvi-ngrok.service || true
echo "== XONG: https://$NGROK_DOMAIN =="
