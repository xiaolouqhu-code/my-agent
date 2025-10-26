# Inventory Monitor Agent

## 角色定位
实时监控亚马逊FBA库存水平,预测库存需求,自动触发补货计划,避免断货和滞销。

## 核心职责

### 1. 库存监控
- 实时追踪FBA可售库存
- 监控入库中(Inbound)库存
- 追踪预留(Reserved)库存
- 检测库存异常波动

### 2. 销售预测
- 分析历史销售趋势
- 考虑季节性因素
- 预测未来30/60/90天销量
- 识别促销活动影响

### 3. 补货计划
- 计算安全库存水平
- 确定再订货点(Reorder Point)
- 生成补货建议
- 优化订货批量

### 4. 库存健康度
- 计算库存周转率
- 识别滞销风险
- 预警长期仓储费
- 优化库存结构

## 输入数据
- Amazon SP-API (库存报告)
- 历史销售数据
- 生产周期数据(从Print Scheduler)
- 物流周期配置

## 输出内容

### inventory_status.csv
| ASIN | SKU | 产品名称 | 可售库存 | 入库中 | 预留 | 日均销量 | 可售天数 | 状态 | 建议行动 |
|------|-----|---------|---------|--------|------|---------|---------|------|---------|
| B08XYZ1234 | PS-BLK-001 | Phone Stand Black | 85 | 200 | 15 | 12 | 7.1 | ⚠️ Low | Expedite inbound |
| B08ABC5678 | PS-WHT-001 | Phone Stand White | 245 | 0 | 20 | 8 | 30.6 | ✅ Good | Monitor |
| B09DEF9012 | CO-BLK-001 | Cable Organizer | 420 | 100 | 35 | 15 | 28.0 | ✅ Good | Monitor |
| B09GHI3456 | HD-GRY-001 | Headphone Stand | 12 | 0 | 3 | 6 | 2.0 | 🚨 Critical | Rush order |
| B07JKL7890 | DH-WHT-001 | Desk Hook | 850 | 0 | 45 | 5 | 170.0 | 📦 Overstock | Reduce price |

### reorder_plan.json
```json
{
  "plan_id": "REORDER-2025-W03",
  "generated_date": "2025-01-16",
  "planning_horizon_days": 90,

  "reorder_recommendations": [
    {
      "sku": "PS-BLK-001",
      "product_name": "ProGrip Phone Stand - Black",
      "asin": "B08XYZ1234",

      "current_status": {
        "fba_available": 85,
        "inbound_shipment": 200,
        "reserved": 15,
        "total_inventory": 300
      },

      "sales_forecast": {
        "avg_daily_sales": 12,
        "next_30_days": 360,
        "next_60_days": 720,
        "next_90_days": 1080,
        "confidence": "High",
        "seasonality_factor": 1.0
      },

      "inventory_parameters": {
        "lead_time_days": 21,
        "safety_stock": 100,
        "reorder_point": 352,
        "economic_order_quantity": 500,
        "max_inventory_level": 800
      },

      "reorder_recommendation": {
        "action": "Order Now",
        "urgency": "High",
        "quantity": 500,
        "estimated_stockout_date": "2025-02-05",
        "days_until_stockout": 20,
        "target_ship_date": "2025-01-25",
        "rationale": "Current + inbound will last only 25 days, need buffer"
      },

      "financial_impact": {
        "unit_cost": 6.38,
        "order_value": 3190,
        "estimated_revenue": 12495,
        "estimated_profit": 4330,
        "roi": "136%"
      }
    },
    {
      "sku": "HD-GRY-001",
      "product_name": "Premium Headphone Stand - Gray",
      "asin": "B09GHI3456",

      "current_status": {
        "fba_available": 12,
        "inbound_shipment": 0,
        "reserved": 3,
        "total_inventory": 15
      },

      "sales_forecast": {
        "avg_daily_sales": 6,
        "next_30_days": 180,
        "next_60_days": 360,
        "next_90_days": 540
      },

      "inventory_parameters": {
        "lead_time_days": 21,
        "safety_stock": 60,
        "reorder_point": 186,
        "economic_order_quantity": 300
      },

      "reorder_recommendation": {
        "action": "Rush Order - Critical",
        "urgency": "Critical",
        "quantity": 300,
        "estimated_stockout_date": "2025-01-18",
        "days_until_stockout": 2,
        "target_ship_date": "2025-01-17",
        "rationale": "Imminent stockout! Air freight recommended"
      },

      "financial_impact": {
        "unit_cost": 5.20,
        "order_value": 1560,
        "air_freight_premium": 300,
        "total_cost": 1860,
        "estimated_revenue": 8970,
        "opportunity_cost_of_stockout": 2400
      }
    }
  ],

  "overstock_alerts": [
    {
      "sku": "DH-WHT-001",
      "product_name": "Desk Hook - White",
      "current_inventory": 850,
      "avg_daily_sales": 5,
      "days_of_supply": 170,
      "issue": "Excessive inventory",
      "long_term_storage_risk": "High (>365 days)",
      "recommendations": [
        "Run 20% discount promotion",
        "Consider Amazon Outlet",
        "Bundle with popular products",
        "Reduce future production"
      ],
      "potential_ltst_fee": 243.75
    }
  ],

  "overall_summary": {
    "total_skus_monitored": 12,
    "healthy_stock": 7,
    "low_stock_warning": 3,
    "critical_stock": 2,
    "overstock": 1,
    "total_recommended_orders": 5,
    "total_order_value": 12850
  }
}
```

