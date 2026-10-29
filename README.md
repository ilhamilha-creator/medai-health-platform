# Medical AI Platform

A comprehensive medical AI platform for care coordination, featuring ML predictions, LLM chatbot, RAG, and specialized AI agents.

## � Overview

This platform demonstrates a complete implementation of a medical AI system suitable for CNRS Master's internship applications. It includes:

- **7 XGBoost models** for disease prediction (diabetes, cardiovascular, cancer, kidney, liver, thyroid, respiratory)
- **LangChain-based agents** for care plan synthesis and coordination
- **Advanced temporal reasoning** with CUSUM, EWMA, and Z-score change detection
- **RAG system** with medical knowledge base (15 documents)
- **LLM integration** using DistilGPT2 (HuggingFace transformers)
- **Document integration** for PDF processing and information extraction
- **EHPAD longitudinal care memory** simulation (100 patients, 6 months)

## 🏗️ Architecture

**Backend:** FastAPI (Python)
**Frontend:** React 18
**Database:** SQLite (PostgreSQL compatible)
**ML Framework:** XGBoost
**LLM:** DistilGPT2 (transformers)
**Agent Framework:** LangChain
**Vector DB:** FAISS

## � Quick Start

### Backend
```bash
cd backend-unified
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
npm install
npm start
```

## 📊 Evaluation

See `results/comprehensive_evaluation_report.json` for detailed metrics.

**Overall Score:** 7.5/10

**Suitability for CNRS Internship:** Good fit with room for improvement during internship

## 🧪 Tests

```bash
# Test AI agents
python test_agents.py

# Test with EHPAD data
python test_agents_ehpad.py

# ML evaluation
python evaluate_ml.py

# Comprehensive evaluation
python comprehensive_evaluation.py
```

## 📁 Key Components

- `modules/ml_service/` - XGBoost disease prediction
- `modules/llm_service/` - LLM chatbot
- `modules/ai_agents/` - Specialized AI agents
- `modules/langchain_agents/` - LangChain-based agents
- `modules/advanced_temporal.py` - Advanced temporal reasoning
- `modules/document_integration.py` - Document processing
- `data/ehpad_longitudinal.db` - EHPAD simulation database

## � Research Focus

This project aligns with CNRS research on:
- Shared AI Care Intelligence Layer
- Longitudinal care memory
- Temporal reasoning and change detection
- Specialized AI agents for care coordination
- Multimodal AI integration

## � Documentation

- `DEMO_GUIDE.md` - Complete demo instructions
- `docs/ARCHITECTURE.md` - Professional architecture documentation

## 🌐 GitHub

https://github.com/ilhamilha-creator/medai-health-platform

## � Contact

For CNRS Master's Internship in Artificial Intelligence
alice.othmani@u-pec.fr
