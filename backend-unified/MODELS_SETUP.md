# 🤖 REAL AI Models Setup Guide

## Overview

This platform uses **REAL AI models** - no JavaScript fallbacks, no rule-based simulations.

## Models Used

### 1. Vision - CNN (ResNet50)
- **Model**: ResNet50 pretrained on ImageNet
- **Purpose**: Medical image analysis (X-Ray, MRI, CT)
- **Framework**: PyTorch
- **Download**: Automatic via torchvision

### 2. Chatbot - LLM phi-3-mini
- **Model**: phi-3-mini-4k-instruct-q4.gguf
- **Purpose**: Intelligent medical conversations
- **Framework**: llama-cpp-python
- **Context**: African healthcare (ADTC)

### 3. ML Predictions - XGBoost
- **Model**: XGBoost classifiers
- **Purpose**: Disease risk prediction (7 diseases)
- **Framework**: scikit-learn + xgboost
- **Training**: On synthetic data (production: real medical data)

## Installation Steps

### Step 1: Install Dependencies

```bash
cd backend-unified
pip install -r requirements.txt
```

This installs:
- PyTorch (torch, torchvision)
- XGBoost
- llama-cpp-python
- All other dependencies

### Step 2: Download Pre-trained Models

```bash
cd backend-unified
python download_models.py
```

This downloads:
- ResNet50 (ImageNet pretrained)
- ResNet101 (ImageNet pretrained)

### Step 3: Configure Environment

Edit `.env` file:

```bash
# Enable REAL AI
LLM_ENABLED=True
ML_ENABLED=True

# LLM Configuration
LLM_MODEL_PATH=./models/phi-3-mini-4k-instruct-q4.gguf
LLM_ENABLED=True
MAX_RAM_USAGE_GB=6.5
```

### Step 4: Start Backend

```bash
cd backend-unified
uvicorn app:app --reload --port 8000
```

## ChestX-ray14 Model (Optional but Recommended)

For **REAL medical X-Ray analysis**, use ChestX-ray14 pretrained model:

### Option 1: Download Pretrained Model

```bash
# Clone repository
git clone https://github.com/zo7/ChestX-ray14.git

# Download model weights (follow instructions in repo)
# Save to: backend-unified/models/chestxray14_model.pth
```

### Option 2: Train Your Own Model

```bash
# Download ChestX-ray14 dataset
# https://www.kaggle.com/nih-chest-xrays/data

# Train model (requires GPU)
python train_chestxray14.py
```

### Option 3: Use ResNet50 (Current)

The current implementation uses ResNet50 pretrained on ImageNet.
- **Pros**: Works immediately, no extra download
- **Cons**: Not specifically trained on medical images

**Recommendation**: For hackathon, ResNet50 is sufficient. For production, use ChestX-ray14.

## Verification

### Check Vision Service

```bash
curl http://localhost:8000/api/vision/health
```

Expected response:
```json
{
  "status": "healthy",
  "models_loaded": {
    "xray_classifier": true,
    "mri_segmenter": false,
    "ct_detector": false
  },
  "gpu_available": true
}
```

### Check LLM Service

```bash
curl http://localhost:8000/api/llm/health
```

Expected response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "rag_loaded": true,
  "memory_gb": 2.5,
  "llm_enabled": true
}
```

## Troubleshooting

### PyTorch Not Installed

```bash
pip install torch torchvision
```

### CUDA/GPU Not Available

The system will automatically use CPU if GPU not available.
- CPU inference: ~200-500ms per image
- GPU inference: ~50-100ms per image

### LLM Model Not Found

```bash
# Download phi-3-mini model
cd models
wget https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf
```

### Memory Issues

If you have limited RAM:

```bash
# In .env
MAX_RAM_USAGE_GB=4.0  # Reduce from 6.5
```

## Performance

### Vision (ResNet50)
- **CPU**: ~200-500ms per image
- **GPU**: ~50-100ms per image
- **Memory**: ~500MB-2GB

### LLM (phi-3-mini)
- **CPU**: ~1-3s per response
- **GPU**: ~0.5-1s per response
- **Memory**: ~2-3GB

### ML (XGBoost)
- **CPU**: ~10ms per prediction
- **Memory**: ~100MB

## REAL AI vs Fake AI

### ❌ Fake AI (What we removed)
- JavaScript rule-based responses
- Random number generation
- Hardcoded responses
- Mock data

### ✅ REAL AI (What we use now)
- PyTorch ResNet50 CNN
- phi-3-mini LLM
- XGBoost ML models
- Actual neural network inference

## Next Steps

1. ✅ Install dependencies
2. ✅ Download models
3. ✅ Configure .env
4. ✅ Start backend
5. ✅ Test with real images
6. ✅ Test with real conversations

## Support

For issues with:
- **PyTorch**: https://pytorch.org/docs/
- **ResNet**: https://pytorch.org/vision/stable/models.html
- **phi-3-mini**: https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf
- **ChestX-ray14**: https://github.com/zo7/ChestX-ray14
