@echo off
echo Starting ClarifyAI Frontend...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies first...
    call npm install
    echo.
)

echo Starting development server...
npm run dev

pause

