# 📦 Google Cloud 部署和 MCP 集成总结

完整的 Google Cloud 部署配置 + MCP 服务器集成方案。

---

## ✅ 已完成的工作

### 1. Cloud Run 部署配置

已创建以下文件用于部署到 Google Cloud Run:

| 文件 | 用途 |
|------|------|
| `Dockerfile` | Docker 多阶段构建配置 |
| `.dockerignore` | 构建时排除不必要文件 |
| `.gcloudignore` | 上传时排除文件 |
| `deploy.sh` ⭐ | **一键自动化部署脚本** |
| `install-tools.sh` | 工具安装脚本 |
| `next.config.mjs` | 已配置 standalone 输出模式 |
| `.env.production` | 生产环境变量模板 |

### 2. 部署文档

| 文档 | 内容 |
|------|------|
| `DEPLOYMENT_GUIDE.md` | 完整部署指南（8.8K） |
| `QUICK_START.md` | 快速开始指南（5.0K） |
| `README_DEPLOYMENT.md` | 部署文件清单（8.7K） |

### 3. MCP 服务器集成

已配置两个 Google Cloud MCP 服务器:

| MCP 服务器 | 功能 |
|-----------|------|
| **google-cloud-run** | 🚀 直接从 Claude 部署应用到 Cloud Run |
| **google-cloud-platform** | ☁️ 全面管理 GCP 资源（Billing, Logging, IAM...） |

---

## 🚀 两种使用方式

### 方式 1: 部署应用到 Cloud Run

#### 快速部署（推荐）

```bash
# 1. 设置环境变量
export GCP_PROJECT_ID="your-project-id"
export OPENROUTER_API_KEY="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"

# 2. 执行部署
./deploy.sh
```

#### 手动部署

查看 `DEPLOYMENT_GUIDE.md` 了解详细步骤。

#### 部署后
- 🌐 获得 HTTPS 访问链接
- ⚡ 自动扩展 (0-10 实例)
- 📊 实时日志查看
- 💰 按需付费（无流量时零成本）

---

### 方式 2: 通过 MCP 从 Claude 部署

#### 安装 MCP 服务器

```bash
# 运行安装脚本
~/Documents/ai-file/install-gcp-mcp.sh
```

#### 配置 Claude Code

安装脚本会自动生成配置，将其添加到:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

#### 使用示例

在 Claude Code 中直接说：

```
"帮我把当前的 amazon-research-system 项目部署到 Cloud Run"
"查看服务日志"
"列出所有 Cloud Run 服务"
"分析这个月的 GCP 费用"
```

Claude 会自动：
1. 读取项目文件
2. 构建 Docker 镜像
3. 推送到 Container Registry
4. 部署到 Cloud Run
5. 返回服务 URL

---

## 📋 部署前准备

### 必需工具

- [ ] Google Cloud SDK (gcloud)
- [ ] Docker Desktop
- [ ] Node.js >= 18

### 快速安装

```bash
# 安装部署工具
./install-tools.sh

# 安装 MCP 服务器
~/Documents/ai-file/install-gcp-mcp.sh
```

### 认证配置

```bash
# 登录 Google Cloud
gcloud auth login

# 设置应用默认凭据
gcloud auth application-default login

# 设置项目
gcloud config set project YOUR_PROJECT_ID
```

---

## 🎯 功能对比

### 直接部署 vs MCP 部署

| 特性 | 直接部署 (deploy.sh) | MCP 部署 (Claude) |
|------|---------------------|------------------|
| 部署方式 | 命令行脚本 | 自然语言对话 |
| 适用场景 | CI/CD 自动化 | 交互式开发 |
| 配置复杂度 | 中等 | 低 |
| 灵活性 | 高（可定制脚本） | 高（AI 理解意图） |
| 学习曲线 | 需要了解 gcloud | 无需学习命令 |

**推荐**: 两种方式结合使用
- 🤖 **日常开发**: 使用 MCP 在 Claude 中部署
- 🔄 **自动化流程**: 使用 deploy.sh 在 CI/CD 中

---

## 💰 成本估算

### Cloud Run 免费额度（每月）
- ✅ 200万次请求
- ✅ 36万 GB-秒内存
- ✅ 18万 vCPU-秒
- ✅ 1 GB 网络出站

### 预估成本

| 请求量/月 | 配置 (512Mi/1CPU) | 估算成本 |
|----------|------------------|---------|
| < 10,000 | 免费额度内 | **$0** 🎉 |
| 100,000 | 超出部分 | ~$1-2 |
| 1,000,000 | 中等规模 | ~$10-15 |

**小规模使用完全免费！**

---

## 🔐 安全配置

### 环境变量管理

**开发环境** (`.env.local`):
```bash
OPENROUTER_API_KEY=sk-or-v1-999d7369...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

**生产环境** (Cloud Run):
```bash
# 使用 Secret Manager（推荐）
gcloud secrets create openrouter-api-key --data-file=-

