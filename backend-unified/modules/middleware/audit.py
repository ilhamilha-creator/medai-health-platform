"""
Audit Middleware
Security audit logging for sensitive operations
"""

import json
from datetime import datetime
from fastapi import Request
from typing import Callable
import logging

audit_logger = logging.getLogger("audit")

SENSITIVE_ENDPOINTS = {
    "/api/auth/login": "LOGIN_ATTEMPT",
    "/api/auth/register": "USER_REGISTRATION",
    "/api/auth/logout": "USER_LOGOUT",
    "/api/ml/predict": "ML_PREDICTION",
    "/api/chatbot/chat": "CHATBOT_INTERACTION",
}

async def audit_middleware(request: Request, call_next: Callable):
    """Middleware for audit logging"""
    # Check if endpoint is sensitive
    endpoint_key = None
    for path, key in SENSITIVE_ENDPOINTS.items():
        if request.url.path.startswith(path):
            endpoint_key = key
            break
    
    if endpoint_key:
        audit_log = {
            "timestamp": datetime.utcnow().isoformat(),
            "event": endpoint_key,
            "path": request.url.path,
            "method": request.method,
            "client_ip": request.client.host if request.client else None,
            "user_agent": request.headers.get("user-agent"),
        }
        
        audit_logger.info(json.dumps(audit_log))
    
    # Process request
    response = await call_next(request)
    
    return response
