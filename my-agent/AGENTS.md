# AI Agents 总览与索引

## 系统架构

本 AI Agent 系统采用四层架构设计,从战略规划到技术支撑,覆盖完整的工作流程。

```
┌─────────────────────────────────────────┐
│         Main Agent (主控中枢)            │
│         智能任务调度和协调                │
└────────────┬────────────────────────────┘
             │
    ┌────────┼────────┬─────────┐
    ↓        ↓        ↓         ↓
┌─────┐ ┌─────┐ ┌─────┐ ┌─────────┐
│战略层│ │执行层│ │运营层│ │ 支撑层  │
└─────┘ └─────┘ └─────┘ └─────────┘
```

---

## 🎯 Strategic Layer (战略层)

**定位**: 思考、规划、分析阶段

### 1. Research Assistant (研究助理)
📄 文件: `agents/strategic/research_assistant.md`

**核心职责**:
- 信息收集和文献综述
- 市场调研和竞品分析
- 数据收集和来源评估
- 研究报告生成

**适用场景**:
- 技术调研和选型
- 市场分析
- 学术研究
- 行业趋势分析

---

### 2. Brainstorm Assistant (头脑风暴助理)
📄 文件: `agents/strategic/brainstorm_assistant.md`

**核心职责**:
- 创意产生和问题解决
- SCAMPER、思维导图等创意技巧
- 多角度思考和方案构思
- SWOT 分析

**适用场景**:
- 产品创意阶段
- 营销活动策划
- 问题解决方案
- 创新思维训练

---

### 3. Data Assistant (数据分析助理)
📄 文件: `agents/strategic/data_assistant.md`

**核心职责**:
- 通过 MCP 读取数据库或 CSV
- 销售趋势、报表、ROI 分析
- 自动生成图表和数据可视化
- 数据驱动的结论和建议

**适用场景**:
- 亚马逊业务分析
- 市场调研数据汇总
- 运营数据分析
- 财务报表生成

**特色功能**:
- 支持多种数据源 (PostgreSQL, MySQL, CSV, Excel)
- AARRR 模型、RFM 分析等专业方法
- 自动化周报/月报生成

---

### 4. Product Assistant (产品设计助理)
📄 文件: `agents/strategic/product_assistant.md`

**核心职责**:
- 把模糊想法转成产品文档 (PRD)
- 分析用户痛点与价值主张
- 输出界面草图 (调用 v0.dev 或 Claude Artifacts)

**适用场景**:
- 当你想做什么新产品时 (如 BOM 工具、AI 报告系统)
- 需求分析和产品定义
- 快速原型验证

**工作流**:
```
想法 → 需求分析 → PRD 编写 → 原型设计 → 用户验证
```

---

## ⚡ Execution Layer (执行层)

**定位**: 实施、开发、创作阶段

### 5. Coding Assistant (编程助理)
📄 文件: `agents/execution/coding_assistant.md`

**核心职责**:
- 代码生成和补全
- 调试和问题排查
- 代码审查和优化
- 文档生成

**支持语言**:
JavaScript/TypeScript, Python, Java, C#, C++, Go, Rust, PHP, Ruby

**适用场景**:
- 功能开发
- Bug 修复
- 代码重构
- 算法实现

---

### 6. Writing Assistant (写作助理)
📄 文件: `agents/execution/writing_assistant.md`

**核心职责**:
- 技术文档编写
- 博客文章和内容创作
- 文字润色和语法检查
- 多种写作风格支持

**写作类型**:
- 技术文档 (API 文档、用户手册)
- 业务文档 (报告、提案)
- 创意写作 (博客、文章)

**适用场景**:
- 项目文档编写
- 技术博客创作
- 对外宣传材料

---

### 7. Designer Assistant (系统架构助理)
📄 文件: `agents/execution/designer_assistant.md`

**核心职责**:
- 规划新项目技术栈、目录结构、API 设计
- 评估性能瓶颈,生成技术文档

**适用场景**:
- 当你做新系统时 (如 aluminum-bom-generator)
- 帮你画出最优结构
- 技术方案评审

**输出物**:
- 架构设计文档
- 数据库 schema 设计
- API 接口规范
- 性能优化方案

---

### 8. Automation Assistant (自动化助理)
📄 文件: `agents/execution/automation_assistant.md`

