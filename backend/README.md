# FORESIGHT AWS Backend

This folder contains the serverless AWS backend for the FORESIGHT platform, utilizing **AWS Free Tier** services as outlined in the `architecture_and_tech_stack.md`.

## Architecture Overview
* **Amazon S3**: Securely stores the `district_data.json` dataset and future ML `.pkl` model artifacts.
* **AWS Lambda**: Serverless Python compute engine that fetches data from S3, processes requests, and runs ML inference.
* **Amazon API Gateway**: Exposes the Lambda functions as secure, RESTful HTTP endpoints for the Next.js frontend to consume.

## Prerequisites
1. Install the [AWS CLI](https://aws.amazon.com/cli/) and configure it with your credentials (`aws configure`).
2. Install the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html).

## Deployment Instructions

1. **Build the application:**
   ```bash
   cd backend
   sam build
   ```

2. **Deploy to AWS:**
   ```bash
   sam deploy --guided
   ```
   *Follow the prompts (accepting the defaults is fine). SAM will create the S3 bucket, Lambda function, and API Gateway automatically.*

3. **Upload the Dataset:**
   After deployment, SAM will output your new `DataBucketName`. Upload your frontend dataset to it:
   ```bash
   aws s3 cp ../frontend/public/data/district_data.json s3://<YOUR_NEW_BUCKET_NAME>/
   ```

4. **Connect to Frontend:**
   Take the `ForesightApiEndpoint` URL from the SAM deployment output and add it to your Next.js environment variables (e.g., `NEXT_PUBLIC_AWS_API_URL=https://...`).
