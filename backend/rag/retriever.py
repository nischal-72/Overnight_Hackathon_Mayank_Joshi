"""
Retriever for RAG pipeline
"""
from typing import List, Dict
from .vector_store import VectorStore
from .embedder import Embedder

class Retriever:
    """Retrieves relevant chunks from vector store"""
    
    def __init__(self, vector_store: VectorStore):
        """
        Initialize retriever
        
        Args:
            vector_store: VectorStore instance
        """
        self.vector_store = vector_store
        self.embedder = Embedder()
    
    def retrieve(self, query: str, top_k: int = 4) -> List[Dict]:
        """
        Retrieve relevant chunks for a query
        
        Args:
            query: User query
            top_k: Number of chunks to retrieve
            
        Returns:
            List of relevant chunks with metadata
        """
        # Generate query embedding
        query_embedding = self.embedder.embed(query)
        
        # Query vector store
        results = self.vector_store.query(query_embedding, top_k=top_k)
        
        return results



