import os
import boto3
from botocore.exceptions import ClientError
from botocore.config import Config
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the S3 client
s3_client = boto3.client(
    's3',
    region_name=os.getenv('S3_CLIENT_REGION'),
    aws_access_key_id=os.getenv('S3_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('S3_SECRET_ACCESS_KEY'),
    config=Config(signature_version='s3v4')
)

def get_object_url(key):
    """Generate a signed URL for an object in S3."""
    try:
        url = s3_client.generate_presigned_url('get_object',
            Params={'Bucket': os.getenv('S3_BUCKET_NAME'), 'Key': key},
            ExpiresIn=3600  # URL expiry time in seconds
        )
        return url
    except ClientError as e:
        print("Error generating signed URL:", e)
        raise e

def put_object_url(file_name, file_type, expiry_time):
    """Generate a presigned URL for uploading an object to S3."""
    try:
        url = s3_client.generate_presigned_url('put_object',
            Params={'Bucket': os.getenv('S3_BUCKET_NAME'), 'Key': file_name, 'ContentType': file_type},
            ExpiresIn=expiry_time
        )
        return url
    except ClientError as e:
        print("Error generating presigned URL:", e)
        return None
