ClarifyAI — Document Question Answering System

ClarifyAI is an AI-powered system that lets users upload documents and ask questions about their content. It uses modern LLMs, embeddings, and vector search to generate accurate, context-aware answers.

🔍 Key Features

Upload PDFs or text files

Automatic text extraction & chunking

Embedding generation using Sentence Transformers

Semantic search with ChromaDB

LLM-powered question answering

FastAPI backend with clean modular structure

🛠️ Tech Stack

Python 3.11, FastAPI, Uvicorn

Sentence Transformers, Transformers

ChromaDB (Vector Database)

ONNX Runtime, Tokenizers / Tiktoken

Google Gemini / Groq LLM API

📁 Structure
backend/
│── main.py
│── routes/
│── services/
│── models/
│── utils/
│── requirements.txt

🚀 Setup
1. Clone the repository
git clone https://github.com/your-username/ClarifyAI.git
cd ClarifyAI/backend

2. Create and activate Python 3.11 virtual environment
py -3.11 -m venv venv
venv\Scripts\activate

3. Install dependencies
pip install -r requirements.txt

4. Run the server
uvicorn main:app --reload


API Docs:
http://127.0.0.1:8000/docs

🧠 How It Works

User uploads a document

Text is extracted, cleaned, and chunked

Each chunk is converted into vector embeddings

Semantic search retrieves relevant chunks

LLM generates the final answer based on retrieved context

📌 Project Goals

Build a real-world RAG-based AI system

Demonstrate backend + AI engineering skills

Create a strong portfolio project for recruiters