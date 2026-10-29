@echo off
REM Medical AI Platform - Complete Installation Script for Windows
REM This script installs all dependencies and downloads required models

echo ========================================
echo Medical AI Platform - Complete Installation
echo ========================================
echo.

REM Check Python version
python --version
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.9+ from https://www.python.org/
    pause
    exit /b 1
)

echo.
echo [1/5] Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)

echo.
echo [2/5] Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo [3/5] Installing Python dependencies...
pip install --upgrade pip
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [4/5] Installing llama-cpp-python for LLM service...
pip install llama-cpp-python
if errorlevel 1 (
    echo WARNING: Failed to install llama-cpp-python
    echo Chatbot may not work without this package
)

echo.
echo [5/5] Downloading AI models...
echo Downloading PyTorch models (ResNet)...
python download_models.py
if errorlevel 1 (
    echo WARNING: Failed to download PyTorch models
    echo Vision service may not work properly
)

echo.
echo Downloading LLM model (phi-3-mini)...
python download_llm_model.py
if errorlevel 1 (
    echo WARNING: Failed to download LLM model
    echo Chatbot will not work without this model
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Create .env file (copy from .env.example)
echo 2. Configure your settings in .env
echo 3. Start the backend: venv\Scripts\activate
echo 4. Run: uvicorn app:app --reload
echo.
echo Note: Some AI features require additional setup:
echo - Chatbot needs phi-3-mini model (2GB download)
echo - Vision service needs PyTorch models
echo - ML service needs XGBoost models (included)
echo.
pause
