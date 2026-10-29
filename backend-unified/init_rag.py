"""
RAG Implementation for Medical Knowledge Base
Simple implementation using sentence-transformers and faiss-cpu
"""

import os
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

print("Initializing RAG system...")

# Create rag directory
os.makedirs('./rag', exist_ok=True)

# Medical knowledge base (sample documents)
medical_documents = [
    "Diabetes is a chronic metabolic disease characterized by high blood sugar levels. Common symptoms include increased thirst, frequent urination, and unexplained weight loss.",
    "Cardiovascular disease refers to conditions affecting the heart and blood vessels. Risk factors include high blood pressure, high cholesterol, smoking, and diabetes.",
    "Cancer is a group of diseases involving abnormal cell growth. Early detection through screening significantly improves treatment outcomes.",
    "Chronic kidney disease is the gradual loss of kidney function over time. Common causes include diabetes, high blood pressure, and certain medications.",
    "Liver disease can be caused by alcohol, viral infections, or autoimmune conditions. Symptoms include jaundice, fatigue, and abdominal pain.",
    "Thyroid disorders affect the thyroid gland's hormone production. Hypothyroidism causes fatigue and weight gain, while hyperthyroidism causes weight loss and rapid heartbeat.",
    "Respiratory diseases include asthma, COPD, and lung infections. Common symptoms include shortness of breath, coughing, and chest pain."
]

print(f"Loading {len(medical_documents)} medical documents...")

# Load sentence transformer model
print("Loading sentence transformer model...")
embedder = SentenceTransformer('all-MiniLM-L6-v2')

# Create embeddings
print("Creating embeddings...")
embeddings = embedder.encode(medical_documents)

# Create FAISS index
print("Creating FAISS index...")
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)

# Save index and documents
print("Saving RAG data...")
faiss.write_index(index, './rag/medical_index.faiss')

with open('./rag/medical_documents.txt', 'w', encoding='utf-8') as f:
    for doc in medical_documents:
        f.write(doc + '\n')

print("RAG system initialized successfully!")
print(f"Index saved to: ./rag/medical_index.faiss")
print(f"Documents saved to: ./rag/medical_documents.txt")
print("\nRAG is now ready for retrieval!")
