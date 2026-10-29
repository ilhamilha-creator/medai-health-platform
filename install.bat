@echo off
REM Medical AI Platform - Installation Script for Windows

echo 🚀 Installing Medical AI Platform...

REM Check Python version
python --version

REM Create virtual environment
echo 📦 Creating virtual environment...
cd backend-unified
python -m venv venv
call venv\Scripts\activate.bat

REM Install Python dependencies
echo 📥 Installing Python dependencies...
pip install --upgrade pip
pip install -r requirements.txt

REM Install PyTorch (CPU version for compatibility)
echo 🔥 Installing PyTorch...
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

REM Install llama-cpp-python
echo 🤖 Installing llama-cpp-python...
pip install llama-cpp-python

REM Download PyTorch models
echo 📥 Downloading PyTorch models (ResNet50, ResNet101)...
python download_models.py

REM Create models directory
if not exist "models" mkdir models
cd models

REM Download phi-3-mini LLM model
echo 🤖 Downloading phi-3-mini LLM model (~2GB)...
if not exist "phi-3-mini-4k-instruct-q4.gguf" (
    echo Downloading phi-3-mini from HuggingFace...
    curl -L -o phi-3-mini-4k-instruct-q4.gguf https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf
    echo ✅ phi-3-mini downloaded
) else (
    echo ✅ phi-3-mini already exists
)

cd ..

REM Copy .env.example to .env
if not exist ".env" (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ⚠️  Please edit .env and set your JWT_SECRET
)

echo.
echo ✅ Installation complete!
echo.
echo Next steps:
echo 1. Edit backend-unified\.env and set JWT_SECRET
echo 2. Start backend: cd backend-unified && venv\Scripts\activate && uvicorn app:app --reload
echo 3. Start frontend: cd .. && npm start
echo.
