# Medical AI Platform

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive medical AI platform for care coordination, featuring ML predictions, LLM chatbot, RAG, and specialized AI agents. Designed for CNRS Master's internship applications.

## 🎯 Overview

This platform demonstrates a complete implementation of a medical AI system with focus on:

- **7 XGBoost models** for disease prediction (diabetes, cardiovascular, cancer, kidney, liver, thyroid, respiratory)
- **LangChain-based agents** for care plan synthesis and coordination
- **Advanced temporal reasoning** with CUSUM, EWMA, and Z-score change detection
- **RAG system** with medical knowledge base (15 documents)
- **LLM integration** using DistilGPT2 (HuggingFace transformers)
- **Document integration** for PDF processing and information extraction
- **EHPAD longitudinal care memory** simulation (100 patients, 6 months)
- **Patient and Doctor spaces** with 24 medical functionalities

## 🏗️ Architecture

### Technology Stack

| Component | Technology |
|-----------|------------|
| **Backend** | FastAPI (Python 3.8+) |
| **Frontend** | React 18, Tailwind CSS |
| **Database** | SQLite (PostgreSQL compatible) |
| **ML Framework** | XGBoost |
| **LLM** | DistilGPT2 (HuggingFace transformers) |
| **Agent Framework** | LangChain |
| **Vector DB** | FAISS |
| **Authentication** | JWT (Passlib bcrypt) |

### System Architecture

```
┌─────────────────┐
│   Frontend      │  React 18
│   (React)       │  Patient/Doctor Spaces
└────────┬────────┘
         │ REST API
         ↓
┌─────────────────┐
│   Backend       │  FastAPI
│   (FastAPI)     │  JWT Auth
└────────┬────────┘
         │
    ┌────┴────┬──────────┬─────────────┐
    ↓         ↓          ↓             ↓
┌────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐
│  ML    │ │  LLM   │ │  Agents │ │ Document │
│ Service│ │ Service│ │  LangChain│ │Integration│
└────────┘ └────────┘ └─────────┘ └──────────┘
    ↓           ↓           ↓             ↓
┌────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐
│ XGBoost│ │DistilGPT2│ │Temporal │ │  PDF     │
│ Models │ │         │ │Reasoning│ │ Parser   │
└────────┘ └────────┘ └─────────┘ └──────────┘
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- pip
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/ilhamilha-creator/medai-health-platform.git
cd medai-health-platform

# Backend setup
cd backend-unified
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd ..
npm install
```

### Running the Application

```bash
# Start backend (Terminal 1)
cd backend-unified
python app.py

# Start frontend (Terminal 2)
npm start
```

Access the application at `http://localhost:3000`

## 📊 Features

### ML Predictions
- 7 disease prediction models (diabetes, cardiovascular, cancer, kidney, liver, thyroid, respiratory)
- Real-time inference with XGBoost
- Comprehensive evaluation metrics (accuracy, precision, recall, F1, AUC)

### AI Agents
- Symptom Analysis Agent
- Urgency Assessment Agent
- Care Coordination Agent
- Care Plan Synthesis Agent (LangChain)
- Follow-up Agent (LangChain)

### Temporal Reasoning
- Basic change detection
- CUSUM change detection
- EWMA change detection
- Z-score anomaly detection

### LLM & RAG
- DistilGPT2 integration
- Medical knowledge base (15 documents)
- FAISS vector search
- Fallback LLM for reliability

### Document Integration
- PDF processing
- Information extraction
- Keyword-based NER

### Patient/Doctor Spaces
- **Patient Space**: Health monitoring, medications, appointments, AI analysis
- **Doctor Space**: Patient management, diagnostic tools, reports, coordination

## 🧪 Testing

```bash
cd backend-unified

# Test AI agents
python test_agents.py

# Test with EHPAD data
python test_agents_ehpad.py

# ML evaluation
python evaluate_ml.py

# Comprehensive evaluation
python comprehensive_evaluation.py

# Performance benchmark
python performance_benchmark.py

# Quick demo
python quick_demo.py
```

## 📁 Project Structure

```
medai-health-platform/
├── backend-unified/          # FastAPI backend
│   ├── modules/              # Core modules
│   │   ├── auth/            # Authentication
│   │   ├── ml_service/      # ML predictions
│   │   ├── llm_service/     # LLM integration
│   │   ├── ai_agents/       # AI agents
│   │   ├── langchain_agents/# LangChain agents
│   │   ├── advanced_temporal.py
│   │   └── document_integration.py
│   ├── models/              # Trained models
│   ├── data/                # EHPAD simulation
│   ├── results/             # Evaluation reports
│   └── tests/               # Unit tests
├── src/                     # React frontend
│   ├── components/          # React components
│   ├── contexts/            # React contexts
│   └── services/            # API services
├── docs/                    # Documentation
└── README.md
```

## 📊 Evaluation Results

See `results/comprehensive_evaluation_report.json` for detailed metrics.

**Overall Score:** 8/10

**Performance:**
- Symptom Agent: >1M RPS
- Urgency Agent: >1.2M RPS
- Care Plan Agent: >200K RPS
- Temporal Reasoning: >2.9M RPS
- LangChain Agent: >300K RPS

## 🔬 Research Alignment

This project aligns with CNRS research on:
- Shared AI Care Intelligence Layer
- Longitudinal care memory
- Temporal reasoning and change detection
- Specialized AI agents for care coordination
- Multimodal AI integration

## 📝 Documentation

- [DEMO_GUIDE.md](DEMO_GUIDE.md) - Complete demo instructions
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Professional architecture documentation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🌐 GitHub

https://github.com/ilhamilha-creator/medai-health-platform

## 📧 Contact

For CNRS Master's Internship in Artificial Intelligence
alice.othmani@u-pec.fr
