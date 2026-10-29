# Medical AI Platform - Backend Unifié

Backend professionnel monolithique modulaire pour la plateforme médicale IA.

## Architecture

Ce backend unifie les fonctionnalités des 3 backends précédents:
- **backend**: Chatbot, Auth, ML basique
- **backend-pro**: ML professionnel (XGBoost)
- **backend-adtc**: LLM local pour contexte africain

## Modules

- **auth**: JWT authentication, user management
- **chatbot**: RAG, Memory, Guardrails, Tool Calling
- **ml_service**: XGBoost predictions for 7 diseases
- **llm_service**: Local LLM for African healthcare
- **database**: SQLAlchemy ORM
- **middleware**: Logging, Audit, CORS, Rate Limiting

## Installation

```bash
# Virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Dependencies
pip install -r requirements.txt

# Configuration
cp .env.example .env
# Edit .env with your settings
```

## Démarrage

```bash
# Development
uvicorn app:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Current user

### Chatbot (`/api/chatbot`)
- `POST /api/chatbot/chat` - Chat with AI
- `POST /api/chatbot/analyze-symptoms` - Symptom analysis
- `POST /api/chatbot/tools/available` - Available tools

### ML Predictions (`/api/ml`)
- `POST /api/ml/predict/diabetes` - Diabetes prediction
- `POST /api/ml/predict/cardiovascular` - Cardiovascular prediction
- `POST /api/ml/predict/comprehensive` - Full analysis

### LLM Service (`/api/llm`)
- `POST /api/llm/chat` - Chat with local LLM
- `POST /api/llm/analyze-symptoms` - African context analysis
- `GET /api/llm/health` - Health check
- `GET /api/llm/performance` - Performance metrics

## Documentation

- API Docs: http://localhost:8000/docs
- Architecture: ../ARCHITECTURE.md
- Setup: ../SETUP.md

## Environment Variables

Voir `.env.example` pour la configuration complète.
