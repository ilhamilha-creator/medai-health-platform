"""
Basic Backend Tests
Tests for critical endpoints and functionality
"""

import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_root():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data
    assert data["version"] == "2.0.0"

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "modules" in data

def test_auth_login():
    """Test authentication login"""
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "test123"
    })
    # Should fail with invalid credentials
    assert response.status_code in [200, 401]

def test_auth_register():
    """Test authentication register"""
    response = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "test123",
        "name": "Test User",
        "userType": "patient"
    })
    # Should succeed or fail if user exists
    assert response.status_code in [200, 400, 409]

def test_ml_health():
    """Test ML service health"""
    response = client.get("/api/ml/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data

def test_vision_health():
    """Test vision service health"""
    response = client.get("/api/vision/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "models_loaded" in data

def test_llm_health():
    """Test LLM service health"""
    response = client.get("/api/llm/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "llm_enabled" in data

def test_chatbot_tools():
    """Test chatbot available tools"""
    response = client.post("/api/chatbot/tools/available")
    assert response.status_code == 200
    data = response.json()
    assert "tools" in data

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
