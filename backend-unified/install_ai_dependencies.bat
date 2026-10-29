@echo off
REM Medical AI Platform - AI Dependencies Installation Script (Windows)
REM This script installs all AI/ML/DL dependencies required for the platform

echo ============================================================
echo 🚀 Installing AI/ML/DL Dependencies for Medical AI Platform
echo ============================================================
echo.

REM Check Python version
python --version
if %errorlevel% neq 0 (
    echo ❌ Python not found. Please install Python 3.9+
    pause
    exit /b 1
)

REM Activate virtual environment if it exists
if exist "venv" (
    echo 📦 Activating virtual environment...
    call venv\Scripts\activate.bat
) else (
    echo ⚠️  No virtual environment found. Creating one...
    python -m venv venv
    call venv\Scripts\activate.bat
)

echo.
echo 🔥 Installing PyTorch (Vision Service)...
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

echo.
echo 🤖 Installing llama-cpp-python (LLM Service)...
pip install llama-cpp-python --extra-index-url https://abetlen.github.io/llama-cpp-python/whl/cpu

echo.
echo 📚 Installing sentence-transformers (RAG)...
pip install sentence-transformers

echo.
echo 🔍 Installing faiss-cpu (Vector Database)...
pip install faiss-cpu

echo.
echo 🌐 Installing huggingface-hub (Model downloads)...
pip install huggingface-hub

echo.
echo 📁 Creating models directory...
if not exist "models" mkdir models

echo.
echo ⬇️  Downloading phi-3-mini model (LLM)...
if not exist "models\phi-3-mini-4k-instruct-q4.gguf" (
    echo Downloading phi-3-mini-4k-instruct-q4.gguf...
    curl -L -o models\phi-3-mini-4k-instruct-q4.gguf https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf
    echo ✅ phi-3-mini model downloaded successfully
) else (
    echo ✅ phi-3-mini model already exists
)

echo.
echo ============================================================
echo 🔍 Verifying installations...
echo ============================================================

REM Check PyTorch
python -c "import torch; print(f'✅ PyTorch {torch.__version__} installed')" 2>nul || echo ❌ PyTorch installation failed

REM Check llama-cpp-python
python -c "import llama_cpp; print('✅ llama-cpp-python installed')" 2>nul || echo ❌ llama-cpp-python installation failed

REM Check sentence-transformers
python -c "import sentence_transformers; print('✅ sentence-transformers installed')" 2>nul || echo ❌ sentence-transformers installation failed

REM Check faiss
python -c "import faiss; print('✅ faiss-cpu installed')" 2>nul || echo ❌ faiss-cpu installation failed

echo.
echo ============================================================
echo ✅ AI/ML/DL Dependencies Installation Complete!
echo ============================================================
echo.
echo Next steps:
echo 1. Start the backend: uvicorn app:app --reload
echo 2. Access API docs: http://localhost:8000/docs
echo 3. Check health: http://localhost:8000/health
echo.
pause
