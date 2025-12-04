# ClarifyAI - Intelligent Document Analyzer

A production-grade full-stack application for intelligent document analysis and RAG-based question answering system.

## 🚀 Features

### Admin Role
- ✅ Upload PDF/DOCX documents
- ✅ Delete documents
- ✅ View document list with chunk counts
- ✅ Generate document summaries
- ✅ Manage database

### Employer Role (Regular User)
- ✅ Ask questions to RAG system
- ✅ View chat history
- ✅ No upload/delete privileges

## 🛠️ Tech Stack

### Backend
- **FastAPI** (Python 3.11)
- **ChromaDB** - Vector database
- **Sentence Transformers** - Embeddings
- **Groq API** or **Gemini Flash** - LLM
- **pypdf** - PDF processing
- **python-docx** - DOCX processing

### Frontend
- **React** + **Vite**
- **TailwindCSS** - Styling
- **ShadCN UI** - Component library
- **Axios** - HTTP client
- **Framer Motion** - Animations

## 📁 Project Structure

```
clarifyai/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── rag/
│   │   ├── chunker.py          # Document chunking
│   │   ├── embedder.py         # Embedding generation
│   │   ├── vector_store.py     # ChromaDB integration
│   │   └── retriever.py        # RAG retrieval
│   ├── llm/
│   │   ├── groq_client.py      # Groq API client
│   │   └── gemini_client.py    # Gemini API client
│   ├── utils/
│   │   ├── pdf_reader.py       # PDF extraction
│   │   └── doc_reader.py       # DOCX extraction
│   ├── models/                 # Data models
│   ├── requirements.txt        # Python dependencies
│   └── .env.example           # Environment variables template
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Landing.jsx     # Landing page
    │   │   ├── Chat.jsx        # Chat interface
    │   │   ├── AdminDashboard.jsx
    │   │   ├── Upload.jsx      # Document upload
    │   │   └── Documents.jsx   # Document list
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ChatBubble.jsx
    │   │   └── FileCard.jsx
    │   ├── App.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. **Upgrade pip, setuptools, and wheel first (IMPORTANT):**
   ```bash
   python -m pip install --upgrade pip setuptools wheel
   ```

5. **Install dependencies:**
   
   **For Windows (if you encounter numpy build errors):**
   ```bash
   install_fix.bat
   ```
   
   Or manually:
   ```bash
   pip install --only-binary :all: numpy
   pip install -r requirements.txt
   ```
   
   **For Linux/Mac:**
   ```bash
   pip install -r requirements.txt
   ```
   
   **Alternative install scripts:**
   - Windows: `install.bat`
   - Linux/Mac: `chmod +x install.sh && ./install.sh`

6. **Set up environment variables:**
   Create a `.env` file in the `backend` directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   # OR
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   **Note:** You need at least one API key (Groq or Gemini). Groq is preferred for faster responses.

7. **Run the backend server:**
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 🧪 Testing

### Test Document Upload

1. Login as admin:
   - Username: `admin`
   - Password: `admin123`

2. Navigate to Admin Dashboard → Upload Document

3. Upload a PDF or DOCX file

4. Verify the document appears in the Documents list with chunk count

### Test RAG Query Pipeline

1. Login as employer:
   - Username: `employer1` or `employer2`
   - Password: `emp123`

2. Navigate to Chat page

3. Ask a question about the uploaded documents

4. Verify:
   - Answer is generated
   - Context used panel shows retrieved chunks
   - Sources are displayed

### Test Role-Based Login

1. **Admin Login:**
   - Use `/admin_login` endpoint or Admin Login button
   - Should redirect to Admin Dashboard
   - Can access upload, documents, and summary features

2. **Employer Login:**
   - Use `/user_login` endpoint or Employer Login button
   - Should redirect to Chat page
   - Cannot access admin routes

## 📡 API Endpoints

### Authentication
- `POST /admin_login` - Admin login
- `POST /user_login` - User/Employer login

### Admin Routes (Requires Admin Token)
- `POST /upload` - Upload document
- `DELETE /delete_doc/{doc_id}` - Delete document
- `GET /list_docs` - List all documents
- `POST /summarize` - Generate document summary

### User Routes (Requires User Token)
- `POST /query` - Query RAG system
- `GET /history` - Get chat history

## 🔧 Configuration

### RAG Pipeline Settings

The RAG pipeline uses the following default settings (can be modified in code):

- **Chunk Size:** 400 tokens (300-500 range)
- **Overlap:** 75 tokens (50-100 range)
- **Embedding Model:** `sentence-transformers/all-mpnet-base-v2`
- **Retrieval:** Top 4 chunks (top_k=4)

### Default Users

The system comes with pre-configured users:

- **Admin:**
  - Username: `admin`
  - Password: `admin123`

- **Employers:**
  - Username: `employer1`, Password: `emp123`
  - Username: `employer2`, Password: `emp123`

**Note:** In production, replace the in-memory authentication with a proper database and JWT tokens.

## 🎨 UI Features

- **Glassmorphism Design** - Modern glass-like UI elements
- **Neumorphism Effects** - Soft shadow effects
- **Animated Gradients** - Smooth color transitions
- **Framer Motion Animations** - Smooth page transitions
- **Responsive Design** - Works on all screen sizes

## 🔒 Security Notes

- Current implementation uses simple token-based auth (username as token)
- For production, implement:
  - JWT tokens
  - Password hashing (bcrypt)
  - Database for user management
  - Rate limiting
  - CORS configuration

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using FastAPI, React, and ChromaDB**

