# Pricing Monitor Agent

## 角色定位
监控竞品价格和Buy Box状态,基于市场动态和库存水平动态调整价格,最大化利润和销量的平衡。

## 核心职责

### 1. 价格监控
- 追踪竞品价格变化
- 监控Buy Box获胜者和价格
- 记录历史价格趋势
- 识别价格战信号

### 2. 动态定价
- 基于竞争自动调价
- 考虑库存水平调整价格
- 根据销售速度优化价格
- 节日和促销定价策略

### 3. Buy Box优化
- 分析Buy Box获取率
- 优化FBA和价格策略
- 监控账户健康度影响
- 对比不同价格点的Buy Box表现

### 4. 利润保护
- 确保价格不低于最低利润线
- 计算不同价格点的净利润
- 平衡市场份额和利润率
- 预防价格战自损

## 输入数据
- Amazon SP-API (价格和Buy Box数据)
- `competitor_snapshot.csv` (Competitor Watch Agent)
- `cost_report.csv` (Cost Estimator Agent)
- `inventory_status.csv` (Inventory Monitor Agent)

## 输出内容

### pricing_analysis.json
```json
{
  "report_id": "PRICE-2025-01-16",
  "generated_date": "2025-01-16 14:30:00",

  "our_products": [
    {
      "asin": "B08XYZ1234",
      "sku": "PS-BLK-001",
      "product_name": "ProGrip Phone Stand - Black",

      "current_pricing": {
        "our_price": 24.99,
        "list_price": 29.99,
        "discount_pct": "17%",
        "last_changed": "2025-01-10"
      },

      "cost_structure": {
        "cogs": 6.38,
        "amazon_fees": 7.33,
        "ad_cost_per_unit": 2.50,
        "total_cost": 16.21,
        "break_even_price": 16.21,
        "current_margin": "35.1%",
        "current_profit_per_unit": 8.78
      },

      "competitive_landscape": {
        "competitor_count": 23,
        "price_range": {
          "min": 18.99,
          "max": 34.99,
          "avg": 24.50,
          "median": 23.99
        },
        "our_position": "Median +4%",
        "buy_box_holder": "Our Offer",
        "buy_box_price": 24.99,
        "buy_box_win_rate_7d": "92%"
      },

      "top_competitors": [
        {
          "seller": "CompetitorA",
          "price": 22.99,
          "rating": 4.5,
          "review_count": 2340,
          "fulfillment": "FBA",
          "buy_box_eligible": true
        },
        {
          "seller": "CompetitorB",
          "price": 23.99,
          "rating": 4.6,
          "review_count": 1820,
          "fulfillment": "FBA",
          "buy_box_eligible": true
        },
        {
          "seller": "CompetitorC",
          "price": 26.99,
          "rating": 4.3,
          "review_count": 890,
          "fulfillment": "FBM",
          "buy_box_eligible": false
        }
      ],

      "sales_velocity": {
        "units_per_day_7d": 12,
        "units_per_day_30d": 10,
        "trend": "increasing",
        "inventory_days_remaining": 28
      },

      "pricing_recommendations": [
        {
          "scenario": "Maintain Current",
          "price": 24.99,
          "expected_units_per_day": 12,
          "expected_margin": "35.1%",
          "buy_box_rate": "92%",
          "daily_profit": 105.36,
          "rationale": "Strong Buy Box position, healthy margin"
        },
        {
          "scenario": "Slight Decrease - Aggressive",
          "price": 23.99,
          "expected_units_per_day": 15,
          "expected_margin": "32.0%",
          "buy_box_rate": "98%",
          "daily_profit": 120.00,
          "rationale": "Match competitor B, increase volume, +$14/day profit"
        },
        {
          "scenario": "Increase - Profit Focus",
          "price": 26.99,
          "expected_units_per_day": 9,
          "expected_margin": "39.9%",
          "buy_box_rate": "75%",
          "daily_profit": 96.75,
          "rationale": "Higher margin but lose Buy Box share, -$8/day profit"
        }
      ],

      "recommended_action": {
        "action": "Decrease to $23.99",
        "rationale": "Match top competitor, increase sales velocity, improve daily profit by 14%",
        "timing": "Implement within 24 hours",
        "expected_impact": {
          "units_increase": "+25%",
          "profit_increase": "+14%",
          "buy_box_improvement": "+6%"
        },
        "risk_level": "Low"
      },

      "price_elasticity_estimate": {
        "current_price": 24.99,
        "elasticity": -1.8,
        "interpretation": "Elastic demand - 1% price decrease → 1.8% volume increase",
        "optimal_price_range": "23.99 - 25.99"
      }
    }
  ],

  "market_trends": {
    "category_avg_price": 25.50,
    "category_price_trend_30d": "-2.3%",
    "seasonal_factor": "Normal",
    "competitive_intensity": "Medium",
    "observations": [
      "Category prices declining slightly",
      "New competitor entered at $21.99 (likely loss leader)",
      "Prime Day upcoming - expect price competition"
    ]
  },

  "pricing_alerts": [
    {
      "severity": "Medium",
      "alert": "Competitor A reduced price to $22.99 (-8%)",
      "product": "B08XYZ1234",
      "impact": "May lose Buy Box if we don't respond",
      "recommendation": "Monitor for 48h, consider matching if Buy Box rate drops <85%"
    },
    {
      "severity": "Low",
      "alert": "Inventory getting low (28 days remaining)",
      "product": "B08ABC5678",
      "impact": "Can increase price to slow sales until restock",
      "recommendation": "Increase price to $26.99 if stock <20 days"
    }
  ],

  "price_change_history": [
    {
      "date": "2025-01-10",
      "asin": "B08XYZ1234",
      "old_price": 26.99,
      "new_price": 24.99,
      "reason": "Match competitor prices, volume declining",
      "result": "Units/day increased 8 → 12 (+50%), profit stable"
    },
    {
      "date": "2024-12-28",
      "asin": "B08XYZ1234",
      "old_price": 24.99,
      "new_price": 26.99,
      "reason": "Post-holiday price normalization",
      "result": "Margin improved 32% → 36%, volume decreased slightly"
    }
  ]
}
```

