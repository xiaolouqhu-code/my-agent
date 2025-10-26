# Cost Estimator Agent

## 角色定位
精确计算产品的全生命周期成本,包括材料、生产、包装、物流、平台费用,为定价决策提供数据支持。

## 核心职责

### 1. 成本分解
- 材料成本（3D打印耗材、配件）
- 生产成本（打印时间、电费、设备折旧）
- 人工成本（组装、质检、包装）
- 包装成本（盒子、填充物、标签）

### 2. 物流费用
- 发货到FBA仓库成本
- Amazon FBA费用（仓储+配送）
- 退货成本预估
- 国际物流（如适用）

### 3. 平台费用
- Amazon referral fee (8%-15%)
- FBA月度仓储费
- 长期仓储费预估
- 广告预算

### 4. 盈亏分析
- 计算不同售价下的利润率
- 找到盈亏平衡点
- 敏感性分析（材料价格波动）
- ROI预测

## 输入数据
- `design_spec.json` (Design Spec Agent)
- `product_brief_data.json` (Product Brief Agent)
- 材料价格数据库
- Amazon费用结构表
- 物流报价

## 输出内容

### cost_report.csv
| 类目 | 项目 | 单位成本 | 备注 |
|------|------|---------|------|
| **材料成本** | PETG耗材 | $2.50 | 45g @ $55/kg |
| | M3螺丝套装 | $0.08 | 1 set |
| | TPU防滑垫 | $0.40 | 4pcs @ $0.10 each |
| | **小计** | **$2.98** | |
| **生产成本** | 打印机折旧 | $0.35 | 4.5h @ $0.08/h |
| | 电费 | $0.12 | 4.5h @ 300W |
| | 失败率损耗 | $0.15 | 5% failure rate |
| | **小计** | **$0.62** | |
| **人工成本** | 组装 | $0.50 | 5 min @ $6/h |
| | 质检 | $0.20 | 2 min @ $6/h |
| | 包装 | $0.30 | 3 min @ $6/h |
| | **小计** | **$1.00** | |
| **包装成本** | 产品盒 | $0.45 | Custom printed |
| | 填充物 | $0.05 | Bubble wrap |
| | 标签贴纸 | $0.08 | Branding |
| | **小计** | **$0.58** | |
| **物流成本** | 发货到FBA | $1.20 | Bulk shipping |
| | **小计** | **$1.20** | |
| **总COGS** | | **$6.38** | Cost of Goods Sold |
| | | | |
| **Amazon费用** (@$24.99售价) | | | |
| | Referral Fee | $3.75 | 15% of price |
| | FBA Fee | $3.58 | Standard size |
| | 月度仓储 | $0.12 | Average per unit |
| | **小计** | **$7.45** | |
| **营销成本** | PPC广告 | $2.50 | Average ACOS 10% |
| | **小计** | **$2.50** | |
| **总成本** | | **$16.33** | |
| | | | |
| **定价分析** (@$24.99售价) | | | |
| | 售价 | $24.99 | |
| | 总成本 | $16.33 | |
| | **净利润** | **$8.66** | |
| | **利润率** | **34.7%** | |

### cost_analysis.json
```json
{
  "product_id": "OPP-2025-001",
  "product_name": "ProGrip Adjustable Phone Stand",
  "analysis_date": "2025-01-16",
  "currency": "USD",

  "cost_breakdown": {
    "cogs": {
      "materials": 2.98,
      "production": 0.62,
      "labor": 1.00,
      "packaging": 0.58,
      "logistics_to_fba": 1.20,
      "total": 6.38
    },
    "variable_costs_per_unit": {
      "amazon_referral_fee": 3.75,
      "amazon_fba_fee": 3.58,
      "amazon_storage_monthly": 0.12,
      "advertising_cpc": 2.50,
      "total": 9.95
    },
    "total_cost_per_unit": 16.33
  },

  "pricing_scenarios": [
    {
      "price": 19.99,
      "referral_fee": 3.00,
      "fba_fee": 3.58,
      "total_fees": 6.58,
      "total_cost": 15.46,
      "net_profit": 4.53,
      "margin": "22.7%",
      "recommendation": "Too low - below target margin"
    },
    {
      "price": 24.99,
      "referral_fee": 3.75,
      "fba_fee": 3.58,
      "total_fees": 7.33,
      "total_cost": 16.33,
      "net_profit": 8.66,
      "margin": "34.7%",
      "recommendation": "Optimal - balanced price/margin"
    },
    {
      "price": 29.99,
      "referral_fee": 4.50,
      "fba_fee": 3.58,
      "total_fees": 8.08,
      "total_cost": 16.58,
      "net_profit": 13.41,
      "margin": "44.7%",
      "recommendation": "High - may reduce conversion"
    }
  ],

  "breakeven_analysis": {
    "fixed_costs_monthly": {
      "equipment_depreciation": 200,
      "software_subscriptions": 50,
      "overhead": 150,
      "total": 400
    },
    "contribution_margin_per_unit": 8.66,
    "breakeven_units_monthly": 47,
    "breakeven_revenue_monthly": 1174
  },

  "sensitivity_analysis": {
    "material_price_change": {
      "-10%": {"cogs": 6.08, "margin": "36.1%"},
      "0%": {"cogs": 6.38, "margin": "34.7%"},
      "+10%": {"cogs": 6.68, "margin": "33.3%"},
      "+20%": {"cogs": 6.98, "margin": "31.9%"}
    },
    "selling_price_elasticity": {
      "19.99": {"units_sold_est": 450, "revenue": 8995, "profit": 2039},
      "24.99": {"units_sold_est": 350, "revenue": 8746, "profit": 3031},
      "29.99": {"units_sold_est": 250, "revenue": 7497, "profit": 3352}
    }
  },

  "roi_projection": {
    "initial_investment": {
      "first_inventory_500_units": 3190,
      "product_photography": 200,
      "listing_optimization": 150,
      "initial_ad_budget": 500,
      "total": 4040
    },
    "month_1_forecast": {
      "units_sold": 120,
      "revenue": 2998,
      "total_cost": 1959,
      "net_profit": 1039,
      "roi": "-74%"
    },
    "month_3_cumulative": {
      "units_sold": 380,
      "revenue": 9496,
      "total_cost": 6205,
      "net_profit": 3291,
      "roi": "-19%"
    },
    "month_6_cumulative": {
      "units_sold": 850,
      "revenue": 21241,
      "total_cost": 13880,
      "net_profit": 7361,
      "roi": "+82%"
    }
  },

  "cost_reduction_opportunities": [
    {
      "area": "Material sourcing",
      "current_cost": 2.98,
      "potential_saving": 0.45,
      "action": "Buy PETG in bulk (10kg+ order)",
      "impact": "15% material cost reduction"
    },
    {
      "area": "Production efficiency",
      "current_cost": 0.62,
      "potential_saving": 0.15,
      "action": "Optimize print settings, reduce failures",
      "impact": "24% production cost reduction"
    },
    {
      "area": "Packaging",
      "current_cost": 0.58,
      "potential_saving": 0.13,
      "action": "Order custom boxes in 1000+ qty",
      "impact": "22% packaging cost reduction"
    }
  ]
}
```

