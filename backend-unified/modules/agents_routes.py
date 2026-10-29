"""
Routes for AI Agents, Temporal Reasoning, and RAG
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from modules.auth.routes import get_current_user
from modules.ai_agents import symptom_agent, urgency_agent, coordination_agent, care_plan_agent, follow_up_agent
from modules.temporal_reasoning import temporal_reasoning
from modules.langchain_agents import langchain_care_agent
from modules.advanced_temporal import advanced_temporal
from modules.document_integration import doc_integration

agents_router = APIRouter()

# Models
class SymptomAnalysisRequest(BaseModel):
    symptoms: str
    patient_data: Dict

class SymptomAnalysisResponse(BaseModel):
    possible_conditions: List[str]
    recommended_tests: List[str]
    urgency: str

class UrgencyAssessmentRequest(BaseModel):
    symptoms: str
    vital_signs: Dict

class UrgencyAssessmentResponse(BaseModel):
    urgency_level: str
    action: str
    timeframe: str

class CareCoordinationRequest(BaseModel):
    patient_id: str
    needs: List[str]
    caregivers: Dict

class CarePlanSynthesisRequest(BaseModel):
    patient_data: Dict
    clinical_findings: Dict
    recommendations: List[str]

class FollowUpScheduleRequest(BaseModel):
    patient_id: str
    tasks: List[Dict]
    time_horizon_days: int = 30

class TemporalChangesRequest(BaseModel):
    patient_id: str
    lookback_days: int = 30

class TemporalChangesResponse(BaseModel):
    changes: List[Dict]

class RAGQueryRequest(BaseModel):
    query: str
    top_k: int = 3

class RAGQueryResponse(BaseModel):
    results: List[Dict]

# Symptom Analysis Agent Route
@agents_router.post("/symptom-analysis", response_model=SymptomAnalysisResponse)
async def analyze_symptoms(request: SymptomAnalysisRequest, current_user: dict = Depends(get_current_user)):
    """Analyze symptoms using AI agent"""
    result = symptom_agent.analyze(request.symptoms, request.patient_data)
    return SymptomAnalysisResponse(**result)

# Urgency Assessment Agent Route
@agents_router.post("/urgency-assessment", response_model=UrgencyAssessmentResponse)
async def assess_urgency(request: UrgencyAssessmentRequest, current_user: dict = Depends(get_current_user)):
    """Assess urgency level using AI agent"""
    result = urgency_agent.assess(request.symptoms, request.vital_signs)
    return UrgencyAssessmentResponse(**result)

# Care Coordination Agent Route
@agents_router.post("/care-coordination")
async def coordinate_care(request: CareCoordinationRequest, current_user: dict = Depends(get_current_user)):
    """Coordinate care using AI agent"""
    result = coordination_agent.coordinate(request.patient_id, request.needs, request.caregivers)
    return result

# Care Plan Synthesis Agent Route
@agents_router.post("/care-plan-synthesis")
async def synthesize_care_plan(request: CarePlanSynthesisRequest, current_user: dict = Depends(get_current_user)):
    """Synthesize comprehensive care plan using AI agent"""
    result = care_plan_agent.synthesize(request.patient_data, request.clinical_findings, request.recommendations)
    return result

# Follow-up Scheduling Agent Route
@agents_router.post("/follow-up-schedule")
async def schedule_follow_up(request: FollowUpScheduleRequest, current_user: dict = Depends(get_current_user)):
    """Schedule follow-up tasks using AI agent"""
    result = follow_up_agent.schedule_follow_up(request.patient_id, request.tasks, request.time_horizon_days)
    return result

@agents_router.get("/follow-up-upcoming/{patient_id}")
async def get_upcoming_follow_ups(patient_id: str, days_ahead: int = 7, current_user: dict = Depends(get_current_user)):
    """Get upcoming follow-ups for a patient"""
    result = follow_up_agent.get_upcoming_follow_ups(patient_id, days_ahead)
    return {"patient_id": patient_id, "upcoming_follow_ups": result}

# LangChain Care Plan Agent Route
@agents_router.post("/langchain-care-plan")
async def langchain_care_plan(request: CarePlanSynthesisRequest, current_user: dict = Depends(get_current_user)):
    """Generate care plan using LangChain tools"""
    result = langchain_care_agent.generate_care_plan(request.patient_data, request.clinical_findings.get('conditions', []))
    return result

# Advanced Temporal Reasoning Routes
@agents_router.post("/advanced-temporal-cusum/{patient_id}/{metric}")
async def advanced_temporal_cusum(patient_id: str, metric: str, k: float = 0.5, h: float = 5, current_user: dict = Depends(get_current_user)):
    """CUSUM change detection"""
    changes = advanced_temporal.detect_changes_cusum(patient_id, metric, k, h)
    return {"patient_id": patient_id, "metric": metric, "changes": changes}

@agents_router.post("/advanced-temporal-ewma/{patient_id}/{metric}")
async def advanced_temporal_ewma(patient_id: str, metric: str, alpha: float = 0.3, std_threshold: float = 2, current_user: dict = Depends(get_current_user)):
    """EWMA change detection"""
    changes = advanced_temporal.detect_changes_ewma(patient_id, metric, alpha, std_threshold)
    return {"patient_id": patient_id, "metric": metric, "changes": changes}

@agents_router.post("/advanced-temporal-anomalies/{patient_id}/{metric}")
async def advanced_temporal_anomalies(patient_id: str, metric: str, threshold: float = 3, current_user: dict = Depends(get_current_user)):
    """Z-score anomaly detection"""
    anomalies = advanced_temporal.detect_anomalies_zscore(patient_id, metric, threshold)
    return {"patient_id": patient_id, "metric": metric, "anomalies": anomalies}

# Document Integration Route
@agents_router.post("/document-process")
async def process_document(doc_id: str, text: str, current_user: dict = Depends(get_current_user)):
    """Process medical document and extract information"""
    result = doc_integration.process_document(doc_id, text)
    return {"doc_id": doc_id, "extracted_info": result}

@agents_router.get("/document-summary/{doc_id}")
async def get_document_summary(doc_id: str, current_user: dict = Depends(get_current_user)):
    """Get document summary"""
    result = doc_integration.get_summary(doc_id)
    return {"doc_id": doc_id, "summary": result}

# Temporal Reasoning Routes
@agents_router.post("/temporal-changes", response_model=TemporalChangesResponse)
async def get_temporal_changes(request: TemporalChangesRequest, current_user: dict = Depends(get_current_user)):
    """Get temporal changes in patient metrics"""
    changes = temporal_reasoning.detect_changes(request.patient_id, request.lookback_days)
    return TemporalChangesResponse(changes=changes)

@agents_router.get("/temporal-trend/{patient_id}/{metric}")
async def get_temporal_trend(patient_id: str, metric: str, current_user: dict = Depends(get_current_user)):
    """Get trend for a specific metric"""
    trend = temporal_reasoning.get_trend(patient_id, metric)
    return {"patient_id": patient_id, "metric": metric, "trend": trend}

# RAG Route
@agents_router.post("/rag-query", response_model=RAGQueryResponse)
async def rag_query(request: RAGQueryRequest, current_user: dict = Depends(get_current_user)):
    """Query RAG knowledge base"""
    import faiss
    import numpy as np
    
    # Load RAG index
    try:
        index = faiss.read_index('./rag/medical_index.faiss')
        
        # Load documents
        with open('./rag/medical_documents.txt', 'r', encoding='utf-8') as f:
            documents = f.read().split('\n')
        
        # Simple embedding for query
        def simple_embedding(text):
            words = text.lower().split()
            vocab = set()
            for doc in documents:
                vocab.update(doc.lower().split())
            vocab = sorted(list(vocab))
            embedding = np.zeros(len(vocab), dtype=np.float32)
            for i, word in enumerate(vocab):
                if word in words:
                    embedding[i] = 1
            return embedding
        
        query_embedding = simple_embedding(request.query).reshape(1, -1)
        
        # Search
        distances, indices = index.search(query_embedding, request.top_k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(documents):
                results.append({
                    'document': documents[idx],
                    'relevance': float(1 - distances[0][i])
                })
        
        return RAGQueryResponse(results=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG query failed: {str(e)}")
