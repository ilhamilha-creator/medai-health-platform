#!/bin/bash

# Medical AI Platform - AI Dependencies Installation Script
# This script installs all AI/ML/DL dependencies required for the platform

echo "🚀 Installing AI/ML/DL Dependencies for Medical AI Platform..."
echo "============================================================"

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✅ Python version: $python_version"

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo "📦 Activating virtual environment..."
    source venv/bin/activate
else
    echo "⚠️  No virtual environment found. Creating one..."
    python3 -m venv venv
    source venv/bin/activate
fi

# Install PyTorch (Vision Service)
echo ""
echo "🔥 Installing PyTorch (Vision Service)..."
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Install llama-cpp-python (LLM Service)
echo ""
echo "🤖 Installing llama-cpp-python (LLM Service)..."
pip install llama-cpp-python --extra-index-url https://abetlen.github.io/llama-cpp-python/whl/cpu

# Install sentence-transformers (RAG)
echo ""
echo "📚 Installing sentence-transformers (RAG)..."
pip install sentence-transformers

# Install faiss-cpu (Vector Database for RAG)
echo ""
echo "🔍 Installing faiss-cpu (Vector Database)..."
pip install faiss-cpu

# Install huggingface-hub (Model downloads)
echo ""
echo "🌐 Installing huggingface-hub (Model downloads)..."
pip install huggingface-hub

# Create models directory
echo ""
echo "📁 Creating models directory..."
mkdir -p models

# Download phi-3-mini model
echo ""
echo "⬇️  Downloading phi-3-mini model (LLM)..."
if [ ! -f "models/phi-3-mini-4k-instruct-q4.gguf" ]; then
    echo "Downloading phi-3-mini-4k-instruct-q4.gguf..."
    curl -L -o models/phi-3-mini-4k-instruct-q4.gguf \
        https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf
    echo "✅ phi-3-mini model downloaded successfully"
else
    echo "✅ phi-3-mini model already exists"
fi

# Verify installations
echo ""
echo "============================================================"
echo "🔍 Verifying installations..."

# Check PyTorch
python3 -c "import torch; print(f'✅ PyTorch {torch.__version__} installed')" 2>/dev/null || echo "❌ PyTorch installation failed"

# Check llama-cpp-python
python3 -c "import llama_cpp; print('✅ llama-cpp-python installed')" 2>/dev/null || echo "❌ llama-cpp-python installation failed"

# Check sentence-transformers
python3 -c "import sentence_transformers; print('✅ sentence-transformers installed')" 2>/dev/null || echo "❌ sentence-transformers installation failed"

# Check faiss
python3 -c "import faiss; print('✅ faiss-cpu installed')" 2>/dev/null || echo "❌ faiss-cpu installation failed"

echo ""
echo "============================================================"
echo "✅ AI/ML/DL Dependencies Installation Complete!"
echo ""
echo "Next steps:"
echo "1. Start the backend: uvicorn app:app --reload"
echo "2. Access API docs: http://localhost:8000/docs"
echo "3. Check health: http://localhost:8000/health"
echo ""
