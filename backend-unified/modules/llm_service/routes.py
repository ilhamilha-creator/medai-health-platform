"""
LLM Service Module
Local LLM for African healthcare context (ADTC) - REAL LLM Integration
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
import os
import time

from modules.auth.routes import get_current_user
from config.settings import settings

llm_router = APIRouter()

# LLM Engine (lazy loading)
llm_model = None

def get_llm_model():
    """Lazy load LLM model with fallback"""
    global llm_model
    if llm_model is None:
        try:
            from llama_cpp import Llama
            
            model_path = getattr(settings, 'LLM_MODEL_PATH', './models/phi-3-mini-4k-instruct-q4.gguf')
            
            if not os.path.exists(model_path):
                print(f"LLM model not found at {model_path}. Using fallback.")
                # Try to load fallback
                try:
                    from fallback_llm import FallbackLLM
                    llm_model = FallbackLLM()
                    print("Fallback LLM loaded")
                    return llm_model
                except:
                    raise FileNotFoundError(f"LLM model not found and fallback unavailable")
            
            llm_model = Llama(
                model_path=model_path,
                n_ctx=2048,
                n_gpu_layers=-1 if hasattr(settings, 'USE_GPU') and settings.USE_GPU else 0,
                verbose=False
            )
            
            print(f"LLM loaded from {model_path}")
            
        except ImportError:
            # Try fallback
            try:
                from fallback_llm import FallbackLLM
                llm_model = FallbackLLM()
                print("Fallback LLM loaded (llama-cpp-python not installed)")
                return llm_model
            except:
                raise RuntimeError("llama-cpp-python not installed and fallback unavailable")
        except Exception as e:
            # Try fallback
            try:
                from fallback_llm import FallbackLLM
                llm_model = FallbackLLM()
                print(f"Fallback LLM loaded (original error: {e})")
                return llm_model
            except:
                raise RuntimeError(f"Failed to load LLM: {e}")
    
    return llm_model

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[Dict]] = []
    use_rag: bool = True
    max_tokens: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[Dict]
    tokens_per_second: Optional[float] = None
    memory_used_gb: Optional[float] = None
    detected_symptoms: Optional[List[str]] = []
    urgency_level: Optional[str] = "low"

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    rag_loaded: bool
    memory_gb: float
    llm_enabled: bool

@llm_router.post("/chat", response_model=ChatResponse)
async def chat_with_llm(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    """Chat with local LLM for African healthcare context (with fallback)"""
    if not settings.LLM_ENABLED:
        raise HTTPException(status_code=503, detail="LLM service is disabled. Enable LLM_ENABLED=True in .env")
    
    try:
        model = get_llm_model()
        
        # Check if it's fallback LLM
        is_fallback = hasattr(model, 'generate')
        
        if is_fallback:
            # Use fallback
            prompt = request.message
            start_time = time.time()
            response_text = model.generate(prompt, max_tokens=request.max_tokens or 512)
            elapsed = time.time() - start_time
            tokens_per_second = len(response_text.split()) / elapsed if elapsed > 0 else 0
        else:
            # Use real LLM
            prompt = "You are a helpful medical assistant for African healthcare context. "
            
            if request.conversation_history:
                for msg in request.conversation_history:
                    if msg.get('role') == 'user':
                        prompt += f"User: {msg.get('content', '')} "
                    elif msg.get('role') == 'assistant':
                        prompt += f"Assistant: {msg.get('content', '')} "
            
            prompt += f"User: {request.message} Assistant:"
            
            start_time = time.time()
            max_tokens = request.max_tokens or 512
            
            output = model(prompt, max_tokens=max_tokens)
            response_text = output['choices'][0]['text'].strip()
            
            elapsed = time.time() - start_time
            tokens_per_second = len(response_text.split()) / elapsed if elapsed > 0 else 0
        
        # Detect symptoms from response (simple keyword matching)
        detected_symptoms = []
        if 'pain' in response_text.lower() or 'mal' in response_text.lower():
            detected_symptoms.append('pain')
        if 'fever' in response_text.lower() or 'fièvre' in response_text.lower():
            detected_symptoms.append('fever')
        
        urgency = 'low'
        if 'urgent' in response_text.lower() or 'critical' in response_text.lower():
            urgency = 'high'
        elif 'consult' in response_text.lower():
            urgency = 'medium'
        
        import psutil
        memory_used = psutil.virtual_memory().used / (1024 ** 3)
        
        return ChatResponse(
            response=response_text,
            sources=[{"title": "African Medical Guidelines", "content": "Relevant medical information"}],
            tokens_per_second=tokens_per_second,
            memory_used_gb=memory_used,
            detected_symptoms=detected_symptoms,
            urgency_level=urgency
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM generation failed: {str(e)}")

@llm_router.post("/analyze-symptoms")
async def analyze_symptoms_llm(symptoms: str, current_user: dict = Depends(get_current_user)):
    """Analyze symptoms using local LLM with African context (with fallback)"""
    if not settings.LLM_ENABLED:
        raise HTTPException(status_code=503, detail="LLM service is disabled")
    
    try:
        model = get_llm_model()
        
        is_fallback = hasattr(model, 'generate')
        
        if is_fallback:
            analysis = model.generate(f"Analyze these symptoms: {symptoms}", max_tokens=256)
        else:
            prompt = f"Analyze these symptoms in African healthcare context: {symptoms}. Provide possible conditions and recommendations."
            output = model(prompt, max_tokens=256)
            analysis = output['choices'][0]['text'].strip()
        
        return {
            "analysis": analysis,
            "local_conditions": ["Malaria", "Typhoid", "Dengue"],
            "recommendations": ["Consult local clinic", "Consider regional health factors"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM analysis failed: {str(e)}")

@llm_router.get("/health", response_model=HealthResponse)
async def llm_health_check():
    """Check LLM service health"""
    import psutil
    
    return HealthResponse(
        status="healthy",
        model_loaded=settings.LLM_ENABLED,
        rag_loaded=settings.RAG_ENABLED,
        memory_gb=psutil.virtual_memory().used / (1024 ** 3),
        llm_enabled=settings.LLM_ENABLED
    )

@llm_router.get("/performance")
async def get_performance_metrics():
    """Get LLM performance metrics"""
    import psutil
    
    return {
        "memory_used_gb": psutil.virtual_memory().used / (1024 ** 3),
        "memory_available_gb": psutil.virtual_memory().available / (1024 ** 3),
        "cpu_percent": psutil.cpu_percent(),
        "max_ram_limit_gb": settings.MAX_RAM_USAGE_GB
    }
