import json
import boto3
import os

# Initialize S3 client
s3 = boto3.client('s3')
BUCKET_NAME = os.environ.get('S3_BUCKET_NAME', 'foresight-data-bucket')

def lambda_handler(event, context):
    """
    AWS Lambda handler for the FORESIGHT backend.
    This endpoint retrieves the latest district risk data from S3, 
    processes/filters it based on API query parameters, and returns it.
    """
    try:
        # Determine which path was requested
        path = event.get('path', '/')
        
        if path == '/api/districts':
            # Fetch the latest district data from S3
            # For hackathon/testing, we fall back to a mock response if S3 is not yet populated
            try:
                response = s3.get_object(Bucket=BUCKET_NAME, Key='district_data.json')
                data = json.loads(response['Body'].read().decode('utf-8'))
            except Exception as e:
                print(f"Warning: Could not fetch from S3 ({e}). Returning fallback data.")
                # Fallback empty list or mock data
                data = [{"district": "Fallback District", "state": "Unknown", "risk_score": 0}]

            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*" # CORS for frontend
                },
                "body": json.dumps({
                    "success": True,
                    "count": len(data),
                    "data": data
                })
            }
            
        elif path == '/api/predict':
            # Example endpoint for the ML Model inference
            # (In production, this would load a .pkl model from S3 and run inference)
            body = json.loads(event.get('body', '{}'))
            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({
                    "success": True,
                    "message": "Prediction endpoint active",
                    "predicted_risk": 75.4
                })
            }

        else:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "Not Found"})
            }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "success": False,
                "error": "Internal Server Error"
            })
        }
