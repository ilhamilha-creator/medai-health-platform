"""
Quick backend test with authentication bypass for demo
"""

import requests
import json

BASE_URL = "http://localhost:8000"

print("=== Medical AI Platform Quick Test ===\n")

# 1. Health check (no auth)
print("1. Testing /health")
try:
    response = requests.get(f"{BASE_URL}/health", timeout=5)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Backend not running or error: {e}")
    print("\nPlease start backend first: cd backend-unified && python app.py")
    exit(1)

# 2. ML Prediction (no auth for demo - will be rejected)
print("\n2. Testing /api/ml/predict/diabetes (will fail without auth)")
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
    response = requests.post(f"{BASE_URL}/api/ml/predict/diabetes", json=data, timeout=5)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Error: {e}")

print("\n=== Test Complete ===")
print("Note: Most endpoints require authentication. Register/login first.")
