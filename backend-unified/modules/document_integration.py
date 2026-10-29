"""
Document Integration Module
Extracts information from medical documents (PDF)
"""

import os

print("Initializing Document Integration Module...")

# Check for PDF processing libraries
try:
    import PyPDF2
    print("PyPDF2 available for PDF processing")
except ImportError:
    print("PyPDF2 not available. Install: pip install PyPDF2")

try:
    from transformers import pipeline
    print("Transformers available for NER")
except ImportError:
    print("Transformers not available")

class DocumentIntegration:
    """Extracts information from medical documents"""
    
    def __init__(self):
        self.documents = {}
    
    def process_document(self, doc_id, text):
        """Process document text and extract key information"""
        # Simple keyword extraction (in production, use NER)
        info = {
            'diagnosis': [],
            'medications': [],
            'procedures': [],
            'allergies': []
        }
        
        # Simple keyword matching
        diagnosis_keywords = ['diabetes', 'hypertension', 'heart failure', 'cancer', 'asthma', 'copd']
        medication_keywords = ['metformin', 'lisinopril', 'insulin', 'aspirin', 'metoprolol']
        
        text_lower = text.lower()
        
        for keyword in diagnosis_keywords:
            if keyword in text_lower:
                info['diagnosis'].append(keyword)
        
        for keyword in medication_keywords:
            if keyword in text_lower:
                info['medications'].append(keyword)
        
        self.documents[doc_id] = {
            'text': text,
            'extracted_info': info
        }
        
        return info
    
    def get_summary(self, doc_id):
        """Get summary of processed document"""
        if doc_id in self.documents:
            return self.documents[doc_id]['extracted_info']
        return None

# Export
doc_integration = DocumentIntegration()

print("Document Integration Module initialized!")
print("Note: Full NER requires PyPDF2 and transformers")
