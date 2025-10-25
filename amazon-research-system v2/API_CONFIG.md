# 🔑 API 配置说明

## OpenRouter API 已集成

本系统已成功集成 OpenRouter API，用于驱动 AI 智能分析功能。

### ✅ 已完成的配置

1. **环境变量配置**
   - 已创建 `.env.local` 文件
   - 已配置 OpenRouter API Key
   - API Key: `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`

2. **代码集成**
   - ✅ 安装了 `@ai-sdk/openai` 包
   - ✅ 修改了 `/app/api/analyze/route.ts` 配置 OpenRouter
   - ✅ 使用 OpenRouter 的自定义 baseURL

### 📁 配置文件位置

```
.env.local              # 环境变量（已配置API密钥）
.env.example            # 环境变量模板
app/api/analyze/route.ts # API路由（已集成OpenRouter）
```

### 🔧 环境变量

```bash
# OpenRouter API Key
OPENROUTER_API_KEY=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

# OpenRouter Base URL
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

### 🚀 启动项目

```bash
# 安装依赖
npm install --legacy-peer-deps

# 开发模式
npm run dev

# 生产构建
npm run build
npm start
```

访问 http://localhost:3000 即可使用系统。

### 🎯 使用的 AI 模型

- **模型**: `openai/gpt-4o-mini`
- **提供商**: OpenRouter
- **温度**: 0.3 (低温度确保输出稳定准确)

### 📊 API 调用流程

1. 用户输入 (ASIN / URL / 文本) → 前端表单
2. 数据发送到 `/api/analyze` → Next.js API Route
3. 调用 OpenRouter API → 使用 GPT-4o-mini 模型
4. AI 返回结构化 JSON → 解析验证
5. 展示分析结果 → 前端界面

### ⚠️ 注意事项

1. `.env.local` 文件已在 `.gitignore` 中，不会被提交到代码仓库
2. 如需更换 API Key，直接修改 `.env.local` 文件即可
3. 重启开发服务器后新的环境变量才会生效

### 🔍 API Key 安全

- ✅ API Key 存储在环境变量中
- ✅ 仅在服务器端使用（Next.js API Route）
- ✅ 不会暴露到前端浏览器
- ✅ `.env.local` 已被 Git 忽略

### 💡 模型选择说明

系统使用 `gpt-4o-mini` 模型的原因：
- ✅ 成本低，适合大量调用
- ✅ 速度快，响应迅速
- ✅ 质量高，足够满足产品分析需求
- ✅ OpenRouter 支持多种模型自由切换

如需更换模型，修改 `app/api/analyze/route.ts` 中的 `openrouter("openai/gpt-4o-mini")` 即可。

---

## 🎉 集成完成

系统已经可以正常使用 OpenRouter API 进行产品智能分析！


