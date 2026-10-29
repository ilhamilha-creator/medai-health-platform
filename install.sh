#!/bin/bash

# Medical AI Platform - Installation Script
# This script installs all dependencies and downloads required models

echo "🚀 Installing Medical AI Platform..."

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "Python version: $python_version"

# Create virtual environment
echo "📦 Creating virtual environment..."
cd backend-unified
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo "📥 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Install PyTorch (CPU version for compatibility)
echo "🔥 Installing PyTorch..."
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Install llama-cpp-python
echo "🤖 Installing llama-cpp-python..."
pip install llama-cpp-python

# Download PyTorch models
echo "📥 Downloading PyTorch models (ResNet50, ResNet101)..."
python download_models.py

# Create models directory
mkdir -p models
cd models

# Download phi-3-mini LLM model
echo "🤖 Downloading phi-3-mini LLM model (~2GB)..."
if [ ! -f "phi-3-mini-4k-instruct-q4.gguf" ]; then
    echo "Downloading phi-3-mini from HuggingFace..."
    wget https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf
    echo "✅ phi-3-mini downloaded"
else
    echo "✅ phi-3-mini already exists"
fi

cd ..

# Copy .env.example to .env
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env and set your JWT_SECRET"
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend-unified/.env and set JWT_SECRET"
echo "2. Start backend: cd backend-unified && source venv/bin/activate && uvicorn app:app --reload"
echo "3. Start frontend: cd .. && npm start"
echo ""
