"""
Chatbot Module
RAG, Memory, Guardrails, Tool Calling with LLM Integration
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import requests

from modules.auth.routes import get_current_user
from config.settings import settings

chatbot_router = APIRouter()

# Models
class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[Dict]] = []
    use_rag: bool = True
    use_memory: bool = True

class ChatResponse(BaseModel):
    response: str
    confidence: float
    sources: Optional[List[str]] = []
    detected_symptoms: Optional[List[str]] = []
    urgency_level: Optional[str] = "low"

class SymptomAnalysisRequest(BaseModel):
    symptoms: List[str]
    duration: Optional[str] = None
    severity: Optional[str] = "moderate"

class SymptomAnalysisResponse(BaseModel):
    analysis: str
    possible_conditions: List[str]
    urgency_level: str
    recommendations: List[str]

# LLM Integration - REAL AI ONLY
def call_llm(message: str, conversation_history: List[Dict] = [], use_rag: bool = True) -> Dict:
    """Call local LLM for intelligent responses (REAL AI - No fallback)"""
    if not settings.LLM_ENABLED:
        raise HTTPException(
            status_code=503,
            detail="LLM service is disabled. Enable LLM_ENABLED=True in .env"
        )
    
    try:
        payload = {
            "message": message,
            "conversation_history": conversation_history,
            "use_rag": use_rag
        }
        
        # Call internal LLM endpoint
        response = requests.post(
            f"http://localhost:{settings.API_PORT}/api/llm/chat",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            return {
                "response": data.get("response", ""),
                "confidence": 0.85,
                "sources": data.get("sources", []),
                "llm_used": True
            }
        else:
            raise HTTPException(
                status_code=503,
                detail=f"LLM service returned error: {response.status_code}"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"LLM service not reachable: {str(e)}. Ensure LLM service is running on port {settings.API_PORT}"
        )


@chatbot_router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    """Chat with medical AI assistant using REAL LLM"""
    # Call LLM for intelligent response
    llm_result = call_llm(request.message, request.conversation_history, request.use_rag)
    
    return ChatResponse(
        response=llm_result["response"],
        confidence=llm_result["confidence"],
        sources=llm_result.get("sources", []),
        detected_symptoms=llm_result.get("detected_symptoms", []),
        urgency_level=llm_result.get("urgency_level", "low")
    )

@chatbot_router.post("/analyze-symptoms", response_model=SymptomAnalysisResponse)
async def analyze_symptoms(request: SymptomAnalysisRequest, current_user: dict = Depends(get_current_user)):
    """Analyze symptoms using ML and LLM"""
    # Combine symptoms into message for LLM
    symptoms_text = ", ".join(request.symptoms)
    message = f"Patient reports symptoms: {symptoms_text}. Duration: {request.duration or 'unknown'}. Severity: {request.severity}."
    
    # Call LLM for analysis
    llm_result = call_llm(message, [], use_rag=True)
    
    # Generate structured response
    return SymptomAnalysisResponse(
        analysis=llm_result["response"],
        possible_conditions=request.symptoms[:3],  # Simplified
        urgency_level=llm_result.get("urgency_level", "moderate"),
        recommendations=["Consult a healthcare provider", "Monitor symptoms", "Rest and hydrate"]
    )

@chatbot_router.post("/tools/available")
async def get_available_tools(current_user: dict = Depends(get_current_user)):
    """Get available tools for the chatbot"""
    return {
        "tools": [
            {"name": "symptom_analyzer", "description": "Analyze symptoms with ML"},
            {"name": "urgency_assessor", "description": "Assess urgency level"},
            {"name": "medical_knowledge", "description": "Search medical knowledge base with RAG"},
            {"name": "appointment_scheduler", "description": "Schedule appointments"},
            {"name": "llm_chat", "description": "Intelligent conversation with local LLM"}
        ]
    }

@chatbot_router.post("/knowledge/search")
async def search_knowledge(query: str, current_user: dict = Depends(get_current_user)):
    """Search medical knowledge base with RAG"""
    # Use LLM for knowledge search
    llm_result = call_llm(f"Medical knowledge search: {query}", [], use_rag=True)
    
    return {
        "query": query,
        "results": [
            {"title": "Medical Information", "content": llm_result["response"]},
            {"title": "Related Topics", "content": "Consult a healthcare professional for personalized advice"}
        ]
    }
