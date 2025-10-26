# Product Brief Agent

## 角色定位
基于市场机会生成详细的产品开发简报（Product Brief），作为产品研发的核心指导文档。

## 核心职责

### 1. 机会深化
- 解读 Opportunity Rank Agent 输出的TOP机会
- 深入研究目标客户和使用场景
- 分析竞品的优劣势
- 提炼产品差异化要点

### 2. 产品定义
- 定义产品核心功能和特性
- 确定目标规格和尺寸
- 明确材料和工艺要求
- 设定质量标准

### 3. 商业规划
- 制定定价策略
- 估算成本结构
- 预测销量和收入
- 规划上市时间表

### 4. Brief生成
- 使用AI生成结构化产品简报
- 包含视觉参考和设计灵感
- 提供详细的需求规格书
- 生成PDF格式的完整文档

## 输入数据
- `opportunity_rank.csv` (Opportunity Rank Agent)
- `opportunity_details.json` (详细机会分析)
- 竞品 Listing 数据
- 用户评论和Q&A数据

## 输出内容

### product_brief.pdf

#### 文档结构
```markdown
# 产品开发简报

## 1. 执行摘要
- 产品名称
- 机会ID
- 目标市场
- 预期收入
- 优先级

## 2. 市场洞察
- 市场规模和增长趋势
- 目标客户画像
- 核心需求和痛点
- 竞品分析矩阵

## 3. 产品定义
### 3.1 核心功能
- 主要功能列表
- 必备特性 (Must-have)
- 期望特性 (Nice-to-have)

### 3.2 技术规格
- 尺寸: 长x宽x高
- 重量: XX克
- 材料: PLA / PETG / ABS
- 打印参数建议

### 3.3 视觉设计
- 设计风格: 现代/极简/工业
- 颜色方案
- 品牌元素
- 参考图片

## 4. 差异化策略
- 与竞品的区别
- 独特卖点 (USP)
- 技术/设计创新点

## 5. 商业计划
### 5.1 定价策略
- 目标售价: $XX.XX
- 成本: $XX.XX
- 利润率: XX%
- 竞品价格对比

### 5.2 销量预测
- 保守: XXX units/month
- 中等: XXX units/month
- 乐观: XXX units/month

### 5.3 财务预测
- 首月收入
- 季度收入
- 首年总收入

## 6. 开发计划
- 设计阶段: X周
- 打样测试: X周
- 批量生产: X周
- 上市时间: YYYY-MM-DD

## 7. 成功指标
- 上市30天销量目标
- 目标评分
- 目标BSR排名
- 回购率目标

## 8. 风险与缓解
- 潜在风险列表
- 应对策略
```

### product_brief_data.json
```json
{
  "opportunity_id": "OPP-2025-001",
  "product_name": "ProGrip Adjustable Phone Stand",
  "brief_version": "1.0",
  "created_date": "2025-01-15",
  "target_market": "US Amazon",

  "product_definition": {
    "core_features": [
      "360° rotation",
      "Adjustable viewing angles (0-90°)",
      "Built-in cable management",
      "Non-slip base",
      "Compatible with all phone sizes"
    ],
    "specifications": {
      "dimensions": "12cm x 8cm x 15cm",
      "weight": "85g",
      "material": "PETG (premium finish)",
      "color_options": ["Black", "White", "Space Gray"],
      "load_capacity": "500g"
    },
    "design_requirements": {
      "style": "Modern minimalist",
      "ergonomics": "One-hand adjustable",
      "durability": "5000+ adjustment cycles",
      "finish": "Matte with smooth edges"
    }
  },

  "competitive_analysis": {
    "top_competitors": [...],
    "our_advantages": [
      "More adjustment angles than competitors",
      "Integrated cable management",
      "Premium PETG material",
      "Heavier base for stability"
    ]
  },

  "pricing_strategy": {
    "target_price": 24.99,
    "cost_breakdown": {
      "material": 2.50,
      "printing": 1.80,
      "assembly": 0.70,
      "packaging": 0.50,
      "shipping_to_amazon": 1.20,
      "total_cogs": 6.70
    },
    "amazon_fees": {
      "referral_fee": 3.75,
      "fba_fee": 3.50,
      "total_fees": 7.25
    },
    "net_profit_per_unit": 11.04,
    "margin": "44%"
  },

  "go_to_market": {
    "development_timeline": {
      "design": "2 weeks",
      "prototyping": "1 week",
      "testing": "1 week",
      "production_setup": "1 week",
      "total": "5 weeks"
    },
    "launch_date": "2025-02-20",
    "initial_inventory": 500
  }
}
```

## AI Prompt 模板

### 生成产品Brief的提示词
```
你是一位资深的产品经理和技术作家。请基于以下市场机会数据，生成一份详细的产品开发简报(Product Brief)。

## 输入数据
{opportunity_data}
{competitor_analysis}
{customer_reviews}

## 要求
1. 分析目标客户的核心需求和痛点
2. 提炼产品的差异化定位
3. 定义清晰的产品规格和功能
4. 提供可执行的开发计划
5. 预测财务表现
6. 识别关键风险

## 输出格式
使用专业的产品管理语言，结构清晰，数据驱动，可直接作为研发团队的指导文档。

请生成完整的产品简报。
```

## 执行频率
- **按需触发**: 当 Opportunity Rank Agent 输出高优先级机会时
- **每周**: 为TOP 3机会生成或更新Brief
- **每月**: 回顾已发布Brief的执行情况

## 技术实现
```python
class ProductBriefAgent:
    def __init__(self, ai_client):
        self.ai_client = ai_client  # OpenRouter AI

    def generate_brief(self, opportunity_data):
        # 1. 加载机会数据
        opp = self.load_opportunity(opportunity_data)

        # 2. 深化研究
        competitors = self.analyze_competitors(opp['top_competitors'])
        customer_insights = self.extract_customer_insights(opp)

        # 3. 使用AI生成Brief内容
        brief_content = self.ai_generate_brief(opp, competitors, customer_insights)

        # 4. 结构化数据
        brief_data = self.structure_brief_data(opp, brief_content)

        # 5. 生成PDF
        pdf_path = self.create_pdf_brief(brief_content, brief_data)

        # 6. 保存JSON
        self.save_json(brief_data, 'product_brief_data.json')

        return pdf_path

    def ai_generate_brief(self, opportunity, competitors, insights):
        prompt = self.build_prompt(opportunity, competitors, insights)
        response = self.ai_client.chat(
            model="anthropic/claude-3-sonnet",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content

    def create_pdf_brief(self, content, data):
        # 使用ReportLab或类似库生成PDF
        pass
```

## 依赖
- 上游: Opportunity Rank Agent
- 下游: Design Spec Agent, Cost Estimator Agent
- 外部依赖:
  - OpenRouter AI (Claude/GPT)
  - PDF生成库 (ReportLab/WeasyPrint)

## 质量标准
- ✅ Brief必须包含所有关键章节
- ✅ 财务预测基于真实数据
- ✅ 技术规格清晰可执行
- ✅ 包含至少3个竞品对比
- ✅ PDF格式专业美观

## 注意事项
1. 确保Brief数据可追溯到原始市场数据
2. 定期更新Brief模板以适应新产品类型
3. 使用AI时需要人工review和调整
4. 保留Brief版本历史
5. 关联实际产品表现用于反馈优化
