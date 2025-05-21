"""
File handling utilities.

This module provides utility functions for handling file uploads.
"""
import mimetypes
import uuid
from pathlib import Path
from typing import List, Optional, Tuple

from fastapi import HTTPException, UploadFile

from core.config import settings


def validate_file_type(file: UploadFile) -> None:
    """
    Validate that the uploaded file has an allowed MIME type.
    
    Args:
        file: The uploaded file to validate.
        
    Raises:
        HTTPException: If the file type is not allowed.
    """
    content_type = file.content_type
    if content_type not in settings.ALLOWED_UPLOAD_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{content_type}' not allowed. Allowed types: {settings.ALLOWED_UPLOAD_TYPES}",
        )


def generate_unique_filename(original_filename: str) -> str:
    """
    Generate a unique filename for storing an uploaded file.
    
    Args:
        original_filename: The original filename from the upload.
        
    Returns:
        str: A unique filename combining a UUID and the original extension.
    """
    # Get the file extension
    _, extension = os.path.splitext(original_filename)
    
    # Generate a UUID for the filename
    unique_id = str(uuid.uuid4())
    
    # Combine UUID and extension
    return f"{unique_id}{extension}"


def get_file_category(content_type: str) -> str:
    """
    Determine the category of a file based on its MIME type.
    
    Args:
        content_type: The MIME type of the file.
        
    Returns:
        str: The category ('video', 'audio', 'document', 'image').
    """
    if content_type.startswith("video/"):
        return "video"
    elif content_type.startswith("audio/"):
        return "audio"
    elif content_type.startswith("image/"):
        return "image"
    else:
        return "document"
