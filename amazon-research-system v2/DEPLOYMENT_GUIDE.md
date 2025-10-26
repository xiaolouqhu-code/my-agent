# 🚀 Google Cloud Run 部署指南

完整的部署文档，帮助你将亚马逊调研系统部署到Google Cloud Platform。

---

## 📋 前置要求

### 1. Google Cloud 账户
- [ ] 拥有 Google Cloud Platform 账户
- [ ] 创建或选择一个 GCP 项目
- [ ] 启用计费（Cloud Run 有免费额度）

### 2. 安装必需工具

#### Google Cloud SDK (gcloud CLI)
```bash
# macOS (使用 Homebrew)
brew install --cask google-cloud-sdk

# 或者下载安装包
# https://cloud.google.com/sdk/docs/install
```

#### Docker Desktop
```bash
# macOS (使用 Homebrew)
brew install --cask docker

# 或者下载安装包
# https://www.docker.com/products/docker-desktop
```

### 3. 认证和初始化

```bash
# 登录 Google Cloud
gcloud auth login

# 配置 Docker 认证
gcloud auth configure-docker

# 初始化 gcloud
gcloud init
```

---

## ⚙️ 部署步骤

### 方法一：自动化部署（推荐）

#### 1. 设置环境变量

```bash
cd "/Users/allenlou/Documents/ai-file/my-agent/amazon-research-system v2"

# 设置 GCP 项目 ID（必需）
export GCP_PROJECT_ID="your-project-id"

# 设置区域（可选，默认 us-central1）
export GCP_REGION="us-central1"

# 设置服务名称（可选，默认 amazon-research-system）
export SERVICE_NAME="amazon-research-system"

# 设置 OpenRouter API Key（必需）
export OPENROUTER_API_KEY="sk-or-v1-your-api-key-here"
```

#### 2. 执行部署脚本

```bash
# 赋予执行权限
chmod +x deploy.sh

# 运行部署
./deploy.sh
```

脚本会自动：
- ✅ 检查必需工具
- ✅ 验证项目配置
- ✅ 启用必需的 GCP API
- ✅ 构建 Docker 镜像
- ✅ 部署到 Cloud Run
- ✅ 输出服务 URL

---

### 方法二：手动部署

#### 1. 设置项目

```bash
# 设置项目 ID
gcloud config set project YOUR_PROJECT_ID

# 启用必需的 API
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  containerregistry.googleapis.com
```

#### 2. 构建 Docker 镜像

```bash
# 定义变量
PROJECT_ID="your-project-id"
SERVICE_NAME="amazon-research-system"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# 使用 Cloud Build 构建镜像
gcloud builds submit --tag ${IMAGE_NAME}:latest
```

#### 3. 部署到 Cloud Run

```bash
# 基本部署
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --port 8080 \
  --set-env-vars OPENROUTER_API_KEY=your-key-here,OPENROUTER_BASE_URL=https://openrouter.ai/api/v1,NODE_ENV=production
```

#### 4. 高级配置（可选）

```bash
# 配置自动扩展
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --region us-central1 \
  --min-instances 0 \
  --max-instances 10 \
  --cpu-throttling \
  --concurrency 80
```

---

## 🔐 环境变量管理

### 使用 Secret Manager（推荐）

```bash
# 创建 secret
echo -n "your-api-key" | gcloud secrets create openrouter-api-key --data-file=-

# 授予 Cloud Run 访问权限
gcloud secrets add-iam-policy-binding openrouter-api-key \
  --member=serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor

# 部署时引用 secret
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --region us-central1 \
  --set-secrets OPENROUTER_API_KEY=openrouter-api-key:latest
```

### 直接设置环境变量

```bash
# 更新环境变量
gcloud run services update ${SERVICE_NAME} \
  --region us-central1 \
  --set-env-vars OPENROUTER_API_KEY=new-key-here
```

---

## 📊 部署后管理

### 查看服务状态

```bash
# 查看服务详情
gcloud run services describe amazon-research-system --region us-central1

# 列出所有服务
gcloud run services list
```

### 查看日志

```bash
# 实时查看日志
gcloud run services logs tail amazon-research-system --region us-central1

# 查看最近的日志
gcloud run services logs read amazon-research-system --region us-central1 --limit 50
```

### 更新服务

```bash
# 更新镜像
gcloud builds submit --tag ${IMAGE_NAME}:v2
gcloud run deploy amazon-research-system \
  --image ${IMAGE_NAME}:v2 \
  --region us-central1

# 回滚到上一个版本
gcloud run services update-traffic amazon-research-system \
  --to-revisions PREVIOUS_REVISION=100 \
  --region us-central1
```

