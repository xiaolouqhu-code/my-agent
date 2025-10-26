#!/bin/bash

# ========================================
# 自动安装部署所需工具
# ========================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🛠️  安装部署工具                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# 检查 Homebrew
if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}⚠️  Homebrew 未安装，正在安装...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo -e "${GREEN}✓ Homebrew 已安装${NC}"
fi

# 安装 Google Cloud SDK
echo ""
echo -e "${YELLOW}[1/2] 安装 Google Cloud SDK...${NC}"
if ! command -v gcloud &> /dev/null; then
    brew install --cask google-cloud-sdk
    echo -e "${GREEN}✓ Google Cloud SDK 安装完成${NC}"
else
    echo -e "${GREEN}✓ Google Cloud SDK 已安装${NC}"
fi

# 安装 Docker
echo ""
echo -e "${YELLOW}[2/2] 安装 Docker Desktop...${NC}"
if ! command -v docker &> /dev/null; then
    brew install --cask docker
    echo -e "${GREEN}✓ Docker Desktop 安装完成${NC}"
    echo -e "${YELLOW}⚠️  请启动 Docker Desktop 应用${NC}"
else
    echo -e "${GREEN}✓ Docker 已安装${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ 工具安装完成！                         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📝 下一步：${NC}"
echo ""
echo -e "1. 登录 Google Cloud:"
echo -e "   ${BLUE}gcloud auth login${NC}"
echo ""
echo -e "2. 配置 Docker 认证:"
echo -e "   ${BLUE}gcloud auth configure-docker${NC}"
echo ""
echo -e "3. 设置项目 ID:"
echo -e "   ${BLUE}export GCP_PROJECT_ID=\"your-project-id\"${NC}"
echo ""
echo -e "4. 设置 API Key:"
echo -e "   ${BLUE}export OPENROUTER_API_KEY=\"your-api-key\"${NC}"
echo ""
echo -e "5. 运行部署:"
echo -e "   ${BLUE}./deploy.sh${NC}"
echo ""
