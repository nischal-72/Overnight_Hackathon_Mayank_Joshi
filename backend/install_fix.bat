@echo off
echo Installing ClarifyAI Backend Dependencies (Fixed for Windows)...
echo.

REM Check if virtual environment exists, create if not
if not exist "venv\Scripts\activate.bat" (
    echo Creating virtual environment...
    python -m venv venv
    echo Virtual environment created.
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Upgrading pip, setuptools, and wheel...
python -m pip install --upgrade pip setuptools wheel

echo.
echo Installing numpy first (with pre-built wheel)...
pip install --only-binary :all: numpy

echo.
echo Installing other requirements...
pip install -r requirements.txt

echo.
echo Installation complete!
echo.
echo IMPORTANT: Always activate the virtual environment before running:
echo   venv\Scripts\activate
echo.
pause