**核心职责**:
- 识别重复性任务并自动化
- 编写自动化脚本 (Shell, Python, JavaScript)
- CI/CD 流程设计和实施
- 工作流自动化

**适用场景**:
- Git 操作自动化
- 代码构建和部署
- 数据处理自动化
- 定时任务调度

**工具**:
GitHub Actions, cron, Husky, lint-staged

---

## 📊 Operation Layer (运营层)

**定位**: 管理、追踪、沉淀阶段

### 9. Project Assistant (项目管理助理)
📄 文件: `agents/operation/project_assistant.md`

**核心职责**:
- 项目规划和时间表
- 进度跟踪和风险管理
- 团队协作和会议管理
- 敏捷实践 (Scrum, Kanban)

**适用场景**:
- 新项目启动
- 跨团队协作
- 敏捷开发管理

**产出物**:
- 项目计划和甘特图
- Sprint 任务看板
- 项目周报
- 风险登记册

---

### 10. Reflection Assistant (复盘助理)
📄 文件: `agents/operation/reflection_assistant.md`

**核心职责**:
- 汇总当天任务与知识点
- 输出个人学习日志、优化建议
- 生成周总结报告

**适用场景**:
- 把你的 AI 日常工作自动转成「知识库 + 复盘报告」
- 个人成长追踪
- 技能树建立
- 面试/晋升材料准备

**复盘方法**:
PDCA 循环, 5W2H 分析, STAR 原则

---

### 11. Knowledge Assistant (知识管理助理)
📄 文件: `agents/operation/knowledge_assistant.md`

**核心职责**:
- 知识收集、整理、分类
- 知识库建设和维护
- 知识检索和推荐
- 团队知识分享

**适用场景**:
- 团队知识沉淀
- 技术文档管理
- 新人培训材料
- 最佳实践库

**知识分类**:
- 技术文档
- 最佳实践
- 问题解决 (FAQ)
- 学习资源

---

## 🔧 Support Layer (支撑层)

**定位**: 集成、监控、运维支撑

### 12. MCP Integrator (MCP 集成助理)
📄 文件: `agents/support/mcp_integrator.md`

**核心职责**:
- MCP 服务配置和管理
- 数据源集成 (数据库、文件、API、云服务)
- 数据转换和处理
- 集成监控和故障处理

**支持的数据源**:
- 数据库: PostgreSQL, MySQL, MongoDB, Redis
- 文件系统: 本地文件、云存储
- API 服务: REST API, GraphQL
- 云服务: AWS S3, Azure Blob, GCP Storage

**适用场景**:
- 需要访问外部数据
- 多系统数据整合
- 自动化数据同步

---

### 13. Database Assistant (数据库助理)
📄 文件: `agents/support/database_assistant.md`

**核心职责**:
- 数据库设计 (ER 模型、表结构)
- 性能优化 (查询优化、索引策略)
- 数据管理 (迁移、备份、清洗)
- 监控运维 (性能监控、故障诊断)

**适用场景**:
- 数据库设计和建模
- 查询性能优化
- 数据迁移和备份
- 容量规划

---

### 14. Deployment Assistant (部署助理)
📄 文件: `agents/support/deployment_assistant.md`

**核心职责**:
- 部署流程和脚本
- CI/CD 配置 (GitHub Actions)
- 容器化 (Docker, Kubernetes)
- 云平台管理 (Vercel, AWS, Azure)

**适用场景**:
- 应用部署和发布
- 环境配置管理
- 自动化部署流程
- 云资源管理

**部署平台**:
Vercel, Netlify, AWS, Azure, GCP, Railway

---

### 15. Monitor Assistant (监控助理)
📄 文件: `agents/support/monitor_assistant.md`

**核心职责**:
- 性能监控 (APM, 基础设施监控)
- 日志管理 (收集、分析、告警)
- 告警管理 (规则配置、通知)
- 可观测性 (分布式追踪、指标收集)

**适用场景**:
- 系统健康监控
- 故障快速定位
- 性能问题分析
- SLA 保障

**监控工具**:
Sentry, Prometheus, Grafana, ELK Stack, Datadog

---

## 🧠 Main Agent (主控中枢)

📄 文件: `main_agent.md`

**核心职责**:
- 理解用户需求,分析任务类型
- 选择合适的专业助理
- 协调多助理协作
- 质量把控和结果整合

**调度策略**:
- 单助理模式: 简单任务
- 顺序协作模式: 有依赖关系的任务
- 并行协作模式: 独立任务并行执行
- 迭代优化模式: 需要反复优化的任务

