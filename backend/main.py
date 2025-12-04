from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import uuid
from datetime import datetime

from rag.chunker import DocumentChunker
from rag.embedder import Embedder
from rag.vector_store import VectorStore
from rag.retriever import Retriever
from llm.groq_client import GroqClient
from llm.gemini_client import GeminiClient
from utils.pdf_reader import PDFReader
from utils.doc_reader import DOCXReader

load_dotenv()

app = FastAPI(title="ClarifyAI API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Initialize components
chunker = DocumentChunker()
embedder = Embedder()
vector_store = VectorStore()
retriever = Retriever(vector_store)

# Initialize LLM clients (with fallback)
groq_client = None
gemini_client = None

try:
    groq_client = GroqClient()
except Exception as e:
    print(f"Warning: Groq client not initialized: {e}")

try:
    gemini_client = GeminiClient()
except Exception as e:
    print(f"Warning: Gemini client not initialized: {e}")

if not groq_client and not gemini_client:
    raise ValueError("At least one LLM API key (GROQ_API_KEY or GEMINI_API_KEY) must be set")

# Simple in-memory auth (replace with proper DB in production)
users_db = {
    "admin": {"password": "admin123", "role": "admin"},
    "employer1": {"password": "emp123", "role": "employer"},
    "employer2": {"password": "emp123", "role": "employer"},
}

# In-memory storage (replace with DB in production)
documents_db = {}
chat_history_db = {}

# Request/Response Models
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    role: str
    username: str

class QueryRequest(BaseModel):
    query: str
    username: str

class QueryResponse(BaseModel):
    answer: str
    context_used: List[str]
    sources: List[str]

class DocumentInfo(BaseModel):
    doc_id: str
    filename: str
    upload_date: str
    chunk_count: int

class SummaryRequest(BaseModel):
    doc_id: str

class SummaryResponse(BaseModel):
    summary: str

# Authentication
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    # Simple token verification (use JWT in production)
    if token in users_db:
        return {"username": token, "role": users_db[token]["role"]}
    raise HTTPException(status_code=401, detail="Invalid token")

def verify_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user = verify_token(credentials)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# Routes
@app.get("/")
async def root():
    return {"message": "ClarifyAI API", "status": "running"}

# Authentication Routes
@app.post("/admin_login", response_model=LoginResponse)
async def admin_login(login: LoginRequest):
    try:
        if not login.username or not login.password:
            raise HTTPException(status_code=400, detail="Username and password are required")
        
        if login.username in users_db and users_db[login.username]["password"] == login.password:
            if users_db[login.username]["role"] == "admin":
                return LoginResponse(
                    token=login.username,
                    role="admin",
                    username=login.username
                )
            else:
                raise HTTPException(status_code=403, detail="Admin access required")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login error: {str(e)}")

@app.post("/user_login", response_model=LoginResponse)
async def user_login(login: LoginRequest):
    try:
        if not login.username or not login.password:
            raise HTTPException(status_code=400, detail="Username and password are required")
        
        if login.username in users_db and users_db[login.username]["password"] == login.password:
            return LoginResponse(
                token=login.username,
                role=users_db[login.username]["role"],
                username=login.username
            )
        raise HTTPException(status_code=401, detail="Invalid credentials")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login error: {str(e)}")

# Admin Routes
@app.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    admin: dict = Depends(verify_admin)
):
    """Upload and process a document"""
    try:
        # Save uploaded file temporarily
        file_ext = file.filename.split(".")[-1].lower()
        if file_ext not in ["pdf", "docx"]:
            raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
        
        temp_path = f"temp_{uuid.uuid4()}.{file_ext}"
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Extract text
        if file_ext == "pdf":
            text = PDFReader.extract_text(temp_path)
        else:
            text = DOCXReader.extract_text(temp_path)
        
        # Clean up temp file
        os.remove(temp_path)
        
        if not text:
            raise HTTPException(status_code=400, detail="Could not extract text from document")
        
        # Chunk document
        chunks = chunker.chunk(text)
        
        # Generate embeddings and store
        doc_id = str(uuid.uuid4())
        embeddings = embedder.embed_batch([chunk["text"] for chunk in chunks])
        
        # Store in ChromaDB
        vector_store.add_documents(
            doc_id=doc_id,
            chunks=[chunk["text"] for chunk in chunks],
            embeddings=embeddings,
            metadata=[{"filename": file.filename, "chunk_index": i} for i in range(len(chunks))]
        )
        
        # Store document info
        documents_db[doc_id] = {
            "doc_id": doc_id,
            "filename": file.filename,
            "upload_date": datetime.now().isoformat(),
            "chunk_count": len(chunks),
            "username": admin["username"]
        }
        
        return {
            "message": "Document uploaded successfully",
            "doc_id": doc_id,
            "chunk_count": len(chunks)
        }
    
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/delete_doc/{doc_id}")
async def delete_document(
    doc_id: str,
    admin: dict = Depends(verify_admin)
):
    """Delete a document"""
    if doc_id not in documents_db:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Remove from ChromaDB
    vector_store.delete_document(doc_id)
    
    # Remove from database
    del documents_db[doc_id]
    
    return {"message": "Document deleted successfully"}