### 自定义域名

```bash
# 映射域名
gcloud run domain-mappings create \
  --service amazon-research-system \
  --domain research.yourdomain.com \
  --region us-central1
```

---

## 💰 成本估算

### Cloud Run 免费额度（每月）
- ✅ 200万请求
- ✅ 36万 GB-秒内存
- ✅ 18万 vCPU-秒
- ✅ 1 GB 网络出站流量

### 预估成本（超出免费额度后）
基于配置：512Mi 内存，1 CPU

| 请求量/月 | 预估成本 |
|----------|---------|
| 10,000 | $0 (免费额度内) |
| 100,000 | ~$1-2 |
| 1,000,000 | ~$10-15 |
| 10,000,000 | ~$100-150 |

[官方价格计算器](https://cloud.google.com/products/calculator)

---

## 🛡️ 安全最佳实践

### 1. 使用 Secret Manager 存储敏感信息
```bash
# 不要在代码中硬编码 API Key
# 使用 Secret Manager 或环境变量
```

### 2. 限制服务访问（可选）
```bash
# 需要身份验证才能访问
gcloud run deploy amazon-research-system \
  --image ${IMAGE_NAME} \
  --region us-central1 \
  --no-allow-unauthenticated

# 配置 IAM 权限
gcloud run services add-iam-policy-binding amazon-research-system \
  --member="user:your-email@example.com" \
  --role="roles/run.invoker" \
  --region us-central1
```

### 3. 设置 VPC 连接器（高级）
```bash
# 用于连接私有数据库或服务
gcloud run services update amazon-research-system \
  --vpc-connector your-connector-name \
  --region us-central1
```

---

## 🐛 故障排查

### 问题 1: 构建失败

```bash
# 检查 Dockerfile 语法
docker build -t test .

# 查看 Cloud Build 日志
gcloud builds list
gcloud builds log BUILD_ID
```

### 问题 2: 服务无法启动

```bash
# 检查环境变量是否正确设置
gcloud run services describe amazon-research-system --region us-central1

# 查看容器日志
gcloud run services logs read amazon-research-system --region us-central1
```

### 问题 3: API 调用失败

```bash
# 验证 OPENROUTER_API_KEY 是否正确
gcloud run services describe amazon-research-system \
  --region us-central1 \
  --format="value(spec.template.spec.containers[0].env)"
```

### 问题 4: 内存不足

```bash
# 增加内存限制
gcloud run services update amazon-research-system \
  --memory 1Gi \
  --region us-central1
```

---

## 📈 性能优化

### 1. 配置最小实例数（减少冷启动）

```bash
gcloud run services update amazon-research-system \
  --min-instances 1 \
  --region us-central1
```

> ⚠️ 注意：设置最小实例会增加成本

### 2. 启用 CPU 始终分配

```bash
gcloud run services update amazon-research-system \
  --cpu-boost \
  --region us-central1
```

### 3. 增加并发数

```bash
gcloud run services update amazon-research-system \
  --concurrency 100 \
  --region us-central1
```

---

## 🔄 CI/CD 集成

### GitHub Actions 示例

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches:
      - main

env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  SERVICE_NAME: amazon-research-system
  REGION: us-central1

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ env.PROJECT_ID }}

      - name: Configure Docker
        run: gcloud auth configure-docker

      - name: Build and Push
        run: |
          gcloud builds submit \
            --tag gcr.io/$PROJECT_ID/$SERVICE_NAME:$GITHUB_SHA

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy $SERVICE_NAME \
            --image gcr.io/$PROJECT_ID/$SERVICE_NAME:$GITHUB_SHA \
            --region $REGION \
            --platform managed \
            --allow-unauthenticated \
            --set-env-vars OPENROUTER_API_KEY=${{ secrets.OPENROUTER_API_KEY }}
```

---

## 📚 相关资源

- [Cloud Run 官方文档](https://cloud.google.com/run/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [Docker 最佳实践](https://docs.docker.com/develop/dev-best-practices/)
- [Secret Manager 文档](https://cloud.google.com/secret-manager/docs)

---

## ✅ 部署检查清单

- [ ] 安装 gcloud CLI 和 Docker
- [ ] 创建 GCP 项目并启用计费
- [ ] 设置环境变量（PROJECT_ID, API_KEY）
- [ ] 执行部署脚本或手动部署
- [ ] 验证服务可访问
- [ ] 测试 API 功能
- [ ] 配置自定义域名（可选）
- [ ] 设置监控和告警（可选）
- [ ] 配置 CI/CD（可选）

---

**祝部署顺利！🎉**

如有问题，请查看故障排查章节或联系技术支持。
