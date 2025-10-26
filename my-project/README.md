# AI Agent 智能助理系统

一个专业的 AI Agent 系统,采用四层架构设计,涵盖从战略规划到技术执行的完整工作流程。

## 🌟 系统特点

- **🧠 智能调度**: 主控中枢自动识别需求,选择合适助理
- **🎯 专业分工**: 24+ 专业助理,各司其职
- **⚡ 高效协作**: 支持多助理并行和顺序协作
- **📊 全流程覆盖**: 工作+生活+投资,从想法到执行的完整支持
- **🏠 工作生活平衡**: 分离工作、个人和投资助理,专注当下
- **💰 财富管理**: 专业投资助理系统,科学化投资决策

## 📁 项目结构

```
my-agent/
├── AGENTS.md                 ← 📚 总览表 / 索引 (详细介绍每个助理)
├── README.md                 ← 📖 项目说明 (本文件)
├── main_agent.md             ← 🧠 总控中枢 (调度逻辑)
├── agents/                   ← 💼 工作助理
│   ├── strategic/            ← 🎯 战略层 (思考、规划、分析)
│   │   ├── research_assistant.md       # 研究助理
│   │   ├── brainstorm_assistant.md     # 头脑风暴助理
│   │   ├── data_assistant.md           # 数据分析助理
│   │   └── product_assistant.md        # 产品设计助理
│   │
│   ├── execution/            ← ⚡ 执行层 (实施、开发、创作)
│   │   ├── coding_assistant.md         # 编程助理
│   │   ├── writing_assistant.md        # 写作助理
│   │   ├── designer_assistant.md       # 系统架构助理
│   │   └── automation_assistant.md     # 自动化助理
│   │
│   ├── operation/            ← 📊 运营层 (管理、追踪、沉淀)
│   │   ├── project_assistant.md        # 项目管理助理
│   │   ├── reflection_assistant.md     # 复盘助理
│   │   └── knowledge_assistant.md      # 知识管理助理
│   │
│   └── support/              ← 🔧 支撑层 (集成、监控、运维)
│       ├── mcp_integrator.md           # MCP 集成助理
│       ├── database_assistant.md       # 数据库助理
│       ├── deployment_assistant.md     # 部署助理
│       └── monitor_assistant.md        # 监控助理
│
├── personal/                 ← 🏠 个人生活助理
│   ├── reflection_assistant.md     # 反思助理
│   ├── thinking_assistant.md       # 思考助理
│   ├── goal_planner.md             # 目标规划助理
│   └── life_concierge.md           # 生活助理
│
└── investment/               ← 💰 投资理财助理
    ├── portfolio_aggregator.md     # 资产汇总助理
    ├── research_assistant.md       # 投研助理
    ├── macro_risk.md               # 宏观与风控助理
    ├── rebalancer.md               # 再平衡助理
    └── performance_review.md       # 绩效与复盘助理
```

## 🎯 四层架构

### 1. Strategic Layer (战略层)
**定位**: 思考、规划、分析

- **研究助理** - 市场调研、技术调研、资料收集
- **头脑风暴助理** - 创意产生、问题解决
- **数据分析助理** - 数据分析、报表生成、趋势预测
- **产品设计助理** - PRD 编写、需求分析、原型设计

### 2. Execution Layer (执行层)
**定位**: 实施、开发、创作

- **编程助理** - 代码开发、调试、代码审查
- **写作助理** - 文档编写、内容创作
- **系统架构助理** - 技术架构设计、性能优化
- **自动化助理** - 脚本编写、CI/CD、流程自动化

### 3. Operation Layer (运营层)
**定位**: 管理、追踪、沉淀

- **项目管理助理** - 项目规划、进度跟踪、团队协作
- **复盘助理** - 工作总结、学习日志、经验沉淀
- **知识管理助理** - 知识组织、文档管理、知识分享

### 4. Support Layer (支撑层)
**定位**: 集成、监控、运维

- **MCP 集成助理** - 外部系统集成、数据源连接
- **数据库助理** - 数据库设计、查询优化
- **部署助理** - 应用部署、环境管理、CI/CD
- **监控助理** - 系统监控、日志分析、告警管理

---

## 🏠 Personal Folder (个人生活助理)

**定位**: 个人成长和生活管理

除了工作相关的助理,我们还提供了专门的个人生活助理:

- **反思助理** - 每日反思、情绪追踪、个人成长记录
- **思考助理** - 哲学思考、商业洞察、人生选择
- **目标规划助理** - SMART目标、OKR、年度规划
- **生活助理** - 旅行规划、美食推荐、日常待办

