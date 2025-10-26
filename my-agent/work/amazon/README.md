# 🚀 FlowGold Amazon AI 运营系统

**FlowGold Amazon AI Operation System** - 基于AI的全自动亚马逊电商运营系统

一个完整的AI驱动的亚马逊电商运营解决方案，通过19个智能Agent实现从市场调研、产品研发、供应链管理到营销优化的全流程自动化。

---

## 📋 目录

- [系统架构](#系统架构)
- [核心功能](#核心功能)
- [Agent详解](#agent详解)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [部署指南](#部署指南)

---

## 🏗️ 系统架构

```
┌────────────────────────────────────────────┐
│         FlowGold AI Orchestrator           │
│   (统一调度中心 / 定时任务 / 报告汇总)      │
└──────────────┬─────────────────────────────┘
               │
               ▼
┌───────────────────────────────────────────┐
│ ① Market Intelligence Layer (市场调研层)  │
│ ├── Makerworld Trend Agent                │
│ ├── Competitor Watch Agent                │
│ ├── Cross Platform Agent                  │
│ └── Opportunity Rank Agent                │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌───────────────────────────────────────────┐
│ ② Product Ideation Layer (产品研发层)     │
│ ├── Product Brief Agent                   │
│ ├── Design Spec Agent                     │
│ ├── Cost Estimator Agent                  │
│ ├── Print Scheduler Agent                 │
│ └── QC Analyzer Agent                     │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌───────────────────────────────────────────┐
│ ③ Supply & Inventory Layer (供应链层)     │
│ ├── Inventory Monitor Agent               │
│ └── Supplier Insight Agent                │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌───────────────────────────────────────────┐
│ ④ Marketing & Ads Layer (营销广告层)      │
│ ├── Listing Builder Agent                 │
│ ├── Ads Data Agent                        │
│ ├── Ads Optimizer Agent                   │
│ └── Pricing Monitor Agent                 │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌───────────────────────────────────────────┐
│ ⑤ Customer & Review Layer (客户服务层)    │
│ ├── Review Insight Agent                  │
│ └── CS Reply Agent                        │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌───────────────────────────────────────────┐
│ ⑥ Analytics & Report Layer (分析报告层)   │
│ ├── Data Warehouse Agent                  │
│ └── Weekly Report Agent                   │
└───────────────────────────────────────────┘
```

---

## 🎯 核心功能

### 1. 市场调研层
- 📊 **Makerworld趋势分析**: 爬取热门3D设计，识别高潜力产品机会
- 🔍 **竞品监控**: 追踪竞品价格、库存、评论、广告策略
- 🌐 **跨平台趋势**: 整合Pinterest、TikTok、Etsy等多平台数据
- 🏆 **机会排序**: 综合评估并排序产品开发优先级

### 2. 产品研发层
- 📝 **产品简报生成**: AI自动生成详细的产品开发文档
- 🎨 **设计规格**: 3D打印参数、材料、BOM清单
- 💰 **成本估算**: 精确计算COGS、利润率、定价策略
- 🖨️ **生产调度**: 优化3D打印机资源分配
- ✅ **质量检测**: AI视觉识别打印缺陷

### 3. 供应链层
- 📦 **库存监控**: 实时追踪FBA库存，预测断货风险
- 🏭 **供应商管理**: 评估供应商表现，优化采购策略

### 4. 营销广告层
- ✍️ **Listing优化**: AI生成标题、五点描述、关键词
- 📈 **广告数据分析**: 监控PPC表现，识别高价值关键词
- 🤖 **广告自动优化**: 自动调整竞价、添加/暂停关键词
- 💵 **动态定价**: 基于竞争和库存自动调价

### 5. 客户服务层
- ⭐ **评论洞察**: AI分析评论，提取痛点和改进机会
- 💬 **客服自动回复**: AI生成Q&A和客户消息回复

### 6. 分析报告层
- 🗄️ **数据仓库**: 整合所有数据，支持BI分析
- 📊 **周报生成**: AI生成包含洞察和建议的业务报告

---

## 📚 Agent 详解

### 市场调研层 (Market Intelligence)

#### 1. Makerworld Trend Agent
监控Makerworld平台的设计趋势，识别高潜力产品。
- **输出**: `makerworld_trends.csv`
- **关键指标**: 趋势分数、下载量、亚马逊机会等级

#### 2. Competitor Watch Agent
监控竞品动态，包括价格、评论、库存。
- **输出**: `competitor_snapshot.csv`
- **关键指标**: 价格变化、BSR、库存状态

#### 3. Cross Platform Agent
跨平台趋势分析，整合多平台数据。
- **输出**: `cross_platform_trends.csv`
- **关键指标**: 病毒性分数、平台覆盖度

#### 4. Opportunity Rank Agent
综合评估并排序产品机会。
- **输出**: `opportunity_rank.csv`, `opportunity_details.json`
- **关键指标**: 机会分数(0-100)、需求分数、竞争分数

---

### 产品研发层 (Product Ideation)

#### 5. Product Brief Agent
生成详细的产品开发简报。
- **输出**: `product_brief.pdf`, `product_brief_data.json`
- **使用AI**: Claude/GPT生成产品定义和商业计划

#### 6. Design Spec Agent
生成3D设计规格和打印参数。
- **输出**: `design_spec.json`, `design_spec_visual.pdf`
- **使用AI**: DALL-E生成设计概念图

#### 7. Cost Estimator Agent
精确计算产品成本和利润。
- **输出**: `cost_report.csv`, `cost_analysis.json`
- **关键指标**: COGS、利润率、ROI

#### 8. Print Scheduler Agent
优化3D打印生产计划。
- **输出**: `schedule.csv`, `production_plan.json`
- **算法**: Bin Packing优化打印机分配

#### 9. QC Analyzer Agent
AI视觉质量检测。
- **输出**: `qc_report.csv`, `defect_analysis.json`
- **使用AI**: YOLOv8或GPT-4 Vision识别缺陷

---

### 供应链层 (Supply & Inventory)

#### 10. Inventory Monitor Agent
监控库存，预测补货需求。
- **输出**: `inventory_status.csv`, `reorder_plan.json`
- **算法**: 安全库存、再订货点(ROP)、EOQ

#### 11. Supplier Insight Agent
评估供应商表现，优化采购。
- **输出**: `supplier_scorecard.csv`, `supplier_analysis.json`
- **关键指标**: 准时率、质量合格率、价格竞争力

---

### 营销广告层 (Marketing & Ads)

#### 12. Listing Builder Agent
AI生成Amazon Listing。
- **输出**: `listing_content.json`
- **使用AI**: Claude生成标题、五点描述、关键词

#### 13. Ads Data Agent
采集和分析广告数据。
- **输出**: `ads_performance.csv`, `ads_insights.json`
- **关键指标**: ACOS, ROAS, CTR, CVR

#### 14. Ads Optimizer Agent
自动优化广告活动。
- **输出**: `optimization_actions.json`
- **功能**: 调整竞价、添加关键词、预算优化

#### 15. Pricing Monitor Agent
动态定价和Buy Box优化。
- **输出**: `pricing_analysis.json`
- **策略**: 竞争定价、库存定价、价格弹性

---

### 客户服务层 (Customer & Review)

#### 16. Review Insight Agent
分析评论，提取客户洞察。
- **输出**: `review_insights.json`
- **使用AI**: Claude分析评论主题和情感

#### 17. CS Reply Agent
AI生成客服回复。
- **输出**: `cs_responses.json`
- **使用AI**: Claude生成Q&A和消息回复

---

### 分析报告层 (Analytics & Report)

#### 18. Data Warehouse Agent
构建数据仓库。
- **技术**: PostgreSQL/BigQuery星型模式
- **功能**: ETL、数据质量检查、BI集成

#### 19. Weekly Report Agent
生成周度业务报告。
- **输出**: `weekly_report.md`, `weekly_report.pdf`
- **使用AI**: Claude生成洞察和建议

---

## 🛠️ 技术栈

### AI & 机器学习
- **OpenRouter** - 统一AI API
- **Claude 3 Sonnet** - 文本生成、分析
- **GPT-4** - 内容创作
- **DALL-E 3** - 设计概念图
- **YOLOv8** - 质量检测

### 数据处理
- **Python 3.9+**
- **pandas** - 数据处理
- **NumPy** - 数值计算
- **scikit-learn** - 机器学习

### 数据仓库
- **PostgreSQL** - 关系型数据库
- **BigQuery** - 云数据仓库(可选)
- **dbt** - 数据转换
- **Apache Airflow** - 工作流编排

### API集成
- **Amazon SP-API** - 销售、库存数据
- **Amazon Advertising API** - 广告数据
- **Helium 10 API** - 关键词研究(可选)

### BI & 可视化
- **Metabase** - 开源BI工具
- **matplotlib/plotly** - 图表生成
- **ReportLab** - PDF生成

---

## 🚀 快速开始

### 前置要求
- Python 3.9+
- PostgreSQL 13+
- Amazon Seller Central账户
- Amazon Advertising账户
- OpenRouter API密钥

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/flowgold-amazon-ai.git
cd flowgold-amazon-ai

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 添加API密钥
```

### 配置

编辑 `config.yml`:

```yaml
api_keys:
  openrouter:
    key: "sk-or-v1-your-api-key"
  amazon_sp_api:
    refresh_token: "your-token"
    client_id: "your-client-id"
    client_secret: "your-secret"
  amazon_ads_api:
    client_id: "your-ads-client-id"
    client_secret: "your-ads-secret"

database:
  host: "localhost"
  port: 5432
  database: "flowgold_dw"
  user: "postgres"
  password: "your-password"
```

### 运行

```bash
# 运行单个Agent
python market/makerworld_trend_agent.py

# 运行完整系统
python orchestrator.py

# 查看帮助
python orchestrator.py --help
```

---

## 📖 文档

详细文档请查看各Agent的Markdown文件：

- [市场调研层](./market/)
- [产品研发层](./product/)
- [供应链层](./supply/)
- [营销广告层](./marketing/)
- [客户服务层](./customer/)
- [分析报告层](./analytics/)

---

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

## ⚠️ 免责声明

本系统仅供学习和研究使用。使用时请遵守：
- Amazon服务条款
- 各平台的使用政策
- 数据隐私法规(GDPR, CCPA等)
- API使用限制

---

## 📧 联系方式

- 项目维护者: [Your Name]
- Email: your.email@example.com
- Issues: [GitHub Issues](https://github.com/yourusername/flowgold-amazon-ai/issues)

---

**Built with ❤️ using Claude AI**