**典型工作流**:

### 新产品开发全流程
```
product_assistant → designer_assistant → coding_assistant
     ↓                    ↓                    ↓
   PRD 文档          技术架构              代码实现
                          ↓
              database_assistant → deployment_assistant
                   ↓                        ↓
               数据库设计                  应用部署
```

### 数据分析报告
```
mcp_integrator → data_assistant → writing_assistant
      ↓                ↓                  ↓
  读取数据          数据分析          生成报告
```

### 性能优化
```
monitor_assistant → database_assistant → coding_assistant
       ↓                   ↓                    ↓
   识别瓶颈           优化数据库            代码优化
```

---

## 快速导航

### 按使用场景选择

| 场景 | 推荐助理 |
|------|---------|
| **想做新产品** | product_assistant → designer_assistant → coding_assistant |
| **数据分析** | mcp_integrator + data_assistant |
| **写技术文档** | writing_assistant |
| **系统设计** | designer_assistant + database_assistant |
| **性能优化** | monitor_assistant + database_assistant |
| **自动化流程** | automation_assistant |
| **项目管理** | project_assistant |
| **工作复盘** | reflection_assistant |
| **知识沉淀** | knowledge_assistant |
| **应用部署** | deployment_assistant |

### 按工作流阶段选择

| 阶段 | 层级 | 助理 |
|------|------|------|
| **调研规划** | Strategic | research_assistant, brainstorm_assistant |
| **产品设计** | Strategic | product_assistant, data_assistant |
| **技术设计** | Execution | designer_assistant, database_assistant |
| **开发实施** | Execution | coding_assistant, automation_assistant |
| **文档编写** | Execution | writing_assistant, knowledge_assistant |
| **测试部署** | Support | deployment_assistant, monitor_assistant |
| **项目管理** | Operation | project_assistant |
| **总结沉淀** | Operation | reflection_assistant, knowledge_assistant |

---

## 助理协作示例

### 示例 1: 从 0 到 1 开发产品

```
1. [Strategic] brainstorm_assistant
   → 产品创意和方向讨论

2. [Strategic] research_assistant
   → 市场调研和竞品分析

3. [Strategic] product_assistant
   → 编写 PRD,定义需求

4. [Execution] designer_assistant
   → 技术架构设计

5. [Support] database_assistant
   → 数据库设计

6. [Execution] coding_assistant
   → 功能开发

7. [Execution] automation_assistant
   → CI/CD 配置

8. [Support] deployment_assistant
   → 部署上线

9. [Support] monitor_assistant
   → 监控配置

10. [Operation] knowledge_assistant
    → 文档沉淀

11. [Operation] reflection_assistant
    → 项目复盘
```

### 示例 2: 日常开发工作

```
早晨:
[Operation] project_assistant → 查看今日任务

开发:
[Execution] coding_assistant → 功能开发
[Support] database_assistant → 数据库查询优化

下午:
[Execution] writing_assistant → 更新文档
[Execution] automation_assistant → 编写测试脚本

晚上:
[Operation] reflection_assistant → 工作总结
[Operation] knowledge_assistant → 知识沉淀
```

---

## 版本历史

- **v2.0** (2024-10-25): 重构为四层架构,新增多个专业助理
- **v1.0** (2024-10-01): 初始版本,包含基础 4 个助理

---

## 贡献指南

欢迎贡献新的专业助理或改进现有助理!

**添加新助理的步骤**:
1. 确定助理所属层级 (Strategic/Execution/Operation/Support)
2. 在对应目录创建 markdown 文件
3. 使用统一的文档模板
4. 更新本索引文件
5. 提交 PR

**文档模板**:
```markdown
# [助理名称]

## 概述
## 核心职责
## 适用场景
## 主要功能
## 使用示例
## 最佳实践
## 与其他助理的配合
```

---

## 🏠 Personal Folder (个人生活助理)

**定位**: 个人生活管理和成长

除了工作相关的助理,我们还提供了专门的个人生活助理,帮助你管理和优化个人生活的方方面面。

### 16. Reflection Assistant (反思助理)
📄 文件: `personal/reflection_assistant.md`

**核心职责**:
- 记录每天的想法、情绪、成果
- 总结经验,提炼方法
- 日志、周复盘、情绪分析

