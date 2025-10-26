# 📦 部署文件清单

亚马逊调研系统已配置完成，可以部署到 Google Cloud Run。

---

## 📂 新增部署文件

以下文件已创建，用于 Google Cloud 部署：

### 1. Docker 配置
- ✅ `Dockerfile` - 多阶段构建配置，优化镜像大小
- ✅ `.dockerignore` - 排除不必要的文件
- ✅ `next.config.mjs` - 已添加 `output: 'standalone'` 配置

### 2. Google Cloud 配置
- ✅ `.gcloudignore` - 上传排除规则
- ✅ `.env.production` - 生产环境变量模板

### 3. 部署脚本
- ✅ `deploy.sh` - 一键自动化部署脚本（可执行）
- ✅ `install-tools.sh` - 工具安装脚本（可执行）

### 4. 文档
- ✅ `DEPLOYMENT_GUIDE.md` - 完整部署指南（7000+ 字）
- ✅ `QUICK_START.md` - 快速开始指南
- ✅ `README_DEPLOYMENT.md` - 本文件

---

## 🚀 快速部署（三步走）

### 方案 A：首次部署（需要安装工具）

```bash
# 步骤 1: 安装必需工具
./install-tools.sh

# 步骤 2: 登录并配置
gcloud auth login
gcloud auth configure-docker

# 步骤 3: 设置环境变量并部署
export GCP_PROJECT_ID="your-project-id"
export OPENROUTER_API_KEY="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"
./deploy.sh
```

### 方案 B：已安装工具（直接部署）

```bash
# 设置环境变量
export GCP_PROJECT_ID="your-project-id"
export OPENROUTER_API_KEY="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"

# 执行部署
./deploy.sh
```

---

## 📋 部署前准备

### 必需条件
- [ ] Google Cloud Platform 账户
- [ ] 已创建 GCP 项目
- [ ] 已启用计费（有免费额度）
- [ ] 已安装 `gcloud` CLI
- [ ] 已安装 Docker Desktop

### 必需信息
- `GCP_PROJECT_ID`: 你的 Google Cloud 项目 ID
- `OPENROUTER_API_KEY`: OpenRouter API 密钥

---

## 🔧 部署配置

### 默认配置（可在 deploy.sh 中修改）

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| 区域 | us-central1 | 服务部署区域 |
| 服务名 | amazon-research-system | Cloud Run 服务名称 |
| 内存 | 512Mi | 容器内存限制 |
| CPU | 1 | CPU 核心数 |
| 最小实例 | 0 | 自动缩减到 0 节省成本 |
| 最大实例 | 10 | 最多扩展到 10 个实例 |
| 超时时间 | 60s | 请求超时时间 |

### 修改配置

编辑 `deploy.sh` 文件中的变量：

```bash
# 在 deploy.sh 中修改这些值
REGION="asia-east1"        # 改为香港区域
MEMORY="1Gi"               # 增加内存到 1GB
MIN_INSTANCES="1"          # 保持 1 个实例（减少冷启动）
MAX_INSTANCES="20"         # 增加最大实例数
```

---

## 📊 部署流程

运行 `./deploy.sh` 后，脚本会自动执行以下步骤：

```
[1/7] 检查必需工具
      ├─ 验证 gcloud CLI
      └─ 验证 Docker

[2/7] 验证项目配置
      ├─ 检查 GCP_PROJECT_ID
      └─ 检查 OPENROUTER_API_KEY

[3/7] 设置 GCP 项目
      └─ gcloud config set project

[4/7] 启用必需的 API
      ├─ Cloud Build API
      ├─ Cloud Run API
      └─ Container Registry API

[5/7] 构建 Docker 镜像
      ├─ 使用 Cloud Build 构建
      ├─ 推送到 Google Container Registry
      └─ 标记为 gcr.io/PROJECT_ID/SERVICE_NAME:latest

[6/7] 部署到 Cloud Run
      ├─ 创建新服务或更新现有服务
      ├─ 配置环境变量
      └─ 设置访问权限

[7/7] 获取服务 URL
      └─ 输出访问地址
```

预计时间：**3-5 分钟**（首次部署）

---

## 🎯 部署后操作

### 1. 验证部署

```bash
# 访问服务 URL（在部署输出中）
open https://amazon-research-system-xxxxx.run.app

# 或查看服务详情
gcloud run services describe amazon-research-system --region us-central1
```

### 2. 测试功能

在浏览器中打开服务 URL，测试：
- ✅ URL 输入（Makerworld 链接）
- ✅ 文本输入（中文产品描述）
- ✅ 生成的 JSON 结果
- ✅ 亚马逊搜索链接

### 3. 查看日志

```bash
# 实时查看日志
gcloud run services logs tail amazon-research-system --region us-central1

# 查看最近的日志
gcloud run services logs read amazon-research-system --region us-central1 --limit 50
```

### 4. 更新部署

修改代码后重新运行：

```bash
# 重新部署（使用相同的环境变量）
./deploy.sh
```

---

## 💰 成本估算

