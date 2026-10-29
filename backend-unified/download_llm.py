"""
Download phi-3-mini model for LLM Service
"""

import os
from huggingface_hub import hf_hub_download

print("Downloading phi-3-mini model...")

# Create models directory
os.makedirs('./models', exist_ok=True)

try:
    model_path = hf_hub_download(
        repo_id="microsoft/Phi-3-mini-4k-instruct-gguf",
        filename="Phi-3-mini-4k-instruct-q4.gguf",
        local_dir="./models",
        local_dir_use_symlinks=False
    )
    print(f"Model downloaded to: {model_path}")
    print("Download complete!")
except Exception as e:
    print(f"Download failed: {e}")
    print("Please download manually from:")
    print("https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf")
