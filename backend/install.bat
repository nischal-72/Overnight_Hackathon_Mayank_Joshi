@echo off
echo Installing ClarifyAI Backend Dependencies...
echo.

REM Upgrade pip, setuptools, and wheel first
python -m pip install --upgrade pip setuptools wheel

echo.
echo Installing requirements...
pip install -r requirements.txt

echo.
echo Installation complete!
pause



