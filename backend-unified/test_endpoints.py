"""
Test script for all AI endpoints
Run this after backend is started
"""

import requests
import json

BASE_URL = "http://localhost:8000"

print("Testing Medical AI Platform Endpoints...")

# 1. Health check
print("\n1. Testing /health")
try:
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")

# 2. ML Prediction (Diabetes)
print("\n2. Testing /api/ml/predict/diabetes")
try:
    data = {
        "age": 45,
        "gender": "male",
        "bmi": 28.5,
        "fasting_glucose": 110,
        "systolic_bp": 130,
        "diastolic_bp": 85,
        "cholesterol": 200,
        "smoker": False,
        "family_diabetes": True,
        "family_heart": False
    }
    response = requests.post(f"{BASE_URL}/api/ml/predict/diabetes", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")

# 3. RAG Query
print("\n3. Testing /api/agents/rag-query")
try:
    data = {
        "query": "What are the symptoms of diabetes?",
        "top_k": 3
    }
    response = requests.post(f"{BASE_URL}/api/agents/rag-query", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")

# 4. Symptom Analysis Agent
print("\n4. Testing /api/agents/symptom-analysis")
try:
    data = {
        "symptoms": "I have fever and chest pain",
        "patient_data": {"age": 50, "gender": "male"}
    }
    response = requests.post(f"{BASE_URL}/api/agents/symptom-analysis", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")

# 5. Urgency Assessment Agent
print("\n5. Testing /api/agents/urgency-assessment")
try:
    data = {
        "symptoms": "severe pain in chest",
        "vital_signs": {"heart_rate": 120, "blood_pressure": "90/60"}
    }
    response = requests.post(f"{BASE_URL}/api/agents/urgency-assessment", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")

print("\n=== Tests Complete ===")
