"""
Medical RAG with Extended Corpus
Extended medical knowledge base for RAG
"""

import os
import faiss
import numpy as np

print("Initializing Extended Medical RAG...")

os.makedirs('./rag', exist_ok=True)

# Extended medical knowledge base (more documents)
medical_documents = [
    "Diabetes is a chronic metabolic disease characterized by high blood sugar levels. Common symptoms include increased thirst, frequent urination, and unexplained weight loss. Treatment involves blood sugar monitoring, medication (insulin or oral hypoglycemics), and lifestyle changes.",
    "Cardiovascular disease refers to conditions affecting the heart and blood vessels. Risk factors include high blood pressure, high cholesterol, smoking, and diabetes. Prevention includes regular exercise, healthy diet, and medication management.",
    "Cancer is a group of diseases involving abnormal cell growth. Early detection through screening significantly improves treatment outcomes. Treatment options include surgery, chemotherapy, radiation therapy, and immunotherapy.",
    "Chronic kidney disease is the gradual loss of kidney function over time. Common causes include diabetes, high blood pressure, and certain medications. Management involves blood pressure control, dietary restrictions, and dialysis in advanced stages.",
    "Liver disease can be caused by alcohol, viral infections, or autoimmune conditions. Symptoms include jaundice, fatigue, and abdominal pain. Treatment depends on the underlying cause and may include medication or transplantation.",
    "Thyroid disorders affect the thyroid gland's hormone production. Hypothyroidism causes fatigue and weight gain, while hyperthyroidism causes weight loss and rapid heartbeat. Treatment involves hormone replacement or anti-thyroid medications.",
    "Respiratory diseases include asthma, COPD, and lung infections. Common symptoms include shortness of breath, coughing, and chest pain. Management includes bronchodilators, steroids, and oxygen therapy.",
    "Hypertension (high blood pressure) is a major risk factor for heart disease and stroke. Treatment includes lifestyle modifications and antihypertensive medications such as ACE inhibitors, beta-blockers, and diuretics.",
    "Alzheimer's disease is a progressive neurodegenerative disorder causing memory loss and cognitive decline. Management includes cholinesterase inhibitors, memantine, and supportive care.",
    "Osteoporosis is a bone disease characterized by decreased bone density and increased fracture risk. Prevention includes calcium and vitamin D supplementation, weight-bearing exercise, and bisphosphonate medications.",
    "Arthritis causes joint inflammation and pain. Osteoarthritis is degenerative, while rheumatoid arthritis is autoimmune. Treatment includes NSAIDs, physical therapy, and disease-modifying antirheumatic drugs.",
    "Stroke occurs when blood flow to the brain is interrupted. Ischemic stroke is caused by blockage, while hemorrhagic stroke is caused by bleeding. Immediate treatment is critical for recovery.",
    "Heart failure occurs when the heart cannot pump enough blood. Symptoms include shortness of breath, fatigue, and fluid retention. Treatment includes medications, lifestyle changes, and in severe cases, devices or transplantation.",
    "Atrial fibrillation is an irregular heart rhythm increasing stroke risk. Treatment includes anticoagulants, rate control medications, and sometimes ablation procedures.",
    "Depression is a mood disorder causing persistent sadness and loss of interest. Treatment includes psychotherapy, antidepressants, and lifestyle modifications."
]

print(f"Creating embeddings for {len(medical_documents)} medical documents...")

# Simple embedding for demo (TF-IDF style)
def simple_embedding(text):
    """Simple embedding for demo (TF-IDF style)"""
    words = text.lower().split()
    vocab = set()
    for doc in medical_documents:
        vocab.update(doc.lower().split())
    vocab = sorted(list(vocab))
    
    # Create TF-IDF-like vector
    embedding = np.zeros(len(vocab), dtype=np.float32)
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

print("Extended Medical RAG initialized successfully!")
print(f"Index: ./rag/medical_index.faiss")
print(f"Documents: ./rag/medical_documents.txt")
print(f"Total documents: {len(medical_documents)}")
print("\nRAG ready for retrieval with extended medical knowledge!")
