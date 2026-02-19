#!/bin/bash
# PriceX Deployment Script

set -e

ENVIRONMENT=${1:-staging}
VERSION=${2:-$(git describe --tags --always)}

echo "🚀 Deploying PriceX to $ENVIRONMENT"
echo "Version: $VERSION"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check environment
case $ENVIRONMENT in
  staging)
    AWS_ACCOUNT="staging"
    S3_BUCKET="pricex-frontend-staging"
    ECS_CLUSTER="pricex-staging"
    ECS_SERVICE="pricex-backend"
    ;;
  production)
    AWS_ACCOUNT="production"
    S3_BUCKET="pricex-frontend-production"
    ECS_CLUSTER="pricex-production"
    ECS_SERVICE="pricex-backend"
    ;;
  *)
    echo -e "${RED}Error: Unknown environment '$ENVIRONMENT'${NC}"
    exit 1
    ;;
esac

# ============================================
# BUILD FRONTEND
# ============================================
echo -e "${YELLOW}Building frontend...${NC}"
cd pricex
npm ci
npm run build

# ============================================
# DEPLOY FRONTEND TO S3
# ============================================
echo -e "${YELLOW}Deploying frontend to S3...${NC}"
aws s3 sync dist/ s3://$S3_BUCKET/ --delete --cache-control "max-age=31536000,public"
aws s3 cp s3://$S3_BUCKET/index.html s3://$S3_BUCKET/index.html --metadata-directive REPLACE --cache-control "no-cache"

# Invalidate CloudFront cache
echo -e "${YELLOW}Invalidating CloudFront cache...${NC}"
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Aliases.Items, 'pricex.com')].Id" --output text)
if [ ! -z "$DISTRIBUTION_ID" ]; then
  aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
fi

# ============================================
# BUILD & DEPLOY BACKEND
# ============================================
echo -e "${YELLOW}Building backend Docker image...${NC}"
cd backend
docker build -t pricex-backend:$VERSION .
docker tag pricex-backend:$VERSION $AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/pricex-backend:$VERSION

# Push to ECR
echo -e "${YELLOW}Pushing to ECR...${NC}"
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com
docker push $AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/pricex-backend:$VERSION

# Update ECS service
echo -e "${YELLOW}Updating ECS service...${NC}"
aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --force-new-deployment

cd ..

# ============================================
# VERIFY DEPLOYMENT
# ============================================
echo -e "${YELLOW}Verifying deployment...${NC}"
sleep 30

HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.pricex.com/health || echo "000")
if [ "$HEALTH_STATUS" == "200" ]; then
  echo -e "${GREEN}✅ Backend health check passed${NC}"
else
  echo -e "${RED}❌ Backend health check failed (status: $HEALTH_STATUS)${NC}"
  exit 1
fi

echo -e "${GREEN}🎉 Deployment to $ENVIRONMENT complete!${NC}"
echo ""
echo "URLs:"
echo "  Frontend: https://pricex.com"
echo "  API: https://api.pricex.com"
echo "  Docs: https://api.pricex.com/docs"
