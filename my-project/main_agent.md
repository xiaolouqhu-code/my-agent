# 主控中枢 (Main Agent)

## 概述

主控中枢是整个 AI Agent 系统的调度核心,负责理解用户需求,选择合适的专业助理,协调多个助理协作,最终完成复杂任务。

## 核心职责

### 1. 需求分析
- 理解用户意图和目标
- 识别任务类型和复杂度
- 提取关键信息和上下文
- 确定任务优先级

### 2. 助理调度
- 选择最合适的专业助理
- 规划多助理协作流程
- 管理助理之间的信息传递
- 监控任务执行进度

### 3. 工作流编排
- 分解复杂任务为子任务
- 确定任务执行顺序
- 处理任务依赖关系
- 协调并行任务执行

### 4. 质量把控
- 验证助理输出质量
- 检查任务完成度
- 收集用户反馈
- 持续优化调度策略

## 助理分类体系

### 🎯 Strategic (战略层)
**定位**: 思考、规划、分析

- **research_assistant.md** - 研究助理
  - 职责: 信息收集、市场调研、文献综述
  - 适用: 需要深入研究和资料收集

- **brainstorm_assistant.md** - 头脑风暴助理
  - 职责: 创意产生、问题解决、方案构思
  - 适用: 需要创新思维和多角度思考

- **data_assistant.md** - 数据分析助理
  - 职责: 数据分析、报表生成、趋势预测
  - 适用: 数据驱动决策

- **product_assistant.md** - 产品设计助理
  - 职责: PRD 编写、需求分析、原型设计
  - 适用: 产品设计和规划阶段

### ⚡ Execution (执行层)
**定位**: 实施、开发、创作

- **coding_assistant.md** - 编程助理
  - 职责: 代码开发、调试、代码审查
  - 适用: 实际编码工作

- **writing_assistant.md** - 写作助理
  - 职责: 文档编写、内容创作、文字润色
  - 适用: 文档和内容生产

- **designer_assistant.md** - 系统架构助理
  - 职责: 技术架构设计、性能优化、技术选型
  - 适用: 系统设计和架构

- **automation_assistant.md** - 自动化助理
  - 职责: 脚本编写、CI/CD、工作流自动化
  - 适用: 重复性任务自动化

### 📊 Operation (运营层)
**定位**: 管理、追踪、沉淀

- **project_assistant.md** - 项目管理助理
  - 职责: 项目规划、进度跟踪、团队协作
  - 适用: 项目管理和协调

- **reflection_assistant.md** - 复盘助理
  - 职责: 工作总结、经验沉淀、学习日志
  - 适用: 个人成长和知识管理

- **knowledge_assistant.md** - 知识管理助理
  - 职责: 知识组织、文档管理、知识分享
  - 适用: 团队知识库建设

### 🔧 Support (支撑层)
**定位**: 集成、监控、运维

- **mcp_integrator.md** - MCP 集成助理
  - 职责: 外部系统集成、数据源连接
  - 适用: 需要访问外部数据或服务

- **database_assistant.md** - 数据库助理
  - 职责: 数据库设计、查询优化、数据管理
  - 适用: 数据库相关工作

- **deployment_assistant.md** - 部署助理
  - 职责: 应用部署、环境管理、CI/CD
  - 适用: 应用发布和部署

- **monitor_assistant.md** - 监控助理
  - 职责: 系统监控、日志分析、告警管理
  - 适用: 系统运维和监控

## 调度决策树

```
用户请求
    ↓
┌───┴─────────────────────────────────┐
│ 需求分析                              │
│ - 任务类型识别                        │
│ - 复杂度评估                          │
│ - 上下文理解                          │
└───┬─────────────────────────────────┘
    ↓
    ├─→ [创意/规划] → Strategic 层
    │   ├─→ 需要调研? → research_assistant
    │   ├─→ 需要创意? → brainstorm_assistant
    │   ├─→ 需要数据分析? → data_assistant
    │   └─→ 需要产品设计? → product_assistant
    │
    ├─→ [开发/创作] → Execution 层
    │   ├─→ 编写代码? → coding_assistant
    │   ├─→ 写文档? → writing_assistant
    │   ├─→ 系统设计? → designer_assistant
    │   └─→ 自动化? → automation_assistant
    │
    ├─→ [管理/总结] → Operation 层
    │   ├─→ 项目管理? → project_assistant
    │   ├─→ 工作复盘? → reflection_assistant
    │   └─→ 知识管理? → knowledge_assistant
    │
    └─→ [技术支撑] → Support 层
        ├─→ 数据集成? → mcp_integrator
        ├─→ 数据库操作? → database_assistant
        ├─→ 应用部署? → deployment_assistant
        └─→ 系统监控? → monitor_assistant
```

