#!/bin/bash

# ========================================
# Google Cloud Run 部署脚本
# ========================================

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀 亚马逊调研系统 - Google Cloud 部署    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# ========================================
# 配置变量（请根据实际情况修改）
# ========================================

# GCP 项目配置
PROJECT_ID="${GCP_PROJECT_ID:-your-project-id}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="${SERVICE_NAME:-amazon-research-system}"

# Docker 镜像配置
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

# Cloud Run 配置
MIN_INSTANCES="${MIN_INSTANCES:-0}"
MAX_INSTANCES="${MAX_INSTANCES:-10}"
MEMORY="${MEMORY:-512Mi}"
CPU="${CPU:-1}"
TIMEOUT="${TIMEOUT:-60}"

# 环境变量
OPENROUTER_API_KEY="${OPENROUTER_API_KEY}"

# ========================================
# 检查必需工具
# ========================================

echo -e "${YELLOW}[1/7]${NC} 检查必需工具..."

if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ 未找到 gcloud CLI，请先安装 Google Cloud SDK${NC}"
    echo "安装说明: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ 未找到 Docker，请先安装 Docker${NC}"
    echo "安装说明: https://docs.docker.com/get-docker/"
    exit 1
fi

echo -e "${GREEN}✓ 工具检查完成${NC}"

# ========================================
# 验证项目配置
# ========================================

echo -e "${YELLOW}[2/7]${NC} 验证项目配置..."

if [ "$PROJECT_ID" = "your-project-id" ]; then
    echo -e "${RED}❌ 请先设置 GCP_PROJECT_ID 环境变量${NC}"
    echo "例如: export GCP_PROJECT_ID=my-project-123"
    exit 1
fi

if [ -z "$OPENROUTER_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  未设置 OPENROUTER_API_KEY，请确保在部署时设置${NC}"
    read -p "是否继续? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}✓ 项目配置验证完成${NC}"
echo "  项目 ID: ${PROJECT_ID}"
echo "  区域: ${REGION}"
echo "  服务名: ${SERVICE_NAME}"

# ========================================
# 设置 GCP 项目
# ========================================

echo -e "${YELLOW}[3/7]${NC} 设置 GCP 项目..."

gcloud config set project ${PROJECT_ID}
echo -e "${GREEN}✓ 项目设置完成${NC}"

# ========================================
# 启用必需的 API
# ========================================

echo -e "${YELLOW}[4/7]${NC} 启用必需的 Google Cloud API..."

gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  containerregistry.googleapis.com \
  --quiet

echo -e "${GREEN}✓ API 启用完成${NC}"

# ========================================
# 构建 Docker 镜像
# ========================================

echo -e "${YELLOW}[5/7]${NC} 构建 Docker 镜像..."

# 使用 Cloud Build 构建镜像
gcloud builds submit \
  --tag ${IMAGE_NAME}:${IMAGE_TAG} \
  --timeout=15m \
  .

echo -e "${GREEN}✓ 镜像构建完成${NC}"

# ========================================
# 部署到 Cloud Run
# ========================================

echo -e "${YELLOW}[6/7]${NC} 部署到 Cloud Run..."

# 构建部署命令
DEPLOY_CMD="gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:${IMAGE_TAG} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --min-instances ${MIN_INSTANCES} \
  --max-instances ${MAX_INSTANCES} \
  --memory ${MEMORY} \
  --cpu ${CPU} \
  --timeout ${TIMEOUT} \
  --port 8080"

# 添加环境变量
if [ -n "$OPENROUTER_API_KEY" ]; then
  DEPLOY_CMD="${DEPLOY_CMD} \
    --set-env-vars OPENROUTER_API_KEY=${OPENROUTER_API_KEY},OPENROUTER_BASE_URL=https://openrouter.ai/api/v1,NODE_ENV=production"
fi

# 执行部署
eval $DEPLOY_CMD

echo -e "${GREEN}✓ 部署完成${NC}"

# ========================================
# 获取服务 URL
# ========================================

echo -e "${YELLOW}[7/7]${NC} 获取服务信息..."

SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --platform managed \
  --region ${REGION} \
  --format 'value(status.url)')

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          🎉 部署成功！                      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "🌐 服务 URL: ${BLUE}${SERVICE_URL}${NC}"
echo ""
echo -e "📊 查看服务状态:"
echo -e "   gcloud run services describe ${SERVICE_NAME} --region ${REGION}"
echo ""
echo -e "📝 查看日志:"
echo -e "   gcloud run services logs tail ${SERVICE_NAME} --region ${REGION}"
echo ""
echo -e "🔧 更新环境变量:"
echo -e "   gcloud run services update ${SERVICE_NAME} --region ${REGION} --set-env-vars KEY=VALUE"
echo ""
echo -e "🗑️  删除服务:"
echo -e "   gcloud run services delete ${SERVICE_NAME} --region ${REGION}"
echo ""