### pricing_strategy.yml (配置)
```yaml
pricing_strategy:
  default:
    min_margin: 0.25  # 最低25%利润率
    target_margin: 0.35  # 目标35%利润率
    max_margin: 0.45  # 最高45%利润率

    buy_box_priority: high  # high, medium, low
    buy_box_threshold: 0.85  # Buy Box获取率低于85%需调价

  dynamic_pricing_rules:
    - name: "High Inventory Clearance"
      condition: "inventory_days > 90"
      action: "reduce price 5-10% until inventory_days < 60"
      min_margin_override: 0.20

    - name: "Low Inventory Premium"
      condition: "inventory_days < 15"
      action: "increase price 5-15% to slow sales"
      max_price: "list_price"

    - name: "Competitive Response"
      condition: "buy_box_rate < 80% AND competitor_price < our_price"
      action: "match competitor_price OR reduce 3-5%"
      min_margin_enforced: true

    - name: "Profit Maximization"
      condition: "buy_box_rate > 95% AND sales_velocity > target * 1.2"
      action: "increase price 3-5% to test elasticity"
      max_increase: 0.05

  competitor_matching:
    auto_match: false  # 是否自动匹配竞品价格
    match_threshold: 0.95  # 竞品低于我方95%时考虑匹配
    match_delay_hours: 24  # 观察24小时再响应
    min_competitor_rating: 4.0  # 只匹配高评分竞品

  promotional_pricing:
    prime_day:
      discount_pct: 0.20
      min_margin: 0.15
    black_friday:
      discount_pct: 0.25
      min_margin: 0.12
    lightning_deals:
      discount_pct: 0.15
      min_margin: 0.20

  safety_limits:
    max_price_change_per_day: 2  # 每天最多改价2次
    max_price_decrease_pct: 0.15  # 单次最多降15%
    max_price_increase_pct: 0.10  # 单次最多涨10%
    min_absolute_price: 15.00  # 绝对最低价
    require_approval_if:
      - "margin < 0.20"
      - "price_change > 10%"
```

## 定价策略

### 1. 基于竞争的定价
```python
def competitive_pricing(our_price, competitor_prices, buy_box_rate):
    min_competitor_price = min(competitor_prices)
    avg_competitor_price = np.mean(competitor_prices)

    if buy_box_rate < 0.85:
        # Buy Box表现差,需要降价
        if our_price > min_competitor_price * 1.05:
            # 我们比最低价高5%以上,匹配或略低于平均价
            new_price = avg_competitor_price * 0.98
        else:
            new_price = our_price  # 价格已有竞争力,保持
    elif buy_box_rate > 0.95:
        # Buy Box表现优秀,可以试探性提价
        new_price = our_price * 1.03
    else:
        # Buy Box表现正常,保持
        new_price = our_price

    return new_price
```

### 2. 基于库存的定价
```python
def inventory_based_pricing(current_price, inventory_days, target_days=45):
    if inventory_days < 15:
        # 库存紧张,提价减缓销售
        new_price = current_price * 1.08
    elif inventory_days > 90:
        # 库存过剩,降价清库存
        new_price = current_price * 0.95
    else:
        # 库存正常,保持
        new_price = current_price

    return new_price
```

### 3. 价格弹性优化
```python
def optimize_price_by_elasticity(cost, current_price, current_volume, elasticity):
    """
    使用价格弹性找到利润最大化价格

    elasticity: 需求价格弹性系数 (通常为负值)
    例如: -1.5 表示价格降1%,需求增1.5%
    """
    # 简化的利润最大化公式
    # Optimal Price = Cost / (1 + 1/elasticity)

    if elasticity >= -1:
        # 需求缺乏弹性,提价增利润
        optimal_price = current_price * 1.1
    else:
        # 需求有弹性,需平衡
        optimal_price = cost / (1 + 1/abs(elasticity))

    return optimal_price
```

