"""
Logging Middleware
Request/response logging with structured logs
"""

import time
import json
from fastapi import Request
from typing import Callable
import logging

logger = logging.getLogger(__name__)

async def logging_middleware(request: Request, call_next: Callable):
    """Middleware for logging requests and responses"""
    start_time = time.time()
    
    # Log request
    logger.info(f"Request: {request.method} {request.url.path}")
    
    # Process request
    response = await call_next(request)
    
    # Calculate duration
    duration = time.time() - start_time
    
    # Log response
    logger.info(
        f"Response: {response.status_code} | Duration: {duration:.3f}s | "
        f"Path: {request.url.path}"
    )
    
    # Add custom header
    response.headers["X-Process-Time"] = str(duration)
    
    return response
