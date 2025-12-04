"""
DOCX text extraction utility
"""
from docx import Document
from typing import Optional

class DOCXReader:
    """Utility for reading DOCX files"""
    
    @staticmethod
    def extract_text(file_path: str) -> str:
        """
        Extract text from DOCX file
        
        Args:
            file_path: Path to DOCX file
            
        Returns:
            Extracted text
        """
        try:
            doc = Document(file_path)
            text = ""
            
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            
            return text.strip()
        except Exception as e:
            raise Exception(f"Error reading DOCX: {str(e)}")



