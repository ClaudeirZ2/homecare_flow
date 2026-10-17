@echo off
chcp 65001 >nul
title Home Care Flow
cd /d "%~dp0"

echo ============================================
echo  Home Care Flow - Iniciando API e Frontend
echo ============================================

if not exist "backend\.env" (
  echo Falta o arquivo backend\.env. Rode primeiro o preparar-banco.bat
  pause
  exit /b 1
)

if not exist "backend\node_modules" (
  echo Instalando dependencias do backend...
  pushd backend & call npm install & popd
)
if not exist "frontend\node_modules" (
  echo Instalando dependencias do frontend...
  pushd frontend & call npm install & popd
)

start "Home Care Flow - API (porta 5000)" cmd /k "cd /d %~dp0backend && npm run dev"
start "Home Care Flow - Frontend (porta 3000)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Aguardando os servidores subirem...
timeout /t 6 /nobreak >nul
start "" http://localhost:3000

echo.
echo Pronto! Duas janelas foram abertas (API e Frontend).
echo Para parar o sistema, feche essas duas janelas.
echo.
echo Login: admin@homecareflow.com  /  123456
echo        juliana@homecareflow.com /  123456 (tecnica)
echo.
pause
