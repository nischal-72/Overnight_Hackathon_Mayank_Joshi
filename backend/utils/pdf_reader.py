"""
PDF text extraction utility
"""
from pypdf import PdfReader
from typing import Optional

class PDFReader:
    """Utility for reading PDF files"""
    
    @staticmethod
    def extract_text(file_path: str) -> str:
        """
        Extract text from PDF file
        
        Args:
            file_path: Path to PDF file
            
        Returns:
            Extracted text
        """
        try:
            reader = PdfReader(file_path)
            text = ""
            
            for page in reader.pages:
                text += page.extract_text() + "\n"
            
            return text.strip()
        except Exception as e:
            raise Exception(f"Error reading PDF: {str(e)}")