---

## 💰 Investment Folder (投资理财助理)

**定位**: 投资组合管理和财务规划

专门为投资理财打造的助理系统,帮助你系统化管理投资组合:

- **资产汇总助理** - 多账户汇总、净值曲线、资产分布分析
- **投研助理** - 公司研究、行业分析、估值模型、投资评分
- **宏观与风控助理** - 宏观经济监控、风险指标、对冲建议
- **再平衡助理** - 目标配置、再平衡方案、买卖建议
- **绩效与复盘助理** - 月度/季度/年度复盘、收益归因、决策回顾

**投资助理协作流程**:
```
Portfolio Aggregator (查看持仓)
    ↓
Macro & Risk (分析风险)
    ↓
Research (研究标的)
    ↓
Rebalancer (执行调仓)
    ↓
Performance & Review (定期复盘)
```

---

## 📊 三大领域助理对比

| 维度 | 工作助理 (agents/) | 个人助理 (personal/) | 投资助理 (investment/) |
|------|-------------------|---------------------|----------------------|
| **定位** | 职业发展和团队协作 | 个人成长和生活管理 | 投资理财和财富管理 |
| **使用时间** | 工作时间 | 下班后/周末 | 投资决策时 |
| **核心目标** | 提升工作效率 | 平衡工作生活 | 实现财富增长 |

**使用建议**:
- **工作日**: 使用 agents/ 下的工作助理
- **下班后**: 使用 personal/ 下的个人助理
- **投资决策**: 使用 investment/ 下的投资助理
- **全面规划**: 三者结合,实现事业、生活、财富的平衡发展

## 🚀 快速开始

### 查看助理详情
详细了解每个助理的功能和使用方法:
```bash
# 查看助理总览
cat AGENTS.md

# 查看主控中枢
cat main_agent.md

# 查看具体助理
cat agents/strategic/product_assistant.md
```

### 常见使用场景

#### 场景 1: 开发新产品
```
1. [Strategic] product_assistant
   → 编写 PRD,分析用户需求

2. [Execution] designer_assistant
   → 设计技术架构

3. [Execution] coding_assistant
   → 开发功能

4. [Support] deployment_assistant
   → 部署上线
```

#### 场景 2: 数据分析
```
1. [Support] mcp_integrator
   → 连接数据库/读取 CSV

2. [Strategic] data_assistant
   → 分析数据,生成图表

3. [Execution] writing_assistant
   → 生成分析报告
```

#### 场景 3: 日常工作复盘
```
1. [Operation] reflection_assistant
   → 总结当天工作,提取知识点

2. [Operation] knowledge_assistant
   → 沉淀到知识库

3. [Operation] project_assistant
   → 更新项目进度
```

## 📖 使用指南

### 按场景选择助理

| 你想做什么? | 使用哪个助理? | 领域 |
|------------|-------------|------|
| 想做新产品 | product_assistant | 💼 工作 |
| 需要调研 | research_assistant | 💼 工作 |
| 需要创意 | brainstorm_assistant | 💼 工作 |
| 分析数据 | data_assistant | 💼 工作 |
| 写代码 | coding_assistant | 💼 工作 |
| 设计系统 | designer_assistant | 💼 工作 |
| 写文档 | writing_assistant | 💼 工作 |
| 自动化任务 | automation_assistant | 💼 工作 |
| 管理项目 | project_assistant | 💼 工作 |
| 工作复盘 | reflection_assistant (operation) | 💼 工作 |
| 管理知识 | knowledge_assistant | 💼 工作 |
| 数据库操作 | database_assistant | 💼 工作 |
| 应用部署 | deployment_assistant | 💼 工作 |
| 系统监控 | monitor_assistant | 💼 工作 |
| 数据集成 | mcp_integrator | 💼 工作 |
| 个人反思 | reflection_assistant (personal) | 🏠 个人 |
| 思考人生 | thinking_assistant | 🏠 个人 |
| 目标规划 | goal_planner | 🏠 个人 |
| 生活管理 | life_concierge | 🏠 个人 |
| 查看持仓 | portfolio_aggregator | 💰 投资 |
| 研究股票 | research_assistant (investment) | 💰 投资 |
| 风险管理 | macro_risk | 💰 投资 |
| 投资调仓 | rebalancer | 💰 投资 |
| 投资复盘 | performance_review | 💰 投资 |

### 典型工作流