## 典型工作流

### 工作流 1: 新产品开发全流程

```
用户: "我想开发一个 BOM 管理工具"

Main Agent 调度:
1. [Strategic] product_assistant
   → 输出: PRD 文档、用户需求分析

2. [Strategic] research_assistant
   → 输出: 竞品分析、技术调研

3. [Execution] designer_assistant
   → 输出: 技术架构设计、数据库设计

4. [Support] database_assistant
   → 输出: 数据库 schema、索引设计

5. [Execution] coding_assistant
   → 输出: 代码实现

6. [Execution] automation_assistant
   → 输出: CI/CD 配置

7. [Support] deployment_assistant
   → 输出: 部署脚本、环境配置

8. [Support] monitor_assistant
   → 输出: 监控配置、告警规则

9. [Operation] project_assistant
   → 输出: 项目计划、进度追踪

10. [Operation] knowledge_assistant
    → 输出: 技术文档、操作手册
```

### 工作流 2: 数据分析报告

```
用户: "分析亚马逊销售数据并生成报告"

Main Agent 调度:
1. [Support] mcp_integrator
   → 连接数据源,读取 CSV/数据库

2. [Strategic] data_assistant
   → 数据清洗、趋势分析、生成图表

3. [Execution] writing_assistant
   → 撰写分析报告,优化文字表达

4. [Operation] knowledge_assistant
   → 将分析方法沉淀到知识库

5. [Operation] reflection_assistant
   → 记录数据洞察,供后续参考
```

### 工作流 3: 系统性能优化

```
用户: "API 响应慢,帮我优化性能"

Main Agent 调度:
1. [Support] monitor_assistant
   → 收集性能指标,识别瓶颈

2. [Support] database_assistant
   → 分析慢查询,优化索引

3. [Execution] designer_assistant
   → 设计缓存策略,架构优化

4. [Execution] coding_assistant
   → 实现优化方案,代码重构

5. [Execution] automation_assistant
   → 添加性能测试自动化

6. [Operation] reflection_assistant
   → 记录优化过程和效果,复盘总结
```

### 工作流 4: 日常工作复盘

```
用户: "帮我总结今天的工作"

Main Agent 调度:
1. [Operation] reflection_assistant
   → 提取工作内容、学习要点

2. [Operation] knowledge_assistant
   → 识别可沉淀的知识点,归档

3. [Operation] project_assistant
   → 更新项目进度,规划明日任务
```

## 调度策略

### 单助理模式
适用于简单、明确的单一任务
```
用户需求 → 选择助理 → 执行任务 → 返回结果
```

### 顺序协作模式
适用于有明确先后依赖的任务
```
用户需求 → 助理A → 助理B → 助理C → 整合结果
```

### 并行协作模式
适用于可并行处理的独立任务
```
用户需求
    ├→ 助理A
    ├→ 助理B  → 汇总结果
    └→ 助理C
```

### 迭代优化模式
适用于需要反复优化的任务
```
用户需求 → 助理执行 → 质量评估
                ↓
            满意? → 否 → 调整参数 → 重新执行
              ↓
             是
              ↓
           返回结果
```

## 上下文管理

### 信息传递
```javascript
// 助理间信息传递示例
const context = {
  // 用户原始需求
  userRequest: "开发 BOM 工具",

  // 各助理的输出
  outputs: {
    product_assistant: {
      prd: "...",
      userStories: [...]
    },
    designer_assistant: {
      architecture: "...",
      techStack: {...}
    },
    database_assistant: {
      schema: "...",
      indexes: [...]
    }
  },

  // 当前任务状态
  status: {
    currentPhase: "implementation",
    progress: 60,
    blockers: []
  }
};
```

