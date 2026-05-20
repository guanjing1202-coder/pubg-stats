@echo off
echo Starting PUBG Stats App...
echo.

echo [1/2] Starting Backend (port 3001)...
cd backend
start "PUBG Stats - Backend" cmd /k "npm install && npm run dev"
cd ..

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend (port 5173)...
cd frontend
start "PUBG Stats - Frontend" cmd /k "npm install && npm run dev"
cd ..

echo.
echo Done! Open http://localhost:5173 in your browser.
pause