@app.get("/list_docs", response_model=List[DocumentInfo])
async def list_documents(admin: dict = Depends(verify_admin)):
    """List all documents"""
    return [
        DocumentInfo(
            doc_id=doc["doc_id"],
            filename=doc["filename"],
            upload_date=doc["upload_date"],
            chunk_count=doc["chunk_count"]
        )
        for doc in documents_db.values()
    ]

@app.post("/summarize", response_model=SummaryResponse)
async def summarize_document(
    request: SummaryRequest,
    admin: dict = Depends(verify_admin)
):
    """Generate summary of a document"""
    if request.doc_id not in documents_db:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Retrieve all chunks for the document
    doc_chunks = vector_store.get_document_chunks(request.doc_id)
    full_text = "\n\n".join(doc_chunks)
    
    # Generate summary using LLM
    summary_prompt = f"Please provide a concise summary of the following document:\n\n{full_text[:4000]}"
    
    summary = None
    if groq_client:
        try:
            summary = await groq_client.generate(summary_prompt)
        except:
            pass
    
    if not summary and gemini_client:
        try:
            summary = await gemini_client.generate(summary_prompt)
        except:
            pass
    
    if not summary:
        raise HTTPException(status_code=500, detail="LLM service unavailable")
    
    return SummaryResponse(summary=summary)

# User Routes
@app.post("/query", response_model=QueryResponse)
async def query_rag(
    request: QueryRequest,
    user: dict = Depends(verify_token)
):
    """Query the RAG system"""
    # Retrieve relevant chunks
    retrieved_chunks = retriever.retrieve(request.query, top_k=4)
    
    if not retrieved_chunks:
        return QueryResponse(
            answer="I could not find information related to your question in the uploaded documents.",
            context_used=[],
            sources=[]
        )
    
    # Build context
    context = "\n\n".join([chunk["text"] for chunk in retrieved_chunks])
    
    # RAG prompt template
    rag_prompt = f"""You are ClarifyAI. Use ONLY the provided context to answer.

Context:
{context}

User Question:
{request.query}

If answer not found in context, say:
"I could not find information related to your question in the uploaded documents."
"""
    
    # Generate answer
    answer = None
    if groq_client:
        try:
            answer = await groq_client.generate(rag_prompt)
        except:
            pass
    
    if not answer and gemini_client:
        try:
            answer = await gemini_client.generate(rag_prompt)
        except:
            pass
    
    if not answer:
        answer = "I apologize, but I'm currently unable to process your request. Please try again later."
    
    # Store chat history
    if request.username not in chat_history_db:
        chat_history_db[request.username] = []
    
    chat_history_db[request.username].append({
        "query": request.query,
        "answer": answer,
        "timestamp": datetime.now().isoformat(),
        "context_used": [chunk["text"] for chunk in retrieved_chunks],
        "sources": [chunk.get("metadata", {}).get("filename", "Unknown") for chunk in retrieved_chunks]
    })
    
    return QueryResponse(
        answer=answer,
        context_used=[chunk["text"] for chunk in retrieved_chunks],
        sources=[chunk.get("metadata", {}).get("filename", "Unknown") for chunk in retrieved_chunks]
    )

@app.get("/history")
async def get_chat_history(user: dict = Depends(verify_token)):
    """Get chat history for the user"""
    username = user["username"]
    return chat_history_db.get(username, [])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