# 或在部署时设置
./deploy.sh  # 自动从环境变量读取
```

### 访问控制

```bash
# 需要认证才能访问（可选）
gcloud run services update amazon-research-system \
  --no-allow-unauthenticated \
  --region us-central1
```

---

## 📊 监控和管理

### 查看服务状态

```bash
# CLI 方式
gcloud run services describe amazon-research-system --region us-central1

# MCP 方式（在 Claude 中）
"查看 amazon-research-system 服务状态"
```

### 查看日志

```bash
# CLI 方式
gcloud run services logs tail amazon-research-system --region us-central1

# MCP 方式（在 Claude 中）
"显示最近的服务日志"
```

### 更新配置

```bash
# CLI 方式
gcloud run services update amazon-research-system \
  --memory 1Gi \
  --region us-central1

# MCP 方式（在 Claude 中）
"把服务内存增加到 1GB"
```

---

## 🌐 可用的 MCP 功能

### Cloud Run MCP (官方)

**部署管理**:
- ✅ 部署文件/文件夹到 Cloud Run
- ✅ 列出所有服务
- ✅ 查看服务详情
- ✅ 更新服务配置

**日志和监控**:
- ✅ 实时查看日志
- ✅ 错误追踪
- ✅ 性能分析

**自然语言命令**:
- `deploy` - 部署当前目录
- `logs` - 查看日志
- `list` - 列出服务

### Google Cloud Platform MCP (社区)

**成本管理**:
- ✅ 分析账单
- ✅ 成本异常检测
- ✅ 优化建议

**日志分析**:
- ✅ 查询日志
- ✅ 过滤和搜索
- ✅ 趋势分析

**权限管理**:
- ✅ IAM 策略查询
- ✅ 权限审计
- ✅ 安全建议

**监控指标**:
- ✅ CPU/内存使用率
- ✅ 请求延迟
- ✅ 错误率

**性能分析**:
- ✅ 瓶颈检测
- ✅ 性能优化建议
- ✅ 分布式追踪

---

## 🎯 使用场景示例

### 场景 1: 快速原型部署

```
用户（在 Claude 中）: "帮我把这个项目部署到 Cloud Run"

Claude:
1. 分析项目结构
2. 生成 Dockerfile（如果没有）
3. 构建镜像
4. 部署到 Cloud Run
5. 返回访问 URL

结果: 3-5 分钟完成部署 ✨
```

### 场景 2: 成本优化

```
用户: "分析我的 GCP 成本，找出可以优化的地方"

Claude:
1. 查询 Billing API
2. 识别高成本服务
3. 检测异常使用
4. 提供优化建议

结果: 节省 20-30% 成本 💰
```

### 场景 3: 故障排查

```
用户: "为什么我的服务一直返回 500 错误？"

Claude:
1. 查看 Error Reporting
2. 分析最近的日志
3. 检查性能指标
4. 定位问题代码

结果: 快速定位并修复问题 🔧
```

---

## 📚 相关文档

### 部署文档
- 📖 [完整部署指南](./DEPLOYMENT_GUIDE.md)
- 🚀 [快速开始](./QUICK_START.md)
- 📋 [部署文件清单](./README_DEPLOYMENT.md)

### MCP 文档
- ☁️ [GCP MCP 配置指南](~/Documents/ai-file/GCP_MCP_SETUP.md)
- 🔧 [MCP 快速参考](~/Documents/ai-file/MCP_快速参考.md)
- 📝 [MCP 配置指南](~/Documents/ai-file/MCP_配置指南.md)

### 项目文档
- 🏠 [项目介绍](./README.md)
- 🔑 [API 配置](./API_CONFIG.md)

---

## ✅ 检查清单

### 部署到 Cloud Run
- [ ] 安装 gcloud CLI 和 Docker
- [ ] 登录并设置项目
- [ ] 设置环境变量
- [ ] 运行 `./deploy.sh`
- [ ] 验证服务可访问

### 配置 MCP
- [ ] 运行 `install-gcp-mcp.sh`
- [ ] 更新 Claude Code 配置
- [ ] 重启 Claude Code
- [ ] 测试 MCP 功能

---

## 🎉 总结

你现在拥有：

1. **自动化部署脚本** - 一键部署到 Cloud Run
2. **完整文档** - 详细的部署和使用指南
3. **MCP 集成** - 在 Claude 中用自然语言管理 GCP
4. **生产就绪** - 安全、可扩展的配置

**两种使用方式**:
- 🤖 **在 Claude 中**: "帮我部署到 Cloud Run"
- 💻 **在终端中**: `./deploy.sh`

**下一步**:
1. 选择一种方式开始部署
2. 查看相关文档了解更多功能
3. 体验 AI 驱动的云管理！

---

**祝部署顺利！** 🚀☁️
