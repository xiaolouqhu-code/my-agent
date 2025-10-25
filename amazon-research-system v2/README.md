# 🚀 流金亚马逊智能调研系统

**Amazon Research Intelligence System**

一个基于 AI 驱动的亚马逊产品智能调研工具，支持多种输入方式，自动生成结构化调研报告。

---

## 📋 系统功能

### 核心能力

1. **多源输入支持**
   - 🔍 **ASIN**: 直接输入亚马逊产品编号
   - 🔗 **URL**: 支持外部网站链接（Makerworld、Thingiverse、eBay、Pinterest、Alibaba等）
   - 📝 **文本**: 自由文本描述产品

2. **AI 智能分析**
   - 使用 OpenRouter API + GPT-4o-mini 模型
   - 自动识别产品类型和用途
   - 提取关键词和目标用户
   - 生成亚马逊搜索查询

3. **结构化输出**
   ```json
   {
     "input_type": "产品输入类型",
     "product_name": "英文产品名称",
     "product_type": "产品分类",
     "product_type_cn": "中文分类说明",
     "summary": "产品用途说明",
     "keywords": ["关键词1", "关键词2"],
     "category_path": "亚马逊类目路径",
     "target_users": ["目标用户群"],
     "compatible_with": ["兼容品牌/型号"],
     "search_query": "搜索查询语句",
     "confidence": 0.95
   }
   ```

4. **便捷操作**
   - ✅ 复制 JSON 数据
   - ✅ 下载 JSON 文件
   - ✅ 一键跳转亚马逊搜索
   - ✅ 置信度评分显示

5. **认证系统**
   - 集成卖家精灵（SellerSprite）登录
   - Cookie 持久化登录态

---

## 🛠️ 技术栈

- **前端框架**: Next.js 16 + React 19
- **UI 组件**: Radix UI + Tailwind CSS
- **AI 引擎**: OpenRouter API (GPT-4o-mini)
- **开发语言**: TypeScript
- **表单管理**: React Hook Form + Zod
- **通知系统**: Sonner Toast

---

## ⚙️ 快速开始

### 1. 安装依赖

```bash
npm install --legacy-peer-deps
```

### 2. 配置环境变量

系统已自动配置，如需修改可编辑 `.env.local`:

```bash
OPENROUTER_API_KEY=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
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 生产构建

```bash
npm run build
npm start
```

---

## 📂 项目结构

```
amazon-research-system-v2/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts       # AI 分析 API (已集成 OpenRouter)
│   │   └── auth/                  # 认证相关 API
│   ├── layout.tsx                 # 全局布局
│   ├── page.tsx                   # 首页
│   └── globals.css                # 全局样式
├── components/
│   ├── research-form.tsx          # 调研表单组件
│   ├── research-result.tsx        # 结果展示组件
│   ├── header.tsx                 # 页面头部
│   ├── sellersprite-login-dialog.tsx  # 登录弹窗
│   └── ui/                        # UI 组件库 (Radix + shadcn/ui)
├── lib/
│   ├── types.ts                   # TypeScript 类型定义
│   └── utils.ts                   # 工具函数
├── .env.local                     # 环境变量 (已配置)
├── .env.example                   # 环境变量模板
├── package.json                   # 依赖配置
└── tsconfig.json                  # TypeScript 配置
```

---

## 🔑 API 配置详情

### OpenRouter 集成

系统已完成 OpenRouter API 集成：

- ✅ 安装 `@ai-sdk/openai` 包
- ✅ 配置自定义 baseURL
- ✅ 环境变量管理 API Key
- ✅ 服务端调用，不暴露密钥

### 使用的 AI 模型

- **模型**: `openai/gpt-4o-mini`
- **提供商**: OpenRouter
- **温度参数**: 0.3 (确保输出稳定)
- **优势**: 成本低、速度快、质量高

### API 调用流程

```
用户输入
  ↓
前端表单 (research-form.tsx)
  ↓
POST /api/analyze
  ↓
OpenRouter API (GPT-4o-mini)
  ↓
JSON 解析 & 验证
  ↓
结果展示 (research-result.tsx)
```

更多配置细节请查看 [API_CONFIG.md](./API_CONFIG.md)

---

## 🎯 使用示例

### 示例 1: ASIN 输入

**输入**:
```
B0C1234ABC
```

**输出**:
系统自动分析该 ASIN 对应的产品类型、关键词、类目等信息。

### 示例 2: URL 输入

**输入**:
```
https://makerworld.com/en/models/492838
```

**输出**:
```json
{
  "input_type": "makerworld",
  "product_name": "Milwaukee M18 Router Base Expansion Plate",
  "product_type": "router accessory",
  "product_type_cn": "电动修边机底座扩展配件",
  "summary": "用于增强Milwaukee M18修边机底座的稳定性和导向精度。",
  "keywords": ["router base", "woodworking", "M18 accessory"],
  "category_path": "Tools > Power Tools > Routers",
  "target_users": ["DIY木工", "专业技师"],
  "compatible_with": ["Milwaukee M18 Router"],
  "search_query": "router base woodworking M18",
  "confidence": 0.94
}
```

### 示例 3: 文本输入

**输入**:
```
3D打印的M18电池支架
```

**输出**:
系统理解产品描述，生成英文关键词和亚马逊搜索查询。

---

## 🔒 安全特性

- ✅ API Key 存储在环境变量中
- ✅ 仅在服务器端调用 API（Next.js API Route）
- ✅ 不暴露密钥到前端浏览器
- ✅ `.env.local` 已被 Git 忽略

---

## 📊 系统优势

1. **智能化**: AI 自动理解产品，无需手动填写
2. **标准化**: 输出结构统一，便于后续处理
3. **多样化**: 支持多种输入源，灵活适配不同场景
4. **自动化**: 可与 Playwright 爬虫集成，实现全自动调研
5. **现代化**: 使用最新技术栈，性能优秀，体验流畅

---

## 🎨 界面预览

- 🌐 **响应式设计**: 支持桌面端和移动端
- 🌓 **深色模式**: 支持亮色/暗色主题切换
- 🎯 **简洁布局**: 清晰的信息层级，易于使用
- ⚡ **实时反馈**: 分析进度提示，置信度显示

---

## 🚧 后续规划

- [ ] 图片识别输入支持
- [ ] 批量分析功能
- [ ] 历史记录管理
- [ ] 数据导出为 Excel/CSV
- [ ] Playwright 爬虫脚本生成
- [ ] 竞品对比分析
- [ ] 多站点支持（英国、德国、日本等）

---

## 📞 技术支持

- 系统代号: `amz_research_v0`
- AI 模块: OpenRouter + GPT-4o-mini
- 开发框架: Next.js 16

---

## 📝 更新日志

### v2.0 (Current)
- ✅ 集成 OpenRouter API
- ✅ 配置 GPT-4o-mini 模型
- ✅ 环境变量管理
- ✅ 完整的 TypeScript 类型支持

### v1.0
- 🎉 初始版本发布
- 🎨 现代化 UI 设计
- 🔍 多源输入支持
- 📊 结构化输出

---

## 🎉 开始使用

系统已配置完成，现在就可以开始使用了！

```bash
# 开发服务器已在后台运行
访问: http://localhost:3000
```

输入 ASIN、URL 或文本描述，体验 AI 智能调研的强大功能！

---

**Made with ❤️ by 流金团队**


