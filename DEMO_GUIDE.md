# Medical AI Platform - Demo Guide

## Quick Start for Demo

### 1. Start Backend
```bash
cd backend-unified
python app.py
```

### 2. Test Components

#### Test AI Agents (Standalone)
```bash
python test_agents.py
```
Tests: Symptom Agent, Urgency Agent, Coordination Agent, Temporal Reasoning

#### Test AI Agents with EHPAD Data
```bash
python test_agents_ehpad.py
```
Tests: Care Plan Synthesis, Follow-up Agent, Temporal Reasoning with simulated EHPAD data

#### Test Fallback LLM (Standalone)
```bash
python fallback_llm.py
```
Tests: Simulated LLM responses for medical queries

#### Test Backend Health
```bash
python quick_test.py
```
Tests: Backend health endpoint

#### Test ML Evaluation
```bash
python evaluate_ml.py
```
Tests: ML model evaluation with benchmarks

#### Test Vision Service
```bash
python test_vision.py
```
Tests: Vision service with synthetic images

### 3. API Endpoints (Requires Auth)

#### Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User","role":"patient"}'
```

#### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

#### Use Token for Endpoints
```bash
TOKEN="your_jwt_token"

# ML Prediction
curl -X POST http://localhost:8000/api/ml/predict/diabetes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"age":45,"gender":"male","bmi":28.5,"fasting_glucose":110,"systolic_bp":130,"diastolic_bp":85,"cholesterol":200,"smoker":false,"family_diabetes":true,"family_heart":false}'

# LLM Chat (with fallback)
curl -X POST http://localhost:8000/api/llm/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"What is diabetes?","use_rag":true}'

# RAG Query
curl -X POST http://localhost:8000/api/agents/rag-query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"diabetes symptoms","top_k":3}'

# Symptom Analysis Agent
curl -X POST http://localhost:8000/api/agents/symptom-analysis \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"symptoms":"fever and chest pain","patient_data":{"age":50,"gender":"male"}}'

# Urgency Assessment Agent
curl -X POST http://localhost:8000/api/agents/urgency-assessment \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"symptoms":"severe pain in chest","vital_signs":{"heart_rate":120}}'

# Care Plan Synthesis Agent
curl -X POST http://localhost:8000/api/agents/care-plan-synthesis \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"patient_data":{"id":"patient_001","age":75,"gender":"female"},"clinical_findings":{"diagnosis":"Hypertension","conditions":["hypertension"]},"recommendations":["BP monitoring"]}'

# Follow-up Scheduling Agent
curl -X POST http://localhost:8000/api/agents/follow-up-schedule \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"patient_id":"patient_001","tasks":[{"type":"checkup","description":"Weekly visit","assigned_to":"nurse","frequency":"weekly"}],"time_horizon_days":30}'
```

## What Works for Demo

✅ **ML Predictions** - 7 XGBoost models with evaluation and benchmarks
✅ **AI Agents** - Symptom analysis, urgency assessment, care coordination, care plan synthesis, follow-up scheduling
✅ **LangChain Agents** - Care plan agent using LangChain tools (preferred framework)
✅ **Advanced Temporal Reasoning** - CUSUM, EWMA, Z-score change detection
✅ **Document Integration** - PDF processing and information extraction
✅ **Temporal Reasoning** - Track changes over time with EHPAD longitudinal data (100 patients, 6 months)
✅ **RAG** - Extended medical knowledge base (15 documents)
✅ **LLM** - DistilGPT2 (HuggingFace transformers, auto-downloads 500MB)
✅ **Evaluation** - ML model evaluation with accuracy, precision, recall, F1, AUC metrics
⚠️ **Vision** - Code exists with synthetic test images (not real medical images)

## GitHub Repository
https://github.com/ilhamilha-creator/medai-health-platform
