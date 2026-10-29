"""
Diagnostic Script for Medical AI Platform
Check system status and dependencies
"""

import sys
import os
from pathlib import Path

def check_python():
    """Check Python version"""
    print("🐍 Python Version Check")
    print(f"Python version: {sys.version}")
    print(f"Python executable: {sys.executable}")
    print()

def check_dependencies():
    """Check required dependencies"""
    print("📦 Dependencies Check")
    
    required_packages = [
        "fastapi",
        "uvicorn", 
        "pydantic",
        "sqlalchemy",
        "torch",
        "llama_cpp",
        "xgboost",
        "scikit-learn"
    ]
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} - NOT INSTALLED")
    
    print()

def check_files():
    """Check required files"""
    print("📁 Files Check")
    
    required_files = [
        "app.py",
        "requirements.txt",
        ".env",
        "config/settings.py"
    ]
    
    for file in required_files:
        path = Path(file)
        if path.exists():
            print(f"✅ {file}")
        else:
            print(f"❌ {file} - NOT FOUND")
    
    print()

def check_models():
    """Check AI models"""
    print("🤖 AI Models Check")
    
    models_dir = Path("models")
    if models_dir.exists():
        print(f"✅ models directory exists")
        
        # Check for LLM model
        llm_model = models_dir / "phi-3-mini-4k-instruct-q4.gguf"
        if llm_model.exists():
            size_mb = llm_model.stat().st_size / (1024 * 1024)
            print(f"✅ phi-3-mini model ({size_mb:.1f} MB)")
        else:
            print(f"❌ phi-3-mini model - NOT FOUND")
        
        # Check for PyTorch models
        pytorch_models = ["resnet50_imagenet.pth", "resnet101_imagenet.pth"]
        for model in pytorch_models:
            model_path = models_dir / model
            if model_path.exists():
                print(f"✅ {model}")
            else:
                print(f"❌ {model} - NOT FOUND")
    else:
        print(f"❌ models directory - NOT FOUND")
    
    print()

def check_modules():
    """Check project modules"""
    print("📚 Modules Check")
    
    modules_dir = Path("modules")
    if modules_dir.exists():
        required_modules = [
            "auth",
            "chatbot", 
            "llm_service",
            "ml_service",
            "vision_service",
            "database",
            "appointments"
        ]
        
        for module in required_modules:
            module_path = modules_dir / module
            if module_path.exists():
                routes_file = module_path / "routes.py"
                if routes_file.exists():
                    print(f"✅ {module}/routes.py")
                else:
                    print(f"⚠️  {module} - routes.py missing")
            else:
                print(f"❌ {module} - NOT FOUND")
    else:
        print(f"❌ modules directory - NOT FOUND")
    
    print()

if __name__ == "__main__":
    print("=" * 60)
    print("🔍 Medical AI Platform - System Diagnostic")
    print("=" * 60)
    print()
    
    check_python()
    check_dependencies()
    check_files()
    check_models()
    check_modules()
    
    print("=" * 60)
    print("Diagnostic Complete")
    print("=" * 60)