**适用场景**:
- "帮我复盘今天的忙碌情况"
- 每日工作生活总结
- 情绪追踪和管理
- 个人成长记录

**特色功能**:
- 每日反思模板
- 周度复盘框架
- 情绪追踪日志
- GROW 模型、5个为什么、感恩练习

---

### 17. Thinking Assistant (思考助理)
📄 文件: `personal/thinking_assistant.md`

**核心职责**:
- 讨论哲学/商业/趋势话题
- 激发灵感,提供多角度思考
- 思维导图、结构梳理

**适用场景**:
- "和我聊聊 AI 产品的未来趋势"
- 人生困惑和重大选择
- 商业创意验证
- 深度思考人生问题

**思维框架**:
- 第一性原理
- 逆向思维
- 系统思考
- 苏格拉底式提问

---

### 18. Goal Planner (目标规划助理)
📄 文件: `personal/goal_planner.md`

**核心职责**:
- 拆解长期目标,制定路线图
- 追踪进度,调整计划
- 目标规划、阶段计划表

**适用场景**:
- "我想一年内实现财务自由,帮我规划路径和目标"
- 设定年度/季度目标
- 职业发展规划
- 技能学习路线

**方法论**:
- SMART 目标设定
- OKR 框架
- Gantt Chart 路线图
- 月度/季度目标追踪

---

### 19. Life Concierge (生活助理)
📄 文件: `personal/life_concierge.md`

**核心职责**:
- 旅行、餐饮、娱乐、待办事项规划
- 推荐清单、行程计划

**适用场景**:
- "推荐我周末去玩做点什么放松一下"
- 规划周末出游
- 寻找餐厅和美食
- 管理日常待办
- 建立生活routines

**特色功能**:
- 旅行攻略和行程规划
- 餐厅推荐和美食探索
- 每日/每周待办管理
- 晨间/晚间routine建议

---

## 工作 vs 生活助理对比

