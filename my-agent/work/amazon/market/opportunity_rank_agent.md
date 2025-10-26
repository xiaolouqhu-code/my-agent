# Opportunity Rank Agent

## 角色定位
整合市场情报层的所有数据，综合评估并排序产品机会，生成优先级清单供决策使用。

## 核心职责

### 1. 数据整合
- 聚合 Makerworld 趋势数据
- 整合竞品监控数据
- 合并跨平台趋势分析
- 补充历史销售数据

### 2. 机会评分
- 计算综合机会分数
- 评估市场需求强度
- 分析竞争激烈程度
- 估算利润空间

### 3. 风险评估
- 识别潜在法律风险（专利、版权）
- 评估供应链复杂度
- 分析季节性风险
- 检测市场饱和度

### 4. 优先级排序
- 根据多维度指标排序
- 考虑公司资源和能力
- 平衡快赢和长期项目
- 生成推荐执行顺序

## 输入数据
- `makerworld_trends.csv` (Makerworld Trend Agent)
- `competitor_snapshot.csv` (Competitor Watch Agent)
- `cross_platform_trends.csv` (Cross Platform Agent)
- 内部配置: 公司能力矩阵、资源约束

## 输出内容

### opportunity_rank.csv
| 字段 | 说明 | 示例 |
|------|------|------|
| opportunity_id | 机会ID | OPP-2025-001 |
| product_concept | 产品概念 | Adjustable Phone Stand |
| primary_keyword | 主关键词 | phone stand |
| opportunity_score | 机会分数(0-100) | 87 |
| demand_score | 需求分数(0-100) | 92 |
| competition_score | 竞争分数(0-100) | 65 |
| profit_score | 利润分数(0-100) | 78 |
| feasibility_score | 可行性分数(0-100) | 85 |
| risk_level | 风险等级 | Low/Medium/High |
| estimated_monthly_revenue | 预估月收入 | $8,500 |
| estimated_unit_cost | 预估单位成本 | $4.20 |
| target_selling_price | 建议售价 | $24.99 |
| estimated_margin | 预估利润率 | 65% |
| time_to_market | 上市时间 | 4-6 weeks |
| priority_rank | 优先级排名 | 1 |
| recommended_action | 建议行动 | Immediate Development |
| data_sources | 数据来源 | MW,CP,CT |
| analysis_date | 分析时间 | 2025-01-15 |

### opportunity_details.json
```json
{
  "opportunity_id": "OPP-2025-001",
  "product_concept": "Adjustable Phone Stand",
  "scores": {
    "overall": 87,
    "demand": 92,
    "competition": 65,
    "profit": 78,
    "feasibility": 85
  },
  "market_analysis": {
    "makerworld_trend_score": 0.92,
    "cross_platform_virality": 0.88,
    "amazon_search_volume": "15K/month",
    "etsy_listings": 3420,
    "avg_review_count": 250,
    "market_size_estimate": "$2.5M/year"
  },
  "competition_analysis": {
    "top_competitors": [
      {"asin": "B08XYZ1234", "price": "$19.99", "rating": 4.5, "reviews": 2340},
      {"asin": "B07ABC5678", "price": "$24.99", "rating": 4.6, "reviews": 1820}
    ],
    "avg_competitor_price": "$22.50",
    "price_range": "$12.99 - $34.99",
    "differentiation_opportunities": [
      "More adjustable angles",
      "Built-in cable management",
      "Premium materials"
    ]
  },
  "financial_projection": {
    "unit_cost_breakdown": {
      "material": "$2.50",
      "printing": "$1.20",
      "assembly": "$0.50",
      "total": "$4.20"
    },
    "pricing_strategy": {
      "recommended_price": "$24.99",
      "competitive_positioning": "Mid-tier premium",
      "target_margin": "65%"
    },
    "volume_forecast": {
      "conservative": "200 units/month",
      "moderate": "350 units/month",
      "optimistic": "600 units/month"
    }
  },
  "risk_assessment": {
    "overall_risk": "Low",
    "factors": [
      {"type": "IP Risk", "level": "Low", "note": "No patent conflicts found"},
      {"type": "Supply Chain", "level": "Low", "note": "Standard materials"},
      {"type": "Seasonality", "level": "Low", "note": "Year-round demand"},
      {"type": "Market Saturation", "level": "Medium", "note": "Moderate competition"}
    ]
  },
  "recommendation": {
    "action": "Immediate Development",
    "priority": "High",
    "rationale": "High demand, manageable competition, strong profit margin",
    "next_steps": [
      "Create detailed product brief",
      "Develop 3D design",
      "Source materials",
      "Create Amazon listing"
    ]
  }
}
```

