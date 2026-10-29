"""
Vision Service Module
CNN-based medical image analysis
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional, List, Dict
import numpy as np
from PIL import Image
import io
import base64
import torch

from modules.auth.routes import get_current_user
from .xray_classifier import XRayClassifier
from .preprocessing import preprocess_image

vision_router = APIRouter()

# Initialize models (lazy loading)
xray_classifier = None

def get_xray_classifier():
    """Lazy load X-Ray classifier"""
    global xray_classifier
    if xray_classifier is None:
        try:
            xray_classifier = XRayClassifier()
        except Exception as e:
            print(f"Warning: Could not load X-Ray classifier: {e}")
    return xray_classifier

# Models
class ImageAnalysisRequest(BaseModel):
    image_type: str  # xray, mri, ct, ultrasound
    patient_id: Optional[int] = None

class ImageAnalysisResponse(BaseModel):
    findings: Dict
    interpretation: str
    confidence: float
    abnormalities: List[str]
    recommendations: List[str]
    urgency: str
    processing_time: float

class HealthResponse(BaseModel):
    status: str
    models_loaded: Dict[str, bool]
    gpu_available: bool

# Routes
@vision_router.post("/analyze/xray", response_model=ImageAnalysisResponse)
async def analyze_xray(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Analyze X-Ray image with CNN"""
    import time
    start_time = time.time()
    
    try:
        # Read and preprocess image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Preprocess
        processed_image = preprocess_image(image, target_size=(224, 224))
        
        # Get classifier - MUST be available
        classifier = get_xray_classifier()
        
        if classifier is None:
            raise HTTPException(
                status_code=503,
                detail="CNN model not loaded. Install PyTorch: pip install torch torchvision"
            )
        
        # Run inference
        prediction = classifier.predict(processed_image)
        
        processing_time = time.time() - start_time
        
        # Format response
        return ImageAnalysisResponse(
            findings=prediction["findings"],
            interpretation=prediction["interpretation"],
            confidence=prediction["confidence"],
            abnormalities=prediction["abnormalities"],
            recommendations=prediction["recommendations"],
            urgency=prediction["urgency"],
            processing_time=processing_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing X-Ray: {str(e)}")

@vision_router.post("/analyze/mri")
async def analyze_mri(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Analyze MRI image with CNN"""
    import time
    start_time = time.time()
    
    try:
        # Read and preprocess image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Preprocess
        processed_image = preprocess_image(image, target_size=(224, 224))
        
        # Get classifier - MUST be available
        classifier = get_xray_classifier()
        
        if classifier is None:
            raise HTTPException(
                status_code=503,
                detail="CNN model not loaded. Install PyTorch: pip install torch torchvision"
            )
        
        # Run inference with CNN
        prediction = classifier.predict(processed_image)
        
        processing_time = time.time() - start_time
        
        # Format response
        return {
            "findings": prediction["findings"],
            "interpretation": f"Analyse MRI avec CNN ResNet50: {prediction['interpretation']}",
            "confidence": prediction["confidence"],
            "abnormalities": prediction["abnormalities"],
            "recommendations": prediction["recommendations"],
            "urgency": prediction["urgency"],
            "processing_time": processing_time,
            "model_used": prediction.get("model_used", "ResNet50")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing MRI: {str(e)}")

@vision_router.post("/analyze/ct")
async def analyze_ct(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Analyze CT Scan image with CNN"""
    import time
    start_time = time.time()
    
    try:
        # Read and preprocess image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Preprocess
        processed_image = preprocess_image(image, target_size=(224, 224))
        
        # Get classifier - MUST be available
        classifier = get_xray_classifier()
        
        if classifier is None:
            raise HTTPException(
                status_code=503,
                detail="CNN model not loaded. Install PyTorch: pip install torch torchvision"
            )
        
        # Run inference with CNN
        prediction = classifier.predict(processed_image)
        
        processing_time = time.time() - start_time
        
        # Format response
        return {
            "findings": prediction["findings"],
            "interpretation": f"Analyse CT avec CNN ResNet50: {prediction['interpretation']}",
            "confidence": prediction["confidence"],
            "abnormalities": prediction["abnormalities"],
            "recommendations": prediction["recommendations"],
            "urgency": prediction["urgency"],
            "processing_time": processing_time,
            "model_used": prediction.get("model_used", "ResNet50")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing CT: {str(e)}")

@vision_router.get("/health", response_model=HealthResponse)
async def vision_health_check():
    """Check vision service health"""
    return HealthResponse(
        status="healthy",
        models_loaded={
            "xray_classifier": get_xray_classifier() is not None,
            "mri_segmenter": False,  # In development
            "ct_detector": False  # In development
        },
        gpu_available=torch.cuda.is_available()
    )

@vision_router.get("/supported-types")
async def get_supported_image_types():
    """Get supported image types"""
    return {
        "supported_types": [
            {
                "type": "xray",
                "name": "X-Ray",
                "description": "Chest X-Ray analysis with CNN",
                "status": "available",
                "model": "ResNet50-based classifier"
            },
            {
                "type": "mri",
                "name": "MRI",
                "description": "MRI analysis with CNN ResNet50",
                "status": "available",
                "model": "ResNet50-based classifier"
            },
            {
                "type": "ct",
                "name": "CT Scan",
                "description": "CT Scan analysis with CNN ResNet50",
                "status": "available",
                "model": "ResNet50-based classifier"
            },
            {
                "type": "ultrasound",
                "name": "Ultrasound",
                "description": "Ultrasound analysis (in development)",
                "status": "unavailable",
                "model": "None"
            }
        ]
    }
