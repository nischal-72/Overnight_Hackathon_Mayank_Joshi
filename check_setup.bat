@echo off
echo ========================================
echo ClarifyAI Setup Diagnostic Tool
echo ========================================
echo.

echo [1] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [X] ERROR: Node.js not installed!
    echo     Download from: https://nodejs.org/
    echo.
) else (
    echo [OK] Node.js installed
    node --version
)
echo.

echo [2] Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo [X] ERROR: Python not installed!
    echo.
) else (
    echo [OK] Python installed
    python --version
)
echo.

echo [3] Checking Frontend...
cd frontend
if not exist "node_modules" (
    echo [X] WARNING: node_modules not found
    echo     Run: cd frontend ^&^& npm install
) else (
    echo [OK] Frontend dependencies installed
)
if not exist "package.json" (
    echo [X] ERROR: package.json not found!
)
cd ..
echo.

echo [4] Checking Backend...
cd backend
if not exist "venv" (
    echo [X] WARNING: Virtual environment not found
    echo     Run: cd backend ^&^& python -m venv venv
) else (
    echo [OK] Backend virtual environment exists
)
if not exist ".env" (
    echo [X] WARNING: .env file not found
    echo     Copy env.example to .env and add your API key
) else (
    echo [OK] Backend .env file exists
)
if not exist "requirements.txt" (
    echo [X] ERROR: requirements.txt not found!
)
cd ..
echo.

echo [5] Checking Ports...
echo Checking port 5173 (Frontend)...
netstat -ano | findstr :5173 >nul
if errorlevel 1 (
    echo [OK] Port 5173 is available
) else (
    echo [X] WARNING: Port 5173 is IN USE
    echo     Another process may be using this port
)

echo Checking port 8000 (Backend)...
netstat -ano | findstr :8000 >nul
if errorlevel 1 (
    echo [OK] Port 8000 is available
) else (
    echo [X] WARNING: Port 8000 is IN USE
    echo     Backend may already be running
)
echo.

echo ========================================
echo Diagnostic Complete!
echo ========================================
echo.
echo Next steps:
echo 1. If Node.js missing: Install from https://nodejs.org/
echo 2. If Python missing: Install Python 3.11+
echo 3. Start Backend: cd backend ^&^& venv\Scripts\activate ^&^& python main.py
echo 4. Start Frontend: cd frontend ^&^& npm run dev
echo 5. Open browser: http://localhost:5173
echo.
pause

