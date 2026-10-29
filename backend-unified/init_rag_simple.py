"""
Simple RAG Implementation - Without pyarrow dependency
Uses in-memory FAISS index
"""

import os
import faiss
import numpy as np

print("Initializing Simple RAG...")

os.makedirs('./rag', exist_ok=True)

# Medical knowledge base
medical_documents = [
    "Diabetes is a chronic metabolic disease characterized by high blood sugar levels. Common symptoms include increased thirst, frequent urination, and unexplained weight loss.",
    "Cardiovascular disease refers to conditions affecting the heart and blood vessels. Risk factors include high blood pressure, high cholesterol, smoking, and diabetes.",
    "Cancer is a group of diseases involving abnormal cell growth. Early detection through screening significantly improves treatment outcomes.",
    "Chronic kidney disease is the gradual loss of kidney function over time. Common causes include diabetes, high blood pressure, and certain medications.",
    "Liver disease can be caused by alcohol, viral infections, or autoimmune conditions. Symptoms include jaundice, fatigue, and abdominal pain.",
    "Thyroid disorders affect the thyroid gland's hormone production. Hypothyroidism causes fatigue and weight gain, while hyperthyroidism causes weight loss and rapid heartbeat.",
    "Respiratory diseases include asthma, COPD, and lung infections. Common symptoms include shortness of breath, coughing, and chest pain."
]

print(f"Creating embeddings for {len(medical_documents)} documents...")

# Simple embeddings (TF-IDF style for demo)
# In production, use sentence-transformers
def simple_embedding(text):
    """Simple embedding for demo (TF-IDF style)"""
    words = text.lower().split()
    vocab = set()
    for doc in medical_documents:
        vocab.update(doc.lower().split())
    vocab = sorted(list(vocab))
    
    # Create TF-IDF-like vector
    embedding = np.zeros(len(vocab))
    for i, word in enumerate(vocab):
        if word in words:
            embedding[i] = 1
    return embedding, vocab

# Create embeddings
embeddings_list = []
vocab = None
for doc in medical_documents:
    emb, vocab = simple_embedding(doc)
    embeddings_list.append(emb)

embeddings = np.array(embeddings_list, dtype=np.float32)

# Create FAISS index
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)

# Save index
faiss.write_index(index, './rag/medical_index.faiss')

# Save documents
with open('./rag/medical_documents.txt', 'w', encoding='utf-8') as f:
    for doc in medical_documents:
        f.write(doc + '\n')

print("Simple RAG initialized successfully!")
print(f"Index: ./rag/medical_index.faiss")
print(f"Documents: ./rag/medical_documents.txt")
