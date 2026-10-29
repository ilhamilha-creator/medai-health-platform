"""
Download LLM Model for Medical AI Platform
phi-3-mini model for ADTC chatbot
"""

import os
from pathlib import Path
import urllib.request
import sys

def download_phi3_model():
    """Download phi-3-mini model from HuggingFace"""
    print("📥 Downloading phi-3-mini model for LLM service...")
    
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    
    model_filename = "Phi-3-mini-4k-instruct-q4.gguf"
    model_path = models_dir / model_filename
    
    if model_path.exists():
        print(f"✅ Model already exists at {model_path}")
        return True
    
    # HuggingFace URL
    model_url = "https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf"
    
    try:
        print(f"⬇️  Downloading from {model_url}")
        print("⏳ This may take a while (model is ~2GB)...")
        
        def progress_hook(block_num, block_size, total_size):
            downloaded = block_num * block_size
            percent = (downloaded / total_size) * 100 if total_size > 0 else 0
            mb_downloaded = downloaded / (1024 * 1024)
            mb_total = total_size / (1024 * 1024)
            sys.stdout.write(f"\r📊 Progress: {percent:.1f}% ({mb_downloaded:.1f} MB / {mb_total:.1f} MB)")
            sys.stdout.flush()
        
        urllib.request.urlretrieve(model_url, model_path, progress_hook)
        
        print(f"\n✅ Model downloaded successfully to {model_path}")
        
        # Verify file size
        file_size_mb = model_path.stat().st_size / (1024 * 1024)
        print(f"📦 File size: {file_size_mb:.1f} MB")
        
        if file_size_mb < 1000:  # Model should be around 2GB
            print("⚠️  Warning: File size seems small, download may be incomplete")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error downloading model: {e}")
        print("\n📋 Manual download instructions:")
        print("1. Visit: https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf")
        print("2. Download: Phi-3-mini-4k-instruct-q4.gguf")
        print(f"3. Save to: {model_path.absolute()}")
        return False

def verify_llm_installation():
    """Verify LLM dependencies"""
    print("\n🔍 Checking LLM dependencies...")
    
    try:
        import llama_cpp
        print("✅ llama-cpp-python is installed")
    except ImportError:
        print("❌ llama-cpp-python NOT installed")
        print("   Install with: pip install llama-cpp-python")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Medical AI Platform - LLM Model Downloader")
    print("=" * 60)
    
    # Check dependencies
    if not verify_llm_installation():
        print("\n⚠️  Please install llama-cpp-python first")
        sys.exit(1)
    
    # Download model
    success = download_phi3_model()
    
    if success:
        print("\n✅ LLM model setup complete!")
        print("\nNext steps:")
        print("1. Set LLM_ENABLED=True in .env")
        print("2. Start the backend: uvicorn app:app --reload")
        print("3. The chatbot will use REAL LLM (phi-3-mini)")
    else:
        print("\n❌ LLM model setup failed")
        sys.exit(1)
