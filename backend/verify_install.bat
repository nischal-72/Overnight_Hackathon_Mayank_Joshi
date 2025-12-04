@echo off
echo Verifying ClarifyAI Backend Installation...
echo.

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found!
    echo Creating virtual environment...
    python -m venv venv
    echo Virtual environment created.
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Checking Python version...
python --version

echo.
echo Checking if FastAPI is installed...
python -c "import fastapi; print('FastAPI version:', fastapi.__version__)" 2>nul
if errorlevel 1 (
    echo FastAPI not found! Installing dependencies...
    echo.
    python -m pip install --upgrade pip setuptools wheel
    pip install --only-binary :all: numpy
    pip install -r requirements.txt
    echo.
    echo Installation complete!
) else (
    echo FastAPI is installed correctly!
)

echo.
echo Verifying other key packages...
python -c "import chromadb; print('ChromaDB: OK')" 2>nul || echo "ChromaDB: NOT FOUND"
python -c "import sentence_transformers; print('Sentence Transformers: OK')" 2>nul || echo "Sentence Transformers: NOT FOUND"
python -c "import groq; print('Groq: OK')" 2>nul || echo "Groq: NOT FOUND"

echo.
echo Verification complete!
pause



