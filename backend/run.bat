@echo off
echo Starting ClarifyAI Backend Server...
echo.

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found!
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Verifying Python interpreter...
where python
echo.

echo Checking if dependencies are installed...
python -c "import fastapi" 2>nul
if errorlevel 1 (
    echo ERROR: Dependencies not installed!
    echo Installing dependencies now...
    echo.
    python -m pip install --upgrade pip setuptools wheel
    pip install --only-binary :all: numpy
    pip install -r requirements.txt
    echo.
    echo Dependencies installed! Starting server...
    echo.
) else (
    echo Dependencies OK. Starting server...
    echo.
)

echo Checking if .env file exists...
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Please create .env file with your API key.
    echo You can copy env.example to .env
    echo.
)

echo Starting server...
python main.py

pause



