"""
Image Preprocessing
Medical image preprocessing pipeline
"""

import numpy as np
from PIL import Image
from typing import Tuple, Optional

def preprocess_image(
    image: Image.Image,
    target_size: Tuple[int, int] = (224, 224),
    normalize: bool = True
) -> np.ndarray:
    """
    Preprocess medical image for CNN
    
    Args:
        image: PIL Image
        target_size: Target size (width, height)
        normalize: Whether to normalize pixel values
    
    Returns:
        Preprocessed numpy array
    """
    # Convert to RGB if necessary
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize
    image = image.resize(target_size, Image.LANCZOS)
    
    # Convert to numpy array
    image_array = np.array(image)
    
    # Normalize if requested
    if normalize:
        image_array = image_array.astype(np.float32) / 255.0
    
    return image_array

def preprocess_dicom(image_array: np.ndarray, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
    """
    Preprocess DICOM image
    
    Args:
        image_array: DICOM image array
        target_size: Target size (width, height)
    
    Returns:
        Preprocessed numpy array
    """
    # Normalize DICOM pixel values to 0-255
    if image_array.dtype != np.uint8:
        # Clip and normalize
        image_array = np.clip(image_array, image_array.min(), image_array.max())
        image_array = ((image_array - image_array.min()) / (image_array.max() - image_array.min()) * 255).astype(np.uint8)
    
    # Convert to PIL Image
    image = Image.fromarray(image_array)
    
    # Preprocess
    return preprocess_image(image, target_size)

def augment_image(image_array: np.ndarray) -> np.ndarray:
    """
    Apply data augmentation to image
    
    Args:
        image_array: Image array
    
    Returns:
        Augmented image array
    """
    # Random horizontal flip
    if np.random.random() > 0.5:
        image_array = np.fliplr(image_array)
    
    # Random rotation (-10 to 10 degrees)
    if np.random.random() > 0.5:
        angle = np.random.uniform(-10, 10)
        image = Image.fromarray((image_array * 255).astype(np.uint8))
        image = image.rotate(angle)
        image_array = np.array(image) / 255.0
    
    return image_array