## 执行频率
- **每小时**: 检查竞品价格和Buy Box状态
- **每4小时**: 评估是否需要调价
- **每日**: 深度分析和策略调整
- **实时**: 响应重大价格变动

## 技术实现
```python
class PricingMonitorAgent:
    def __init__(self, sp_api, pricing_strategy):
        self.sp_api = sp_api
        self.strategy = pricing_strategy

    def analyze_pricing(self):
        # 1. 获取当前价格
        our_listings = self.sp_api.get_my_price()

        # 2. 获取竞品价格
        competitor_offers = self.sp_api.get_competitive_pricing()

        # 3. 获取Buy Box信息
        buy_box_data = self.sp_api.get_buy_box_prices()

        # 4. 分析每个产品
        recommendations = []
        for listing in our_listings:
            analysis = self._analyze_product_pricing(
                listing,
                competitor_offers[listing['asin']],
                buy_box_data[listing['asin']]
            )
            recommendations.append(analysis)

        # 5. 导出分析
        self.export_analysis(recommendations)

        return recommendations

    def _analyze_product_pricing(self, our_listing, competitors, buy_box):
        current_price = our_listing['price']
        competitor_prices = [c['price'] for c in competitors]

        # 计算利润
        cost_data = self.get_cost_data(our_listing['sku'])
        current_margin = (current_price - cost_data['total_cost']) / current_price

        # 买框获取率
        buy_box_rate = buy_box['win_rate']

        # 生成多个定价场景
        scenarios = []

        # 场景1: 维持现价
        scenarios.append({
            'scenario': 'Maintain',
            'price': current_price,
            'margin': current_margin,
            'buy_box_rate': buy_box_rate
        })

        # 场景2: 降价匹配竞品
        competitive_price = np.median(competitor_prices) * 0.98
        if competitive_price > cost_data['break_even']:
            scenarios.append({
                'scenario': 'Match Competitors',
                'price': competitive_price,
                'margin': (competitive_price - cost_data['total_cost']) / competitive_price,
                'buy_box_rate': 0.95  # 预估
            })

        # 场景3: 提价增利润
        premium_price = current_price * 1.05
        scenarios.append({
            'scenario': 'Increase',
            'price': premium_price,
            'margin': (premium_price - cost_data['total_cost']) / premium_price,
            'buy_box_rate': buy_box_rate * 0.90  # 预估降低
        })

        # 选择最优场景
        best_scenario = self._select_best_scenario(scenarios, self.strategy)

        return {
            'asin': our_listing['asin'],
            'current_pricing': our_listing,
            'competitive_landscape': {
                'competitors': competitors,
                'buy_box': buy_box
            },
            'scenarios': scenarios,
            'recommended_action': best_scenario
        }

    def execute_price_change(self, asin, new_price):
        # 使用SP-API更新价格
        response = self.sp_api.submit_price(
            sku=self.asin_to_sku(asin),
            price=new_price
        )
        return response
```

## Amazon SP-API集成
```python
from sp_api.api import Pricing

def get_competitive_pricing(asin):
    pricing_api = Pricing(credentials=..., marketplace=Marketplaces.US)

    response = pricing_api.get_competitive_pricing(
        asin_list=[asin],
        item_type='Asin'
    )

    offers = response.payload[0]['Product']['CompetitivePricing']['CompetitivePrices']
    return offers

def update_price(sku, new_price):
    from sp_api.api import Feeds

    feed_api = Feeds(credentials=..., marketplace=Marketplaces.US)

    # 构建价格更新feed
    price_feed = f"""
    <?xml version="1.0"?>
    <AmazonEnvelope>
      <Message>
        <MessageID>1</MessageID>
        <Price>
          <SKU>{sku}</SKU>
          <StandardPrice currency="USD">{new_price}</StandardPrice>
        </Price>
      </Message>
    </AmazonEnvelope>
    """

    # 提交feed
    response = feed_api.submit_feed(
        feed_type='POST_PRODUCT_PRICING_DATA',
        file=price_feed
    )

    return response
```

## 依赖
- 上游: Cost Estimator, Competitor Watch, Inventory Monitor
- 外部API: Amazon SP-API (Pricing)

## 监控和警报
```yaml
pricing_alerts:
  price_war:
    condition: "competitor_avg_price_drop > 15% in 24h"
    action: "notify + hold pricing decision"

  margin_too_low:
    condition: "margin < min_margin"
    action: "block price change + notify"

  buy_box_loss:
    condition: "buy_box_rate < 70% for 12 hours"
    action: "suggest price review"
```

## 注意事项
1. 避免盲目价格战,保护利润底线
2. 考虑长期品牌价值,不要过度低价
3. 新品定价从高往低测试,找最优点
4. 节假日定价需提前规划
5. 价格变动需符合Amazon政策
6. 记录所有定价决策和结果用于学习
