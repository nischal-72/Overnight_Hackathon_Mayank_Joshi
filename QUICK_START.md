# 🚀 Quick Start Guide - ClarifyAI

## Step-by-Step Setup Instructions

### 1️⃣ Backend Setup

Open a terminal/command prompt and run:

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (if not already activated)
venv\Scripts\activate

# Install dependencies (use the fix script for Windows)
install_fix.bat
```

**OR manually:**
```bash
python -m pip install --upgrade pip setuptools wheel
pip install --only-binary :all: numpy
pip install -r requirements.txt
```

### 2️⃣ Create Environment File

Create a `.env` file in the `backend` directory:

```bash
# Copy the example file
copy env.example .env
```

Then edit `.env` and add your API key:
```env
GROQ_API_KEY=your_groq_api_key_here
# OR
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get API Keys:**
- Groq: https://console.groq.com/ (Free tier available)
- Gemini: https://makersuite.google.com/app/apikey

### 3️⃣ Start Backend Server

```bash
# Make sure you're in backend directory with venv activated
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

**Keep this terminal open!** The backend needs to keep running.

### 4️⃣ Frontend Setup (New Terminal)

Open a **NEW** terminal window and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### 5️⃣ Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## 🎯 Test the Application

### Login Credentials:

**Admin:**
- Username: `admin`
- Password: `admin123`

**Employer:**
- Username: `employer1`
- Password: `emp123`

### Quick Test Flow:

1. **Login as Admin:**
   - Click "Admin Login"
   - Enter: `admin` / `admin123`
   - Upload a PDF or DOCX document
   - View documents list

2. **Login as Employer:**
   - Click "Employer Login"
   - Enter: `employer1` / `emp123`
   - Go to Chat page
   - Ask questions about uploaded documents

## ⚠️ Troubleshooting

### Backend won't start:
- Make sure `.env` file exists with API key
- Check if port 8000 is already in use
- Verify virtual environment is activated

### Frontend won't start:
- Make sure Node.js is installed (`node --version`)
- Delete `node_modules` and run `npm install` again

### API connection errors:
- Make sure backend is running on port 8000
- Check browser console for CORS errors
- Verify API key is correct in `.env` file

## 📝 Next Steps

1. Upload documents as admin
2. Ask questions as employer
3. View chat history
4. Generate document summaries

Enjoy using ClarifyAI! 🎉



