# Khởi động web Tử Vi để truy cập công khai (dùng được khi tự chạy cùng Windows):
#   1. Build giao diện  2. Chạy server ở cổng 3001  3. Mở đường hầm ngrok với tên miền cố định
#   ngrok bị ngắt (rớt mạng…) thì tự mở lại sau 15 giây.
# Chạy tay:  powershell -ExecutionPolicy Bypass -File C:\projects\tu-vi\start-web.ps1
Set-Location $PSScriptRoot
$env:Path = "C:\Program Files\nodejs;" + $env:Path
$Ngrok = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe'
$LogDir = Join-Path $PSScriptRoot 'logs'
New-Item -ItemType Directory -Force $LogDir | Out-Null

# Tên miền cố định của ngrok (lưu trong ngrok-domain.txt)
$NgrokDomain = ''
$domainFile = Join-Path $PSScriptRoot 'ngrok-domain.txt'
if (Test-Path $domainFile) { $NgrokDomain = (Get-Content $domainFile -Raw).Trim() }

function Test-Port($port) {
  try { $c = New-Object Net.Sockets.TcpClient; $c.Connect('127.0.0.1', $port); $c.Close(); return $true } catch { return $false }
}

# Chờ có mạng (khi vừa bật máy)
for ($i = 0; $i -lt 30; $i++) {
  if (Test-Connection -ComputerName 1.1.1.1 -Count 1 -Quiet) { break }
  Start-Sleep -Seconds 5
}

Write-Host '== Build giao diện ==' -ForegroundColor Cyan
& npm.cmd run build *> (Join-Path $LogDir 'build.log')

if (Test-Port 3001) {
  Write-Host 'Server đã chạy sẵn ở cổng 3001.' -ForegroundColor Yellow
} else {
  Write-Host '== Chạy server (cổng 3001) ==' -ForegroundColor Cyan
  Start-Process -FilePath 'C:\Program Files\nodejs\node.exe' -ArgumentList 'server/index.js' -WorkingDirectory $PSScriptRoot `
    -WindowStyle Hidden -RedirectStandardOutput (Join-Path $LogDir 'server.log') -RedirectStandardError (Join-Path $LogDir 'server-error.log')
  Start-Sleep -Seconds 3
}

if (-not $NgrokDomain -or -not (Test-Path $Ngrok)) {
  Write-Host 'Chưa cấu hình ngrok — web chỉ chạy trên máy này: http://localhost:3001' -ForegroundColor Yellow
  exit 0
}

Write-Host "== Đường hầm ngrok: https://$NgrokDomain ==" -ForegroundColor Cyan
while ($true) {
  & $Ngrok http 3001 --url "https://$NgrokDomain" --log (Join-Path $LogDir 'ngrok.log') --log-level warn
  Write-Host 'ngrok bị ngắt, mở lại sau 15 giây…' -ForegroundColor Yellow
  Start-Sleep -Seconds 15
}