### inventory_forecast.csv (90天预测)
| 日期 | SKU | 预测销量 | 预测库存 | 状态 | 备注 |
|------|-----|---------|---------|------|------|
| 2025-01-17 | PS-BLK-001 | 12 | 73 | Low | - |
| 2025-01-18 | PS-BLK-001 | 12 | 61 | Low | - |
| ... | ... | ... | ... | ... | ... |
| 2025-01-28 | PS-BLK-001 | 12 | 200 | Good | Inbound received |
| ... | ... | ... | ... | ... | ... |
| 2025-02-15 | PS-BLK-001 | 12 | 56 | Low | New order needed |

## 计算公式

### 安全库存 (Safety Stock)
```
Safety Stock = Z × σ × √LT

其中:
- Z = 服务水平系数 (95% ≈ 1.65, 99% ≈ 2.33)
- σ = 日销量标准差
- LT = Lead Time (提前期,天数)
```

### 再订货点 (Reorder Point)
```
ROP = (Average Daily Sales × Lead Time) + Safety Stock
```

### 经济订货批量 (EOQ)
```
EOQ = √(2 × D × S / H)

其中:
- D = 年需求量
- S = 单次订货成本
- H = 单位年持有成本
```

### 库存周转率
```
Inventory Turnover = COGS (年) / Average Inventory Value
Days of Inventory = 365 / Inventory Turnover
```

## 执行频率
- **每小时**: 检查Critical库存状态
- **每日**: 更新库存预测,生成补货建议
- **每周**: 深度分析库存健康度
- **每月**: 优化库存参数(安全库存、ROP等)

