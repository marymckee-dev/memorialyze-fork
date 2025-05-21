"""
Development environment setup script.

This script initializes the development environment by:
1. Creating necessary S3 buckets in LocalStack
2. Setting up initial database tables
"""
import asyncio
import logging
import os
import sys

import boto3
from botocore.exceptions import ClientError
from sqlalchemy.ext.asyncio import create_async_engine

# Add the src directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "src")))

from core.config import settings
from core.database import Base

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def setup_s3():
    """Set up S3 buckets in LocalStack."""
    s3_client = boto3.client(
        "s3",
        endpoint_url=settings.S3_ENDPOINT_URL,
        aws_access_key_id="test",
        aws_secret_access_key="test",
        region_name="us-east-1",
    )
    
    # Create the bucket
    try:
        s3_client.create_bucket(Bucket=settings.S3_BUCKET_NAME)
        logger.info(f"Created S3 bucket: {settings.S3_BUCKET_NAME}")
    except ClientError as e:
        if e.response["Error"]["Code"] == "BucketAlreadyOwnedByYou":
            logger.info(f"S3 bucket already exists: {settings.S3_BUCKET_NAME}")
        else:
            logger.error(f"Failed to create S3 bucket: {e}")
            raise


async def setup_database():
    """Set up database tables."""
    # Import models to ensure they're registered with Base
    from models import User
    
    # Create engine
    engine = create_async_engine(
        settings.DATABASE_URL.replace("+asyncpg", ""),  # Use non-async driver for setup
        echo=True,
    )
    
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    logger.info("Created database tables")


async def main():
    """Run all setup tasks."""
    logger.info("Setting up development environment...")
    
    # Set up S3
    setup_s3()
    
    # Set up database
    await setup_database()
    
    logger.info("Development environment setup complete!")


if __name__ == "__main__":
    asyncio.run(main())