## 关键计算公式

### COGS (Cost of Goods Sold)
```
COGS = Material + Production + Labor + Packaging + Logistics
```

### Amazon费用
```
Referral Fee = Selling Price × Category Rate (通常8-15%)
FBA Fee = f(Weight, Dimensions, Category)  # 查Amazon费用表
Monthly Storage = Volume (cubic feet) × Rate
```

### 净利润和利润率
```
Net Profit = Selling Price - COGS - Amazon Fees - Advertising
Margin = (Net Profit / Selling Price) × 100%
```

### 盈亏平衡点
```
Breakeven Units = Fixed Costs / Contribution Margin per Unit
其中 Contribution Margin = Selling Price - Variable Costs
```

## 执行频率
- **初次**: Design Spec完成后立即执行
- **定期**: 每月更新成本数据（材料价格、费用变化）
- **按需**: 定价调整时重新计算

## 技术实现
```python
class CostEstimatorAgent:
    def __init__(self):
        self.material_prices = self.load_material_database()
        self.amazon_fees = self.load_amazon_fee_structure()

    def calculate_total_cost(self, design_spec, pricing):
        # 1. COGS
        material_cost = self.calculate_material_cost(design_spec['bom'])
        production_cost = self.calculate_production_cost(design_spec['print_parameters'])
        labor_cost = self.calculate_labor_cost(design_spec['assembly_instructions'])
        packaging_cost = self.estimate_packaging_cost(design_spec)
        logistics_cost = self.estimate_logistics_cost(design_spec['weight'])

        cogs = sum([material_cost, production_cost, labor_cost, packaging_cost, logistics_cost])

        # 2. Amazon费用
        referral_fee = pricing['price'] * 0.15  # 15% for most categories
        fba_fee = self.lookup_fba_fee(design_spec['weight'], design_spec['dimensions'])
        storage_fee = self.estimate_monthly_storage(design_spec['dimensions'])

        amazon_fees = referral_fee + fba_fee + storage_fee

        # 3. 营销成本
        ad_cost = pricing['price'] * 0.10  # Assume 10% ACOS

        # 4. 总成本
        total_cost = cogs + amazon_fees + ad_cost

        return {
            'cogs': cogs,
            'amazon_fees': amazon_fees,
            'ad_cost': ad_cost,
            'total_cost': total_cost,
            'net_profit': pricing['price'] - total_cost,
            'margin': ((pricing['price'] - total_cost) / pricing['price']) * 100
        }

    def pricing_sensitivity_analysis(self, design_spec, price_range):
        results = []
        for price in price_range:
            cost_data = self.calculate_total_cost(design_spec, {'price': price})
            results.append({
                'price': price,
                **cost_data
            })
        return results

    def lookup_fba_fee(self, weight, dimensions):
        # 查询Amazon FBA费用表
        # https://sellercentral.amazon.com/gp/help/GPDC3KPYAGDTVDJP
        # 简化示例
        if weight < 0.5 and max(dimensions) < 15:
            return 3.22  # Small standard size
        elif weight < 1.0:
            return 3.58  # Large standard size
        else:
            return 4.90  # Oversize
```

## 依赖
- 上游: Design Spec Agent, Product Brief Agent
- 下游: Pricing Monitor Agent (动态定价调整)
- 数据源:
  - Amazon Seller Central (FBA费用表)
  - 材料供应商价格
  - 物流商报价

## 输出使用场景
1. **定价决策**: 确定最优售价
2. **成本优化**: 识别降本机会
3. **财务预测**: ROI和盈亏分析
4. **供应商谈判**: 基于成本数据议价

## 注意事项
1. 定期更新Amazon费用结构（每季度变化）
2. 考虑汇率波动（如涉及进口材料）
3. 预留安全边际应对成本上升
4. 跟踪实际成本vs预估成本的偏差
5. 季节性因素影响仓储费（Q4更贵）
