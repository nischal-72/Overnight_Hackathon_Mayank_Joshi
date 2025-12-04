# Backend Setup Guide

## Correct Virtual Environment Creation

**WRONG:**
```bash
python -3.11 -m venv venv  # ❌ This is incorrect syntax
```

**CORRECT:**
```bash
python -m venv venv  # ✅ Correct syntax
```

## Complete Setup Steps

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

4. **Verify activation:**
   ```bash
   where python  # Windows
   which python  # Linux/Mac
   ```
   Should show: `...\backend\venv\Scripts\python.exe`

5. **Install dependencies:**
   ```bash
   install_fix.bat  # Windows
   # OR manually:
   python -m pip install --upgrade pip setuptools wheel
   pip install --only-binary :all: numpy
   pip install -r requirements.txt
   ```

6. **Create .env file:**
   ```bash
   copy env.example .env
   ```
   Then edit `.env` and add your API key.

7. **Run the server:**
   ```bash
   python main.py
   # OR use the run script:
   run.bat
   ```

## Troubleshooting

### "ModuleNotFoundError: No module named 'fastapi'"
- Make sure virtual environment is activated (you should see `(venv)` in prompt)
- Run `install_fix.bat` again
- Verify with: `python -c "import fastapi; print('OK')"`

### "Cannot connect to server"
- Make sure backend is running (`python main.py`)
- Check if port 8000 is available
- Verify `.env` file exists with API key

### Login page buffers/hangs
- Check backend is running
- Check browser console for errors
- Verify CORS settings in `main.py`
- Try refreshing the page

