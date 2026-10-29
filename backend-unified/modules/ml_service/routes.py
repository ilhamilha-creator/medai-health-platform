"""
ML Service Module
XGBoost predictions for 7 diseases
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
import numpy as np

from modules.auth.routes import get_current_user

ml_router = APIRouter()

# Models
class MedicalData(BaseModel):
    age: int
    gender: str
    bmi: float
    fasting_glucose: float
    hba1c: float
    systolic_bp: int
    diastolic_bp: int
    smoker: bool
    family_diabetes: bool
    family_heart: bool
    exercise_minutes: int
    cholesterol: Optional[float] = None
    ldl: Optional[float] = None
    hdl: Optional[float] = None
    triglycerides: Optional[float] = None
    creatinine: Optional[float] = None
    egfr: Optional[float] = None
    alcohol_consumption: Optional[str] = "none"
    stress_level: Optional[int] = 5
    sleep_hours: Optional[float] = 7.0

class PredictionResponse(BaseModel):
    disease: str
    risk_score: float
    risk_level: str
    confidence: float
    recommendations: List[str]

class ComprehensiveResponse(BaseModel):
    predictions: Dict[str, Dict]
    overall_risk: str
    recommendations: List[str]

# Demo prediction function (integrate with actual XGBoost models)
def predict_disease(data: MedicalData, disease: str) -> PredictionResponse:
    """Demo prediction - replace with actual XGBoost model"""
    # Simulate risk calculation
    base_risk = 0.3
    
    risk_factors = 0
    if data.smoker: risk_factors += 0.15
    if data.family_diabetes and disease == "diabetes": risk_factors += 0.2
    if data.family_heart and disease == "cardiovascular": risk_factors += 0.2
    if data.bmi > 30: risk_factors += 0.1
    if data.fasting_glucose > 100: risk_factors += 0.15
    
    risk_score = min(base_risk + risk_factors, 0.95)
    
    if risk_score < 0.3:
        risk_level = "low"
    elif risk_score < 0.6:
        risk_level = "moderate"
    else:
        risk_level = "high"
    
    recommendations = []
    if risk_level == "high":
        recommendations.append("Immediate medical consultation recommended")
        recommendations.append("Comprehensive diagnostic testing advised")
    elif risk_level == "moderate":
        recommendations.append("Regular monitoring recommended")
        recommendations.append("Lifestyle modifications advised")
    else:
        recommendations.append("Maintain healthy lifestyle")
        recommendations.append("Regular check-ups")
    
    return PredictionResponse(
        disease=disease,
        risk_score=risk_score,
        risk_level=risk_level,
        confidence=0.85,
        recommendations=recommendations
    )

# Routes
@ml_router.post("/predict/diabetes", response_model=PredictionResponse)
async def predict_diabetes(data: MedicalData, current_user: dict = Depends(get_current_user)):
    """Predict diabetes risk"""
    return predict_disease(data, "diabetes")

@ml_router.post("/predict/cardiovascular", response_model=PredictionResponse)
async def predict_cardiovascular(data: MedicalData, current_user: dict = Depends(get_current_user)):
    """Predict cardiovascular disease risk"""
    return predict_disease(data, "cardiovascular")

@ml_router.post("/predict/cancer", response_model=PredictionResponse)
async def predict_cancer(data: MedicalData, current_user: dict = Depends(get_current_user)):
    """Predict cancer risk"""
    return predict_disease(data, "cancer")

@ml_router.post("/predict/kidney", response_model=PredictionResponse)
async def predict_kidney(data: MedicalData, current_user: dict = Depends(get_current_user)):
    """Predict kidney disease risk"""
    return predict_disease(data, "kidney")

@ml_router.post("/predict/liver", response_model=PredictionResponse)
async def predict_liver(data: MedicalData, current_user: dict = Depends(get_current_user)):
    """Predict liver disease risk"""
    return predict_disease(data, "liver")

@ml_router.post("/predict/thyroid", response_model=PredictionResponse)
async def predict_thyroid(data: MedicalData, current_user: dict = Depends(get_current_user)):
    """Predict thyroid disease risk"""
    return predict_disease(data, "thyroid")

@ml_router.post("/predict/respiratory", response_model=PredictionResponse)
async def predict_respiratory(data: MedicalData, current_user: dict = Depends(get_current_user)):
    """Predict respiratory disease risk"""
    return predict_disease(data, "respiratory")

@ml_router.post("/predict/comprehensive", response_model=ComprehensiveResponse)
async def predict_comprehensive(data: MedicalData, current_user: dict = Depends(get_current_user)):
    """Comprehensive risk prediction for all diseases"""
    diseases = ["diabetes", "cardiovascular", "cancer", "kidney", "liver", "thyroid", "respiratory"]
    predictions = {}
    
    for disease in diseases:
        pred = predict_disease(data, disease)
        predictions[disease] = {
            "risk_score": pred.risk_score,
            "risk_level": pred.risk_level,
            "confidence": pred.confidence
        }
    
    # Calculate overall risk
    high_risks = sum(1 for p in predictions.values() if p["risk_level"] == "high")
    moderate_risks = sum(1 for p in predictions.values() if p["risk_level"] == "moderate")
    
    if high_risks >= 2:
        overall_risk = "high"
    elif high_risks >= 1 or moderate_risks >= 3:
        overall_risk = "moderate"
    else:
        overall_risk = "low"
    
    recommendations = []
    if overall_risk == "high":
        recommendations.append("Comprehensive medical evaluation recommended")
        recommendations.append("Prioritize high-risk conditions")
    elif overall_risk == "moderate":
        recommendations.append("Regular health monitoring")
        recommendations.append("Lifestyle modifications")
    else:
        recommendations.append("Maintain healthy lifestyle")
        recommendations.append("Annual check-ups")
    
    return ComprehensiveResponse(
        predictions=predictions,
        overall_risk=overall_risk,
        recommendations=recommendations
    )
