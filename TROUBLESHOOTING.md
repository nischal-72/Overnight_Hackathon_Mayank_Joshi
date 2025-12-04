# 🔧 Troubleshooting Guide - ClarifyAI

## ❌ Localhost Not Working / Can't Access Website

### Step 1: Check if Frontend Server is Running

**Open a terminal and run:**
```bash
cd frontend
npm run dev
```

**You should see:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**If you see errors:**
- `npm: command not found` → Install Node.js from https://nodejs.org/
- `Cannot find module` → Run `npm install` first

### Step 2: Check if Backend Server is Running

**Open a NEW terminal and run:**
```bash
cd backend
venv\Scripts\activate
python main.py
```

**You should see:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Step 3: Verify URLs

**Frontend should be at:**
```
http://localhost:5173
```

**Backend should be at:**
```
http://localhost:8000
```

**Test backend directly:**
Open browser and go to: `http://localhost:8000`
- Should show: `{"message":"ClarifyAI API","status":"running"}`

### Step 4: Common Issues & Solutions

#### Issue: "This site can't be reached" or "ERR_CONNECTION_REFUSED"

**Causes:**
1. Server not running
2. Wrong port
3. Firewall blocking

**Solutions:**
```bash
# Check if port is in use
netstat -ano | findstr :5173  # Frontend
netstat -ano | findstr :8000  # Backend

# Kill process if needed (Windows)
taskkill /PID <process_id> /F

# Try different port
# In frontend/vite.config.js, change port:
server: {
  port: 3000,  # Instead of 5173
}
```

#### Issue: Frontend shows "Cannot connect to backend"

**Check:**
1. Backend is running on port 8000
2. No firewall blocking
3. CORS is configured correctly

**Test backend:**
```bash
curl http://localhost:8000
# Should return: {"message":"ClarifyAI API","status":"running"}
```

#### Issue: "Port already in use"

**Solution:**
```bash
# Find what's using the port
netstat -ano | findstr :5173

# Kill the process
taskkill /PID <process_id> /F

# Or use different port in vite.config.js
```

#### Issue: Blank page or "Failed to load"

**Check browser console (F12):**
- Look for errors
- Check Network tab for failed requests

**Common fixes:**
1. Clear browser cache
2. Hard refresh: `Ctrl + Shift + R`
3. Try incognito mode
4. Check if both servers are running

### Step 5: Quick Diagnostic Script

**Create `check_setup.bat` in project root:**

```batch
@echo off
echo Checking ClarifyAI Setup...
echo.

echo [1] Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not installed!
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [2] Checking Python...
python --version
if errorlevel 1 (
    echo ERROR: Python not installed!
    pause
    exit /b 1
)

echo [3] Checking Frontend...
cd frontend
if not exist "node_modules" (
    echo WARNING: node_modules not found. Run: npm install
) else (
    echo Frontend dependencies: OK
)
cd ..

echo [4] Checking Backend...
cd backend
if not exist "venv" (
    echo WARNING: Virtual environment not found. Run: python -m venv venv
) else (
    echo Backend venv: OK
)
if not exist ".env" (
    echo WARNING: .env file not found. Copy env.example to .env
) else (
    echo Backend .env: OK
)
cd ..

echo.
echo [5] Testing ports...
netstat -ano | findstr :5173 >nul
if errorlevel 1 (
    echo Port 5173 (Frontend): Available
) else (
    echo Port 5173 (Frontend): IN USE
)

netstat -ano | findstr :8000 >nul
if errorlevel 1 (
    echo Port 8000 (Backend): Available
) else (
    echo Port 8000 (Backend): IN USE
)

echo.
echo Diagnostic complete!
pause
```

### Step 6: Manual Start Sequence

**Terminal 1 (Backend):**
```bash
cd backend
venv\Scripts\activate
python main.py
```
**Wait for:** `INFO: Application startup complete.`

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
**Wait for:** `Local: http://localhost:5173/`

**Then open browser:**
```
http://localhost:5173
```

### Step 7: Alternative Ports

If ports 5173 or 8000 are blocked, change them:

**Frontend (`vite.config.js`):**
```js
server: {
  port: 3000,  // Change from 5173
}
```

**Backend (`main.py`):**
```python
uvicorn.run(app, host="0.0.0.0", port=8001)  # Change from 8000
```

**Frontend API (`Landing.jsx`):**
```js
const API_BASE = 'http://localhost:8001'  // Match backend port
```

### Step 8: Firewall Issues

**Windows Firewall:**
1. Open Windows Defender Firewall
2. Allow apps through firewall
3. Add Python and Node.js if needed

**Or temporarily disable firewall to test**

### Still Not Working?

1. **Check browser console (F12):**
   - Look for red errors
   - Check Network tab

2. **Check terminal output:**
   - Any error messages?
   - Are servers actually starting?

3. **Try these URLs:**
   - `http://127.0.0.1:5173`
   - `http://localhost:5173`
   - `http://0.0.0.0:5173`

4. **Verify installation:**
   ```bash
   # Frontend
   cd frontend
   npm list
   
   # Backend
   cd backend
   venv\Scripts\activate
   pip list
   ```

## 📞 Quick Checklist

- [ ] Node.js installed? (`node --version`)
- [ ] Python installed? (`python --version`)
- [ ] Frontend dependencies installed? (`cd frontend && npm install`)
- [ ] Backend dependencies installed? (`cd backend && pip install -r requirements.txt`)
- [ ] Backend .env file created with API key?
- [ ] Backend server running? (`python main.py`)
- [ ] Frontend server running? (`npm run dev`)
- [ ] Both terminals showing "ready" messages?
- [ ] Browser opened to `http://localhost:5173`?
- [ ] No firewall blocking?

If all checked, the site should work! 🎉

