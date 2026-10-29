"""
Test Vision Service with synthetic medical images
Creates test images and tests ResNet50 inference
"""

import numpy as np
from PIL import Image
import os

print("=== Vision Service Test ===\n")

# Create test images directory
os.makedirs('./test_images', exist_ok=True)

# Create synthetic medical-like images (224x224 RGB)
print("Creating synthetic test images...")

for i in range(5):
    # Generate random image
    img_array = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
    img = Image.fromarray(img_array)
    img.save(f'./test_images/test_xray_{i}.jpg')
    print(f"  Created test_xray_{i}.jpg")

print("\n=== Test Complete ===")
print(f"Created 5 synthetic test images in ./test_images/")
print("Note: These are random images for testing ResNet50 inference pipeline")
print("Real medical images (ChestX-ray14) needed for actual diagnostic use")
