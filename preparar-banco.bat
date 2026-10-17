@echo off
chcp 65001 >nul
title Home Care Flow - Preparar banco
cd /d "%~dp0backend"

echo ============================================
echo  Home Care Flow - Preparando o banco MySQL
echo ============================================
echo.
echo ATENCAO: o banco "homecare_flow" sera APAGADO e recriado
echo com os dados de demonstracao.
echo.
pause

if not exist ".env" (
  copy ".env.example" ".env" >nul
  echo Criei backend\.env - preencha DB_PASSWORD e rode este arquivo de novo.
  notepad ".env"
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Instalando dependencias do backend...
  call npm install
)

call npm run db:setup
echo.
pause