#### 从 0 到 1 开发产品
```
brainstorm_assistant (创意)
    ↓
research_assistant (调研)
    ↓
product_assistant (PRD)
    ↓
designer_assistant (架构)
    ↓
database_assistant (数据库)
    ↓
coding_assistant (开发)
    ↓
automation_assistant (CI/CD)
    ↓
deployment_assistant (部署)
    ↓
monitor_assistant (监控)
    ↓
knowledge_assistant (文档)
    ↓
reflection_assistant (复盘)
```

## 🎨 主控中枢

**main_agent.md** 是系统的大脑,负责:
- 🧠 理解用户需求
- 🎯 选择合适的助理
- 🔀 协调多助理协作
- ✅ 质量把控

它会根据你的需求自动选择和调度合适的助理,你无需手动选择。

## 💡 核心优势

### 1. 专业化分工
每个助理专注特定领域,提供专业级服务

### 2. 智能协作
主控中枢自动协调,多助理无缝配合

### 3. 全流程覆盖
从想法到上线,每个环节都有专业支持

### 4. 知识沉淀
自动总结和沉淀,形成知识资产

## 📚 文档导航

- **[AGENTS.md](AGENTS.md)** - 📚 完整的助理索引和详细介绍
- **[main_agent.md](main_agent.md)** - 🧠 主控中枢调度逻辑
- **agents/strategic/** - 🎯 战略层助理详细文档
- **agents/execution/** - ⚡ 执行层助理详细文档
- **agents/operation/** - 📊 运营层助理详细文档
- **agents/support/** - 🔧 支撑层助理详细文档

## 🔥 推荐阅读顺序

1. **README.md** (本文) - 了解系统整体
2. **AGENTS.md** - 浏览所有助理的能力
3. **main_agent.md** - 理解调度机制
4. **具体助理文档** - 深入了解感兴趣的助理

## 🌐 使用示例

### 示例 1: 新产品从想法到上线

**用户**: "我想做一个 BOM 管理工具"

**Main Agent 调度流程**:
1. brainstorm_assistant → 产品创意
2. research_assistant → 竞品分析
3. product_assistant → PRD 文档
4. designer_assistant → 技术架构
5. database_assistant → 数据库设计
6. coding_assistant → 功能开发
7. automation_assistant → CI/CD 配置
8. deployment_assistant → 部署上线
9. monitor_assistant → 监控配置
10. knowledge_assistant → 文档整理
11. reflection_assistant → 项目复盘

### 示例 2: 亚马逊数据分析

**用户**: "分析我的亚马逊销售数据"

**Main Agent 调度流程**:
1. mcp_integrator → 读取 CSV 数据
2. data_assistant → 数据分析,生成图表
3. writing_assistant → 撰写分析报告
4. knowledge_assistant → 保存分析方法

### 示例 3: 系统性能优化

**用户**: "API 响应慢,帮我优化"

**Main Agent 调度流程**:
1. monitor_assistant → 收集性能数据
2. database_assistant → 优化数据库查询
3. designer_assistant → 设计缓存策略
4. coding_assistant → 实现优化方案
5. automation_assistant → 添加性能测试
6. reflection_assistant → 记录优化过程

## 🛠️ 技术特性

### MCP 集成能力
- 支持数据库连接 (PostgreSQL, MySQL, MongoDB)
- 支持文件系统访问
- 支持 REST API 调用
- 支持云服务 (AWS S3, Azure, GCP)

### 自动化能力
- Git 工作流自动化
- CI/CD 流程配置
- 定时任务调度
- 批量数据处理

### 智能分析
- 数据趋势分析
- 性能瓶颈识别
- 代码质量分析
- 系统健康监控

## 📈 版本历史

- **v3.0** (2024-10-25) - 新增投资理财助理系统 (5个投资助理)
- **v2.0** (2024-10-25) - 重构为四层架构,新增个人助理 (4个)
- **v1.0** (2024-10-01) - 初始版本,基础 4 个助理

## 🤝 贡献

欢迎贡献新的助理或改进现有助理!

**贡献流程**:
1. 确定助理类型和所属层级
2. 在对应目录创建 markdown 文件
3. 遵循文档模板编写
4. 更新 AGENTS.md 索引
5. 提交 Pull Request

## 📝 许可证

MIT License

---

## 💬 联系方式

如有问题或建议,欢迎提 Issue 或 Pull Request。

---

**开始使用**: 查看 [AGENTS.md](AGENTS.md) 了解所有助理的详细功能!