| 维度 | 工作助理 (agents/) | 个人助理 (personal/) |
|------|-------------------|---------------------|
| 定位 | 职业发展和团队协作 | 个人成长和生活管理 |
| 反思 | operation/reflection_assistant<br/>(工作复盘,技能沉淀) | personal/reflection_assistant<br/>(个人反思,情绪管理) |
| 规划 | operation/project_assistant<br/>(项目管理,团队协作) | personal/goal_planner<br/>(个人目标,人生规划) |
| 知识 | operation/knowledge_assistant<br/>(技术文档,团队知识) | personal/thinking_assistant<br/>(哲学思考,商业洞察) |
| 执行 | execution/*<br/>(编程,写作,架构) | personal/life_concierge<br/>(生活管理,休闲娱乐) |

**使用建议**:
- **工作时间**: 使用 agents/ 下的工作助理
- **下班后**: 使用 personal/ 下的个人助理
- **周末/假期**: 重点使用 personal/ 助理
- **年度规划**: 两者结合,全面规划工作和生活

---

## 完整助理列表

### 工作助理 (15个)
**Strategic**: research, brainstorm, data, product
**Execution**: coding, writing, designer, automation
**Operation**: project, reflection, knowledge
**Support**: mcp_integrator, database, deployment, monitor

### 个人助理 (4个)
**Personal**: reflection, thinking, goal_planner, life_concierge

### 投资助理 (5个)
**Investment**: portfolio_aggregator, research, macro_risk, rebalancer, performance_review

**总计**: 24 个专业助理 + 1 个主控中枢 = 25 个 AI Agent

---

## 💰 Investment Folder (投资理财助理)

**定位**: 投资组合管理和财务规划

专门为投资理财打造的助理系统,帮助你系统化管理投资组合,从资产汇总、研究分析、风险管理到绩效复盘,实现科学化投资决策。

### 20. Portfolio Aggregator (资产汇总助理)
📄 文件: `investment/portfolio_aggregator.md`

**核心职责**:
- 多账户汇总 (证券、基金、银行等)
- 净值曲线追踪
- 资产分布分析
- 持仓明细统计

**适用场景**:
- "帮我汇总所有账户的持仓情况"
- 查看整体投资组合
- 资产配置分析
- 收益率统计

**特色功能**:
- 多账户整合视图
- 资产类别分布图
- 行业/地区配置分析
- 净值曲线可视化

---

### 21. Research Assistant (投研助理)
📄 文件: `investment/research_assistant.md`

**核心职责**:
- 公司研究报告 (个股分析)
- 行业分析框架
- 估值模型 (PE/PB/DCF/相对估值)
- 投资决策评分

**适用场景**:
- "帮我研究贵州茅台是否值得买"
- 深度研究目标公司
- 行业趋势分析
- 估值合理性判断

**分析框架**:
- 护城河分析 (Moat Analysis)
- 财务三表分析
- SWOT 分析
- 多种估值模型

---

### 22. Macro & Risk (宏观与风控助理)
📄 文件: `investment/macro_risk.md`

**核心职责**:
- 宏观经济指标追踪
- 相关性分析、回撤监控
- 风险暴露识别
- 对冲策略建议

**适用场景**:
- "当前宏观环境如何,有什么风险?"
- 监控组合风险指标
- 资产相关性分析
- 设计对冲方案

**监控指标**:
- GDP、CPI、PMI、利率等宏观指标
- 波动率、最大回撤、VaR
- 资产相关性矩阵
- Beta、夏普比率

---

### 23. Rebalancer (再平衡助理)
📄 文件: `investment/rebalancer.md`

**核心职责**:
- 计算目标仓位偏差
- 生成再平衡方案
- 买卖建议和执行计划
- 调仓历史记录

**适用场景**:
- "我的配置偏离目标了,帮我再平衡"
- 季度/半年度调仓
- 资产配置优化
- 纪律化投资执行

**功能特点**:
- 目标配置 vs 实际配置对比
- 触发阈值设定 (如 ±5%)
- 详细买卖清单
- 成本估算和执行计划

---

### 24. Performance & Review (绩效与复盘助理)
📄 文件: `investment/performance_review.md`

**核心职责**:
- 月度/季度/年度绩效报告
- 收益归因分析
- 投资决策回溯
- 因子分析

**适用场景**:
- "帮我复盘Q3的投资表现"
- 定期绩效评估
- 分析收益来源
- 总结投资经验教训

**分析维度**:
- 绝对收益 vs 相对收益
- 资产/行业/个股贡献度
- 正确决策 vs 错误决策
- 风险调整后收益 (夏普比率)

---

## 投资助理协作流程

### 日常投资工作流
```
1. Portfolio Aggregator → 查看当前持仓和配置
2. Macro & Risk → 分析宏观环境和风险
3. Research → 研究潜在投资标的
4. Rebalancer → 执行调仓计划
5. Performance & Review → 定期复盘总结
```

### 新标的研究流程
```
Research Assistant → 深度研究
    ↓
Macro & Risk → 评估风险
    ↓
Portfolio Aggregator → 计算合适仓位
    ↓
Rebalancer → 生成买入计划
```

### 季度复盘流程
```
Performance & Review → 绩效分析
    ↓
Macro & Risk → 风险评估
    ↓
Rebalancer → 生成再平衡方案
    ↓
Portfolio Aggregator → 验证调整后配置
```

---

## 工作 vs 个人 vs 投资助理对比

| 维度 | 工作助理 (agents/) | 个人助理 (personal/) | 投资助理 (investment/) |
|------|-------------------|---------------------|----------------------|
| 定位 | 职业发展和团队协作 | 个人成长和生活管理 | 投资理财和财富管理 |
| 数据 | 代码、文档、项目 | 日记、目标、情绪 | 持仓、行情、财报 |
| 分析 | data_assistant<br/>(业务数据分析) | thinking_assistant<br/>(哲学思考) | research_assistant<br/>(投资研究) |
| 规划 | project_assistant<br/>(项目管理) | goal_planner<br/>(人生规划) | rebalancer<br/>(资产配置) |
| 复盘 | reflection_assistant<br/>(工作总结) | reflection_assistant<br/>(个人反思) | performance_review<br/>(投资复盘) |
| 风控 | monitor_assistant<br/>(系统监控) | - | macro_risk<br/>(风险管理) |

**使用建议**:
- **工作日**: 主要使用 agents/ 工作助理
- **下班后**: 使用 personal/ 个人助理
- **投资决策**: 使用 investment/ 投资助理
- **全面规划**: 三者结合,实现事业、生活、财富的平衡发展

---

## 相关资源

- [Main Agent 主控中枢详解](main_agent.md)
- [项目 README](README.md)
- [Personal 个人助理文件夹](personal/)
- [Investment 投资助理文件夹](investment/)
- [贡献指南](CONTRIBUTING.md)
