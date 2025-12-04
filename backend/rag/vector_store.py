"""
Vector store using ChromaDB
"""
import chromadb
from chromadb.config import Settings
from typing import List, Dict, Optional
import os

class VectorStore:
    """Manages vector storage using ChromaDB"""
    
    def __init__(self, persist_directory: str = "./chroma_db"):
        """
        Initialize ChromaDB vector store
        
        Args:
            persist_directory: Directory to persist ChromaDB data
        """
        self.persist_directory = persist_directory
        os.makedirs(persist_directory, exist_ok=True)
        
        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name="clarifyai_documents",
            metadata={"hnsw:space": "cosine"}
        )
    
    def add_documents(
        self,
        doc_id: str,
        chunks: List[str],
        embeddings: List[List[float]],
        metadata: List[Dict]
    ):
        """
        Add documents to vector store
        
        Args:
            doc_id: Document identifier
            chunks: List of text chunks
            embeddings: List of embedding vectors
            metadata: List of metadata dictionaries
        """
        ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
        
        # Add metadata with doc_id
        enriched_metadata = [
            {**meta, "doc_id": doc_id} for meta in metadata
        ]
        
        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=chunks,
            metadatas=enriched_metadata
        )
    
    def query(
        self,
        query_embedding: List[float],
        top_k: int = 4,
        doc_id: Optional[str] = None
    ) -> List[Dict]:
        """
        Query the vector store
        
        Args:
            query_embedding: Query embedding vector
            top_k: Number of results to return
            doc_id: Optional document ID to filter by
            
        Returns:
            List of results with text, metadata, and distance
        """
        where = {"doc_id": doc_id} if doc_id else None
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=where
        )
        
        # Format results
        formatted_results = []
        if results["ids"] and len(results["ids"][0]) > 0:
            for i in range(len(results["ids"][0])):
                formatted_results.append({
                    "text": results["documents"][0][i],
                    "metadata": results["metadatas"][0][i],
                    "distance": results["distances"][0][i] if "distances" in results else None
                })
        
        return formatted_results
    
    def delete_document(self, doc_id: str):
        """
        Delete all chunks for a document
        
        Args:
            doc_id: Document identifier
        """
        # Get all IDs for this document
        results = self.collection.get(
            where={"doc_id": doc_id}
        )
        
        if results["ids"]:
            self.collection.delete(ids=results["ids"])
    
    def get_document_chunks(self, doc_id: str) -> List[str]:
        """
        Get all chunks for a document
        
        Args:
            doc_id: Document identifier
            
        Returns:
            List of chunk texts
        """
        results = self.collection.get(
            where={"doc_id": doc_id}
        )
        
        if results["documents"]:
            return results["documents"]
        return []



