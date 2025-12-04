@echo off
echo Fixing and Starting ClarifyAI Backend...
echo.

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo Creating virtual environment...
    python -m venv venv
    echo Virtual environment created.
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Verifying Python path...
where python
echo.

echo Checking if FastAPI is installed...
python -c "import fastapi" 2>nul
if errorlevel 1 (
    echo FastAPI not found! Installing dependencies...
    echo.
    python -m pip install --upgrade pip setuptools wheel
    pip install --only-binary :all: numpy
    pip install -r requirements.txt
    echo.
    echo Dependencies installed!
) else (
    echo FastAPI is installed.
)

echo.
echo Starting server...
python main.py

pause