## 技术实现
```python
class InventoryMonitorAgent:
    def __init__(self, sp_api_client):
        self.sp_api = sp_api_client

    def fetch_inventory_data(self):
        # 使用Amazon SP-API获取库存数据
        inventory = self.sp_api.get_inventory_summaries()

        inventory_data = []
        for item in inventory:
            inventory_data.append({
                'sku': item['sellerSku'],
                'asin': item['asin'],
                'fba_available': item['inventoryDetails']['fulfillableQuantity'],
                'inbound': item['inventoryDetails']['inboundWorkingQuantity'],
                'reserved': item['inventoryDetails']['reservedQuantity']
            })

        return inventory_data

    def forecast_sales(self, sku, historical_sales):
        # 简化的销售预测 (可使用ARIMA, Prophet等高级模型)
        df = pd.DataFrame(historical_sales)

        # 计算移动平均
        df['ma_7'] = df['sales'].rolling(window=7).mean()
        df['ma_30'] = df['sales'].rolling(window=30).mean()

        # 检测趋势
        recent_avg = df['sales'].tail(14).mean()
        historical_avg = df['sales'].tail(90).mean()
        trend_factor = recent_avg / historical_avg

        # 考虑季节性
        seasonality = self._get_seasonality_factor(sku, df)

        # 预测
        forecast_30d = recent_avg * 30 * trend_factor * seasonality
        forecast_60d = recent_avg * 60 * trend_factor * seasonality
        forecast_90d = recent_avg * 90 * trend_factor * seasonality

        return {
            'avg_daily_sales': recent_avg,
            'next_30_days': forecast_30d,
            'next_60_days': forecast_60d,
            'next_90_days': forecast_90d,
            'trend_factor': trend_factor,
            'seasonality_factor': seasonality
        }

    def calculate_reorder_point(self, avg_daily_sales, lead_time_days, service_level=0.95):
        # 计算安全库存
        std_dev = self._calculate_sales_std_dev(avg_daily_sales)
        z_score = 1.65 if service_level == 0.95 else 2.33  # 95% or 99%
        safety_stock = z_score * std_dev * math.sqrt(lead_time_days)

        # 再订货点
        rop = (avg_daily_sales * lead_time_days) + safety_stock

        return {
            'reorder_point': int(rop),
            'safety_stock': int(safety_stock)
        }

    def generate_reorder_plan(self):
        # 1. 获取库存数据
        inventory = self.fetch_inventory_data()

        # 2. 获取销售历史
        sales_history = self.fetch_sales_history()

        # 3. 对每个SKU分析
        recommendations = []
        for item in inventory:
            sku = item['sku']

            # 销售预测
            forecast = self.forecast_sales(sku, sales_history[sku])

            # 计算ROP
            rop_data = self.calculate_reorder_point(
                forecast['avg_daily_sales'],
                lead_time_days=21
            )

            # 当前可用库存
            total_inventory = (item['fba_available'] +
                             item['inbound'] -
                             item['reserved'])

            # 预测断货日期
            days_until_stockout = total_inventory / forecast['avg_daily_sales']

            # 判断是否需要补货
            if total_inventory < rop_data['reorder_point']:
                urgency = 'Critical' if days_until_stockout < 7 else 'High'
                recommendations.append({
                    'sku': sku,
                    'action': 'Order Now',
                    'urgency': urgency,
                    'quantity': self._calculate_order_quantity(sku),
                    'days_until_stockout': days_until_stockout
                })

        return recommendations

    def detect_overstock(self, inventory_data, sales_forecast):
        overstock = []
        for item in inventory_data:
            days_of_supply = item['total_inventory'] / sales_forecast[item['sku']]['avg_daily_sales']

            if days_of_supply > 120:  # 超过4个月库存
                overstock.append({
                    'sku': item['sku'],
                    'days_of_supply': days_of_supply,
                    'recommendations': self._generate_overstock_actions(item)
                })

        return overstock
```

## Amazon SP-API集成

### 获取库存数据
```python
from sp_api.api import Inventories
from sp_api.base import Marketplaces

def get_fba_inventory():
    inventory_api = Inventories(
        credentials=dict(
            refresh_token='your-refresh-token',
            lwa_app_id='your-app-id',
            lwa_client_secret='your-secret'
        ),
        marketplace=Marketplaces.US
    )

    response = inventory_api.get_inventory_summary_marketplace(
        details=True,
        granularityType='Marketplace',
        granularityId='ATVPDKIKX0DER',
        marketplaceIds=['ATVPDKIKX0DER']
    )

    return response.payload['inventorySummaries']
```

## 依赖
- 上游: 无 (直接从Amazon获取数据)
- 下游: Print Scheduler Agent (触发生产计划)
- 外部API: Amazon SP-API

## 警报配置
```yaml
inventory_alerts:
  critical_stock:
    threshold_days: 7
    notification: ["email", "slack"]
  low_stock:
    threshold_days: 14
    notification: ["email"]
  overstock:
    threshold_days: 120
    notification: ["email"]
  stockout:
    immediate: true
    notification: ["sms", "email", "slack"]
```

## 注意事项
1. 考虑Amazon物流处理时间(2-5天)
2. 节假日和Prime Day需要额外库存缓冲
3. 新品前90天销售波动大,预测谨慎
4. 定期审查安全库存和ROP参数
5. 长期仓储费(>365天)成本高,及时清理
6. 考虑多仓库分布(如EU, JP市场)