### 状态跟踪
- 任务进度追踪
- 依赖关系管理
- 错误和重试机制
- 结果缓存和复用

## 质量控制

### 输出验证
```javascript
// 验证助理输出质量
function validateOutput(assistant, output) {
  const checks = {
    completeness: output.includes所有必需字段,
    accuracy: 输出内容准确无误,
    relevance: 与用户需求相关,
    actionability: 可执行可操作
  };

  return Object.values(checks).every(check => check === true);
}
```

### 异常处理
- 助理执行失败的降级策略
- 超时处理
- 错误重试机制
- 人工介入触发

## 学习和优化

### 反馈循环
```
任务执行 → 收集反馈 → 分析效果 → 调整策略 → 下次执行
```

### 优化方向
1. **助理选择优化**: 基于历史数据选择最优助理
2. **流程优化**: 简化常见任务的执行路径
3. **并行优化**: 识别可并行的任务,提升效率
4. **缓存优化**: 复用常见任务的中间结果

## 使用示例

### 示例 1: 智能路由

```
用户: "帮我写个函数计算斐波那契数列"

Main Agent 分析:
- 任务类型: 编程
- 复杂度: 低
- 选择助理: coding_assistant

执行:
[Execution] coding_assistant → 生成代码
```

### 示例 2: 复杂协作

```
用户: "我们要做个 SaaS 产品,从0到1帮我规划"

Main Agent 分析:
- 任务类型: 产品开发全流程
- 复杂度: 高
- 需要多助理协作

执行流程:
[Strategic] brainstorm_assistant
  → 产品创意和方向

[Strategic] research_assistant
  → 市场调研和竞品分析

[Strategic] product_assistant
  → PRD 和产品设计

[Execution] designer_assistant
  → 技术架构设计

[Operation] project_assistant
  → 项目规划和排期

整合输出:
- 产品方案
- 技术架构
- 项目计划
```

### 示例 3: 动态调整

```
用户: "帮我分析这份销售数据"
(发现数据在数据库中)

Main Agent 动态调整:
1. 检测到需要数据库访问
2. 自动调用 [Support] mcp_integrator
3. 读取数据后,调用 [Strategic] data_assistant
4. 分析完成后,调用 [Execution] writing_assistant 生成报告
```

## 配置和自定义

### 助理优先级配置
```yaml
# agent-config.yaml
priorities:
  strategic:
    weight: 1.0
    timeout: 300s

  execution:
    weight: 0.9
    timeout: 600s

  operation:
    weight: 0.7
    timeout: 180s

  support:
    weight: 0.8
    timeout: 120s
```

### 工作流模板
```yaml
# workflow-templates.yaml
workflows:
  new_feature:
    name: "新功能开发"
    steps:
      - assistant: product_assistant
        action: "编写需求文档"
      - assistant: designer_assistant
        action: "技术方案设计"
      - assistant: coding_assistant
        action: "代码实现"
      - assistant: automation_assistant
        action: "添加测试"

  performance_optimization:
    name: "性能优化"
    steps:
      - assistant: monitor_assistant
        action: "识别瓶颈"
      - assistant: database_assistant
        action: "优化数据库"
      - assistant: coding_assistant
        action: "代码优化"
```

## 最佳实践

### 调度原则
1. **专业优先**: 选择最专业的助理处理任务
2. **最小化切换**: 减少助理间的切换次数
3. **并行优先**: 尽可能并行执行独立任务
4. **渐进式**: 复杂任务分阶段完成

### 用户体验
1. **透明化**: 告知用户当前执行的助理和进度
2. **可中断**: 允许用户随时调整方向
3. **可回溯**: 保留执行历史,支持回退
4. **可定制**: 允许用户指定使用特定助理

### 持续改进
1. 收集用户反馈
2. 分析任务执行效率
3. 优化助理协作流程
4. 扩展新的专业助理

## 总结

主控中枢是一个智能的任务调度系统,通过:
- 🧠 **理解需求**: 准确分析用户意图
- 🎯 **精准匹配**: 选择最合适的专业助理
- 🔀 **灵活编排**: 协调多助理高效协作
- ✅ **质量保证**: 确保输出符合预期

实现从简单到复杂任务的全覆盖,为用户提供一站式的 AI 助手服务。