## 评分算法

### 综合机会分数 (0-100)
```python
opportunity_score = (
    demand_score * 0.35 +
    (100 - competition_score) * 0.25 +
    profit_score * 0.25 +
    feasibility_score * 0.15
)
```

### 需求分数 (0-100)
- Makerworld 下载量: 30%
- 跨平台病毒性: 30%
- 亚马逊搜索量: 25%
- 社交媒体热度: 15%

### 竞争分数 (0-100)
- 竞品数量: 40%
- 平均评论数: 30%
- BSR平均排名: 20%
- 价格竞争度: 10%

### 利润分数 (0-100)
- 预估利润率: 50%
- 目标售价合理性: 30%
- 成本可控性: 20%

### 可行性分数 (0-100)
- 设计复杂度: 30%
- 材料可获得性: 25%
- 生产时间: 25%
- IP风险: 20%

## 执行频率
- **每日**: 更新机会排名（基于最新市场数据）
- **每周**: 生成新机会推荐报告
- **每月**: 回顾已采纳机会的实际表现

## 技术实现
```python
class OpportunityRankAgent:
    def load_input_data(self):
        # 加载所有上游数据
        makerworld_trends = pd.read_csv('makerworld_trends.csv')
        competitor_data = pd.read_csv('competitor_snapshot.csv')
        cross_platform = pd.read_csv('cross_platform_trends.csv')
        return makerworld_trends, competitor_data, cross_platform

    def calculate_scores(self, integrated_data):
        # 计算各维度分数
        demand = self._calculate_demand_score(...)
        competition = self._calculate_competition_score(...)
        profit = self._calculate_profit_score(...)
        feasibility = self._calculate_feasibility_score(...)
        return demand, competition, profit, feasibility

    def rank_opportunities(self, scored_data):
        # 排序并过滤
        scored_data['opportunity_score'] = (
            scored_data['demand_score'] * 0.35 +
            (100 - scored_data['competition_score']) * 0.25 +
            scored_data['profit_score'] * 0.25 +
            scored_data['feasibility_score'] * 0.15
        )
        return scored_data.sort_values('opportunity_score', ascending=False)

    def generate_recommendations(self, ranked_opportunities):
        # 生成行动建议
        pass

    def export_results(self, opportunities):
        # 导出CSV和JSON
        pass
```

## 依赖
- 上游:
  - Makerworld Trend Agent
  - Competitor Watch Agent
  - Cross Platform Agent
- 下游: Product Brief Agent (消费TOP机会)

## 配置参数
```yaml
scoring_weights:
  demand: 0.35
  competition: 0.25
  profit: 0.25
  feasibility: 0.15

filters:
  min_opportunity_score: 60
  max_risk_level: "High"
  min_estimated_margin: 0.30

thresholds:
  high_priority: 80
  medium_priority: 65
  low_priority: 50
```

## 注意事项
1. 定期校准评分算法（对比实际销售表现）
2. 考虑公司当前产能和资源约束
3. 平衡快速上市的小机会和长期大机会
4. 关注IP风险，避免侵权产品
5. 保留评分历史用于模型优化