### Cloud Run 免费额度（每月）
- ✅ 200 万次请求
- ✅ 36 万 GB-秒内存
- ✅ 18 万 vCPU-秒
- ✅ 1 GB 网络出站

### 小规模使用（< 10,000 次请求/月）
**完全免费** 🎉

### 中等使用（100,000 次请求/月）
约 **$1-2 USD/月**

### 大规模使用（1,000,000 次请求/月）
约 **$10-15 USD/月**

> 💡 提示：设置 `MIN_INSTANCES=0` 可在无流量时自动缩减到 0，避免空闲成本。

---

## 🔒 安全建议

### 1. 使用 Secret Manager 存储 API Key

```bash
# 创建 secret
echo -n "your-api-key" | gcloud secrets create openrouter-api-key --data-file=-

# 授权 Cloud Run 访问
gcloud secrets add-iam-policy-binding openrouter-api-key \
  --member=serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor

# 部署时引用 secret
gcloud run deploy amazon-research-system \
  --set-secrets OPENROUTER_API_KEY=openrouter-api-key:latest \
  --region us-central1
```

### 2. 限制访问（可选）

```bash
# 需要身份验证才能访问
gcloud run services update amazon-research-system \
  --no-allow-unauthenticated \
  --region us-central1
```

### 3. 设置预算提醒

访问：https://console.cloud.google.com/billing/budgets

设置每月预算提醒，避免意外费用。

---

## 🛠️ 常用管理命令

```bash
# 查看所有 Cloud Run 服务
gcloud run services list

# 查看服务详情
gcloud run services describe amazon-research-system --region us-central1

# 查看实时日志
gcloud run services logs tail amazon-research-system --region us-central1

# 更新环境变量
gcloud run services update amazon-research-system \
  --set-env-vars KEY=VALUE \
  --region us-central1

# 更新实例配置
gcloud run services update amazon-research-system \
  --memory 1Gi \
  --cpu 2 \
  --region us-central1

# 删除服务
gcloud run services delete amazon-research-system --region us-central1
```

---

## 📈 性能优化

### 减少冷启动

```bash
# 设置最小实例数（会增加成本）
gcloud run services update amazon-research-system \
  --min-instances 1 \
  --region us-central1
```

### 增加并发数

```bash
# 每个实例处理更多并发请求
gcloud run services update amazon-research-system \
  --concurrency 100 \
  --region us-central1
```

### 启用 CPU Boost

```bash
# 启动时分配更多 CPU
gcloud run services update amazon-research-system \
  --cpu-boost \
  --region us-central1
```

---

## 🌐 自定义域名（可选）

```bash
# 验证域名所有权（在 GCP Console）

# 映射域名
gcloud run domain-mappings create \
  --service amazon-research-system \
  --domain research.yourdomain.com \
  --region us-central1

# 配置 DNS（在你的域名服务商）
# 添加 CNAME 记录指向 ghs.googlehosted.com
```

---

## 📞 获取帮助

### 查看日志排查问题

```bash
# Cloud Build 日志
gcloud builds list
gcloud builds log BUILD_ID

# Cloud Run 日志
gcloud run services logs read amazon-research-system --region us-central1
```

### 常见问题

**Q: 构建失败？**
```bash
# 本地测试 Docker 构建
docker build -t test .
```

**Q: 环境变量未生效？**
```bash
# 查看当前环境变量
gcloud run services describe amazon-research-system \
  --region us-central1 \
  --format="value(spec.template.spec.containers[0].env)"
```

**Q: 服务无法访问？**
```bash
# 检查服务状态
gcloud run services describe amazon-research-system --region us-central1
```

---

## 📚 相关文档

- 📖 [完整部署指南](./DEPLOYMENT_GUIDE.md) - 详细的部署文档
- 🚀 [快速开始](./QUICK_START.md) - 快速部署步骤
- 📋 [项目说明](./README.md) - 项目功能介绍
- 🔧 [API 配置](./API_CONFIG.md) - OpenRouter 配置说明

---

## ✅ 部署检查清单

### 首次部署
- [ ] 安装 gcloud CLI 和 Docker
- [ ] 创建 GCP 项目
- [ ] 启用计费
- [ ] 登录 gcloud (`gcloud auth login`)
- [ ] 配置 Docker (`gcloud auth configure-docker`)
- [ ] 设置环境变量（PROJECT_ID, API_KEY）
- [ ] 运行 `./deploy.sh`
- [ ] 验证服务可访问
- [ ] 测试功能

### 更新部署
- [ ] 修改代码
- [ ] 运行 `./deploy.sh`
- [ ] 验证新版本
- [ ] 查看日志确认无错误

---

**🎉 准备好了吗？开始部署到云端吧！**

```bash
# 一键部署命令
export GCP_PROJECT_ID="your-project-id"
export OPENROUTER_API_KEY="your-api-key"
./deploy.sh
```

祝部署顺利！如有问题，请查看完整的 [部署指南](./DEPLOYMENT_GUIDE.md)。
