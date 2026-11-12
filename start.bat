@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo ========================================================
echo   나만의 영어 단어장 개발 서버를 시작합니다...
echo   (브라우저가 자동으로 열립니다: http://localhost:5173)
echo ========================================================
echo.
call npm.cmd run dev -- --open
pause
