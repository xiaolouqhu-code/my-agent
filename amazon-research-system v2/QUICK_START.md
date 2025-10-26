# 🚀 快速开始 - 部署到 Google Cloud

## 📝 快速安装必需工具

### 1. 安装 Google Cloud SDK

```bash
# 使用 Homebrew 安装（推荐）
brew install --cask google-cloud-sdk

# 或者使用官方安装脚本
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# 验证安装
gcloud version
```

### 2. 安装 Docker Desktop

```bash
# 使用 Homebrew 安装（推荐）
brew install --cask docker

# 或者从官网下载
# https://www.docker.com/products/docker-desktop

# 启动 Docker Desktop 应用后，验证安装
docker --version
```

---

## 🔐 初始化 Google Cloud

### 1. 登录 Google Cloud

```bash
# 登录到 Google Cloud
gcloud auth login

# 这会打开浏览器，选择你的 Google 账户并授权
```

### 2. 创建或选择项目

```bash
# 列出现有项目
gcloud projects list

# 创建新项目（可选）
gcloud projects create my-amazon-research --name="Amazon Research System"

# 设置当前项目
gcloud config set project YOUR_PROJECT_ID
```

### 3. 配置 Docker 认证

```bash
# 配置 Docker 使用 gcloud 作为凭据助手
gcloud auth configure-docker
```

---

## ⚡ 一键部署

### 步骤 1: 设置环境变量

```bash
# 进入项目目录
cd "/Users/allenlou/Documents/ai-file/my-agent/amazon-research-system v2"

# 设置必需的环境变量
export GCP_PROJECT_ID="your-project-id"              # 替换为你的项目 ID
export OPENROUTER_API_KEY="sk-or-v1-999d7369..."     # 使用你的 API Key
export GCP_REGION="us-central1"                      # 可选，默认 us-central1
export SERVICE_NAME="amazon-research-system"         # 可选，默认名称
```

### 步骤 2: 执行部署

```bash
# 运行部署脚本
./deploy.sh
```

部署脚本会自动完成以下操作：
1. ✅ 检查工具是否安装
2. ✅ 验证项目配置
3. ✅ 启用必需的 GCP API
4. ✅ 构建 Docker 镜像（使用 Cloud Build）
5. ✅ 部署到 Cloud Run
6. ✅ 输出服务访问 URL

### 步骤 3: 访问应用

部署成功后，你会看到类似输出：

```
╔════════════════════════════════════════════╗
║          🎉 部署成功！                      ║
╚════════════════════════════════════════════╝

🌐 服务 URL: https://amazon-research-system-xxxxx.run.app
```

点击 URL 即可访问你的应用！

---

## 🎯 完整示例

```bash
# 1. 安装工具
brew install --cask google-cloud-sdk docker

# 2. 登录 Google Cloud
gcloud auth login

# 3. 创建项目（如果还没有）
gcloud projects create my-research-123 --name="Amazon Research"

# 4. 进入项目目录
cd "/Users/allenlou/Documents/ai-file/my-agent/amazon-research-system v2"

# 5. 设置环境变量
export GCP_PROJECT_ID="my-research-123"
export OPENROUTER_API_KEY="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"

# 6. 部署
./deploy.sh

# 7. 等待部署完成（约 3-5 分钟）
# 8. 访问输出的 URL
```

---

## 📋 部署前检查清单

- [ ] ✅ 已安装 gcloud CLI
- [ ] ✅ 已安装 Docker Desktop 并启动
- [ ] ✅ 已登录 Google Cloud (`gcloud auth login`)
- [ ] ✅ 已创建或选择 GCP 项目
- [ ] ✅ 已启用计费（Cloud Run 有免费额度）
- [ ] ✅ 已设置 `GCP_PROJECT_ID` 环境变量
- [ ] ✅ 已设置 `OPENROUTER_API_KEY` 环境变量

---

## 🔍 验证工具安装

运行以下命令验证所有工具已正确安装：

```bash
# 检查 gcloud
gcloud version

# 检查 Docker
docker --version

# 检查当前 GCP 项目
gcloud config get-value project
```

如果所有命令都成功执行，你就可以开始部署了！

---

## 💡 常见问题

### Q: 如何获取 GCP 项目 ID？
```bash
# 列出所有项目
gcloud projects list

# 输出示例：
# PROJECT_ID              NAME                    PROJECT_NUMBER
# my-research-123         Amazon Research         123456789
```

### Q: 如何检查是否已启用计费？
访问：https://console.cloud.google.com/billing

### Q: 部署失败怎么办？
查看详细错误信息：
```bash
# 查看 Cloud Build 日志
gcloud builds list
gcloud builds log BUILD_ID

# 查看 Cloud Run 日志
gcloud run services logs read amazon-research-system --region us-central1
```

### Q: 如何更新已部署的应用？
```bash
# 修改代码后重新运行
./deploy.sh

# 新版本会自动替换旧版本
```

### Q: 如何删除部署？
```bash
# 删除 Cloud Run 服务
gcloud run services delete amazon-research-system --region us-central1

# 删除 Docker 镜像
gcloud container images delete gcr.io/YOUR_PROJECT_ID/amazon-research-system
```

---

## 📚 下一步

- 📖 查看完整的 [部署指南](./DEPLOYMENT_GUIDE.md)
- 🔐 配置 [Secret Manager](./DEPLOYMENT_GUIDE.md#使用-secret-manager推荐) 保护 API Key
- 🌐 设置 [自定义域名](./DEPLOYMENT_GUIDE.md#自定义域名)
- 📊 查看 [成本估算](./DEPLOYMENT_GUIDE.md#成本估算)
- 🔄 设置 [CI/CD](./DEPLOYMENT_GUIDE.md#cicd-集成)

---

**准备好了吗？开始部署吧！** 🚀
