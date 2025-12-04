"""
Document chunker for splitting text into manageable chunks
"""
from typing import List, Dict
import tiktoken

class DocumentChunker:
    """Chunks documents into overlapping segments"""
    
    def __init__(self, chunk_size: int = 400, overlap: int = 75):
        """
        Initialize chunker
        
        Args:
            chunk_size: Target chunk size in tokens (300-500 range)
            overlap: Overlap size in tokens (50-100 range)
        """
        self.chunk_size = chunk_size
        self.overlap = overlap
        # Use cl100k_base encoding (GPT-3.5/4 compatible)
        try:
            self.encoding = tiktoken.get_encoding("cl100k_base")
        except:
            # Fallback if tiktoken not available
            self.encoding = None
    
    def _count_tokens(self, text: str) -> int:
        """Count tokens in text"""
        if self.encoding:
            return len(self.encoding.encode(text))
        # Fallback: approximate 1 token = 4 characters
        return len(text) // 4
    
    def chunk(self, text: str) -> List[Dict[str, any]]:
        """
        Chunk text into overlapping segments
        
        Args:
            text: Input text to chunk
            
        Returns:
            List of chunk dictionaries with 'text' and 'metadata'
        """
        if not text or not text.strip():
            return []
        
        chunks = []
        words = text.split()
        current_chunk = []
        current_tokens = 0
        
        i = 0
        while i < len(words):
            word = words[i]
            word_tokens = self._count_tokens(word)
            
            if current_tokens + word_tokens <= self.chunk_size:
                current_chunk.append(word)
                current_tokens += word_tokens
                i += 1
            else:
                # Save current chunk
                if current_chunk:
                    chunk_text = " ".join(current_chunk)
                    chunks.append({
                        "text": chunk_text,
                        "metadata": {
                            "chunk_index": len(chunks),
                            "token_count": current_tokens
                        }
                    })
                
                # Start new chunk with overlap
                if self.overlap > 0 and chunks:
                    # Take last overlap tokens from previous chunk
                    overlap_words = []
                    overlap_tokens = 0
                    prev_chunk = chunks[-1]["text"].split()
                    
                    for j in range(len(prev_chunk) - 1, -1, -1):
                        word_token_count = self._count_tokens(prev_chunk[j])
                        if overlap_tokens + word_token_count <= self.overlap:
                            overlap_words.insert(0, prev_chunk[j])
                            overlap_tokens += word_token_count
                        else:
                            break
                    
                    current_chunk = overlap_words
                    current_tokens = overlap_tokens
                else:
                    current_chunk = []
                    current_tokens = 0
        
        # Add final chunk
        if current_chunk:
            chunk_text = " ".join(current_chunk)
            chunks.append({
                "text": chunk_text,
                "metadata": {
                    "chunk_index": len(chunks),
                    "token_count": current_tokens
                }
            })
        
        return chunks



