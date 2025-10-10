# AWS Lambda Deployment Instructions

## Prerequisites

1. **AWS CLI Configured**
   ```bash
   aws configure
   ```
   Or set environment variables:
   ```bash
   export AWS_ACCESS_KEY_ID=your_key
   export AWS_SECRET_ACCESS_KEY=your_secret
   export AWS_REGION=us-east-1
   ```

2. **Serverless Framework Installed**
   ```bash
   npm install -g serverless
   ```

3. **Environment Variables Set**

   Create `.env` file in `backend/` directory:
   ```bash
   BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
   BEDROCK_REGION=us-east-1
   AWS_REGION=us-east-1
   ```

## Deployment Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Build TypeScript
```bash
npm run build
```

This compiles TypeScript to JavaScript in `dist/` directory.

### 3. Deploy to AWS
```bash
npx serverless deploy --region us-east-1
```

Or if you have a named AWS profile:
```bash
npx serverless deploy --region us-east-1 --aws-profile your-profile-name
```

### 4. Note API Gateway URL

After successful deployment, Serverless will output:
```
endpoints:
  POST - https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/agent/chat
  POST - https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/agent/fetch-url
  POST - https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/agent/analyze
```

Copy the base URL (everything before `/agent/`).

### 5. Update Frontend Environment

Update your frontend `.env.local`:
```bash
VITE_AGENT_API_BASE=https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com
```

## Testing Deployment

### Test /agent/analyze
```bash
curl -X POST https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/agent/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "text": "Experts unanimously agree that this product is the best on the market."
    },
    "handshake": {
      "mode": "--careful",
      "stakes": "high",
      "min_confidence": 0.7,
      "cite_policy": "force",
      "omission_scan": true,
      "reflex_profile": "strict",
      "codex_version": "0.9.0"
    }
  }'
```

Expected response:
```json
{
  "ok": true,
  "frames": [
    {
      "reflex_id": "vx-ai01",
      "reflex_name": "Speculative Authority",
      "score": 0.85,
      "severity": "high",
      "rationale": "Uses 'experts' without naming them",
      "snippet": "Experts unanimously agree",
      "suggestion": "Ask: Which experts? What are their credentials?"
    }
  ],
  "summary": "Text contains manipulation patterns...",
  "handshake": {...}
}
```

### Test /agent/chat
```bash
curl -X POST https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/agent/chat \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "text": "What manipulation patterns do you see in this claim?"
    },
    "handshake": {
      "mode": "--careful",
      "stakes": "medium",
      "min_confidence": 0.6,
      "cite_policy": "auto",
      "omission_scan": "auto",
      "reflex_profile": "default",
      "codex_version": "0.9.0"
    },
    "history": []
  }'
```

### Test /agent/fetch-url
```bash
curl -X POST https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/agent/fetch-url \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com"
  }'
```

## Troubleshooting

### 404 Errors
- Verify API Gateway URL is correct
- Check CloudWatch logs: `aws logs tail /aws/lambda/tsca-agent-dev-analyze --follow`

### Bedrock Access Denied
Ensure your IAM role has permission:
```json
{
  "Effect": "Allow",
  "Action": ["bedrock:InvokeModel"],
  "Resource": "*"
}
```

### Environment Variables Not Set
Check Lambda configuration:
```bash
aws lambda get-function-configuration --function-name tsca-agent-dev-analyze
```

## Redeployment

After making code changes:
```bash
npm run build
npx serverless deploy --region us-east-1
```

## Logs

View logs in real-time:
```bash
npx serverless logs -f analyze -t --region us-east-1
```

Or via AWS CLI:
```bash
aws logs tail /aws/lambda/tsca-agent-dev-analyze --follow
```

## Cost Monitoring

Monitor AWS costs:
- Bedrock Claude 3.5 Sonnet: ~$0.003/1K input tokens, ~$0.015/1K output tokens
- Lambda: First 1M requests free, then $0.20/1M
- API Gateway: First 1M requests free, then $1.00/1M

Set billing alerts in AWS Console → Billing → Budgets
