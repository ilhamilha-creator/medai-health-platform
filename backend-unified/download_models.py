"""
Download Pre-trained Models for Medical AI Platform
REAL AI Models - No fallbacks
"""

import os
import torch
import torchvision.models as models
from pathlib import Path

def download_pytorch_models():
    """Download PyTorch pretrained models"""
    print("📥 Downloading PyTorch pretrained models...")
    
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    
    # Download ResNet50 (automatically downloaded by torchvision)
    print("⬇️  Downloading ResNet50...")
    resnet50 = models.resnet50(pretrained=True)
    torch.save(resnet50.state_dict(), models_dir / "resnet50_imagenet.pth")
    print("✅ ResNet50 downloaded and saved")
    
    # Download ResNet101 for better accuracy
    print("⬇️  Downloading ResNet101...")
    resnet101 = models.resnet101(pretrained=True)
    torch.save(resnet101.state_dict(), models_dir / "resnet101_imagenet.pth")
    print("✅ ResNet101 downloaded and saved")
    
    print(f"\n✅ All PyTorch models saved to {models_dir.absolute()}")

def download_chestxray14_model():
    """
    Download ChestX-ray14 pretrained model
    Note: This requires manual download from:
    https://github.com/zo7/ChestX-ray14
    """
    print("\n📋 ChestX-ray14 Model Instructions:")
    print("=" * 60)
    print("ChestX-ray14 is a large dataset requiring manual download.")
    print("\nSteps to get the model:")
    print("1. Visit: https://github.com/zo7/ChestX-ray14")
    print("2. Download the pretrained model weights")
    print("3. Save to: models/chestxray14_model.pth")
    print("\nAlternative: Train your own model on ChestX-ray14 dataset")
    print("Dataset: https://www.kaggle.com/nih-chest-xrays/data")
    print("=" * 60)

def verify_models():
    """Verify downloaded models"""
    print("\n🔍 Verifying models...")
    models_dir = Path("models")
    
    required_models = [
        "resnet50_imagenet.pth",
        "resnet101_imagenet.pth"
    ]
    
    for model_name in required_models:
        model_path = models_dir / model_name
        if model_path.exists():
            size_mb = model_path.stat().st_size / (1024 * 1024)
            print(f"✅ {model_name} ({size_mb:.1f} MB)")
        else:
            print(f"❌ {model_name} NOT FOUND")
    
    chestxray_path = models_dir / "chestxray14_model.pth"
    if chestxray_path.exists():
        print(f"✅ chestxray14_model.pth (ChestX-ray14 specific)")
    else:
        print(f"⚠️  chestxray14_model.pth NOT FOUND (optional)")

if __name__ == "__main__":
    print("🚀 Medical AI Platform - Model Downloader")
    print("=" * 60)
    
    # Download PyTorch models
    download_pytorch_models()
    
    # ChestX-ray14 instructions
    download_chestxray14_model()
    
    # Verify
    verify_models()
    
    print("\n✅ Model download complete!")
    print("\nNext steps:")
    print("1. Set LLM_ENABLED=True in .env")
    print("2. Start the backend: uvicorn app:app --reload")
    print("3. The vision service will use REAL CNN models")
