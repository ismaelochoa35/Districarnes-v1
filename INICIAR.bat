@echo off
title Districarnes
cd /d "%~dp0BACKEND"
if not exist node_modules (
  echo Instalando dependencias...
  call npm install
)
if not exist .env (
  echo Falta configurar BACKEND\.env
  echo Crea el archivo .env con los datos indicados en README.md.
  pause
  exit /b 1
)
start "" http://localhost:3000
call npm start
