# Supplier Insight Agent

## 角色定位
监控和分析原材料供应商表现,优化采购策略,识别供应链风险,确保材料质量和成本最优。

## 核心职责

### 1. 供应商绩效监控
- 追踪交付准时率
- 监控材料质量合格率
- 评估价格竞争力
- 记录沟通响应速度

### 2. 价格追踪
- 监控材料市场价格趋势
- 对比多家供应商报价
- 识别采购最佳时机
- 预测价格波动

### 3. 质量分析
- 关联材料批次与产品质量
- 追踪不良品来源
- 分析材料一致性
- 评估新供应商样品

### 4. 风险管理
- 识别单一供应商依赖风险
- 监控供应商财务健康度
- 追踪地缘政治影响
- 建立备选供应商池

## 输入数据
- 采购订单记录
- 收货质检数据
- `qc_report.csv` (QC Analyzer Agent)
- 供应商报价单
- 市场价格数据

## 输出内容

### supplier_scorecard.csv
| 供应商 | 材料类型 | 采购总额 | 订单数 | 准时率 | 质量合格率 | 价格评分 | 响应速度 | 综合评分 | 等级 |
|--------|---------|---------|--------|--------|-----------|---------|---------|---------|------|
| eSUN | PETG | $8,450 | 18 | 94% | 96.8% | 8.5/10 | 4.2/5 | 92.5 | A |
| Polymaker | PETG | $3,200 | 7 | 100% | 92.1% | 7.8/10 | 4.8/5 | 90.2 | A |
| Hatchbox | PLA | $2,100 | 12 | 89% | 98.5% | 9.2/10 | 3.5/5 | 88.7 | B+ |
| Overture | TPU | $650 | 4 | 75% | 95.0% | 8.0/10 | 3.0/5 | 82.1 | B |
| Generic-X | PETG | $1,800 | 5 | 60% | 88.0% | 9.5/10 | 2.5/5 | 71.3 | C |

### supplier_analysis.json
```json
{
  "report_id": "SUPPLIER-2025-Q1",
  "period": "2024-10 to 2025-01",
  "generated_date": "2025-01-16",

  "supplier_profiles": [
    {
      "supplier_id": "SUP-001",
      "name": "eSUN",
      "country": "China",
      "relationship_since": "2023-05",
      "total_orders": 18,
      "total_spend": 8450,

      "performance_metrics": {
        "on_time_delivery_rate": "94%",
        "avg_delivery_days": 12,
        "quality_pass_rate": "96.8%",
        "defect_rate": "3.2%",
        "price_competitiveness": 8.5,
        "communication_score": 4.2,
        "overall_score": 92.5,
        "grade": "A"
      },

      "material_quality_by_batch": [
        {
          "batch_id": "PETG-2401",
          "purchase_date": "2024-12-15",
          "quantity_kg": 25,
          "price_per_kg": 38.50,
          "quality_score": "Excellent",
          "pass_rate": "98.5%",
          "notes": "Minimal stringing, consistent diameter"
        },
        {
          "batch_id": "PETG-2402",
          "purchase_date": "2025-01-08",
          "quantity_kg": 20,
          "price_per_kg": 39.00,
          "quality_score": "Good",
          "pass_rate": "94.2%",
          "notes": "Slightly more moisture, required drying"
        }
      ],

      "pricing_history": [
        {"date": "2024-10", "price_per_kg": 37.50},
        {"date": "2024-11", "price_per_kg": 38.00},
        {"date": "2024-12", "price_per_kg": 38.50},
        {"date": "2025-01", "price_per_kg": 39.00}
      ],

      "strengths": [
        "Consistent quality across batches",
        "Responsive customer service",
        "Reliable delivery schedule",
        "Good packaging to prevent moisture"
      ],

      "weaknesses": [
        "Price increasing trend (+4% over 3 months)",
        "Occasional delays during Chinese New Year",
        "MOQ 20kg can be limiting"
      ],

      "recommendations": {
        "continue_partnership": true,
        "bulk_order_timing": "Before CNY (Feb)",
        "negotiate_volume_discount": "Order 100kg+ for 8% discount",
        "quality_improvements": "Request better moisture barrier packaging"
      }
    },
    {
      "supplier_id": "SUP-002",
      "name": "Polymaker",
      "country": "China",
      "relationship_since": "2024-08",

      "performance_metrics": {
        "on_time_delivery_rate": "100%",
        "avg_delivery_days": 10,
        "quality_pass_rate": "92.1%",
        "defect_rate": "7.9%",
        "price_competitiveness": 7.8,
        "communication_score": 4.8,
        "overall_score": 90.2,
        "grade": "A"
      },

      "strengths": [
        "Perfect delivery record",
        "Excellent communication",
        "Fast shipping",
        "Premium brand reputation"
      ],

      "weaknesses": [
        "Higher price point (+15% vs eSUN)",
        "Recent batch had higher defect rate",
        "Limited color options in stock"
      ],

      "recommendations": {
        "continue_partnership": true,
        "use_case": "Premium products requiring best finish",
        "cost_optimization": "Use for final customer-facing parts only",
        "quality_follow_up": "Discuss batch 2402 quality issues"
      }
    },
    {
      "supplier_id": "SUP-005",
      "name": "Generic-X",
      "country": "Unknown",
      "relationship_since": "2024-11",

      "performance_metrics": {
        "on_time_delivery_rate": "60%",
        "avg_delivery_days": 18,
        "quality_pass_rate": "88.0%",
        "defect_rate": "12.0%",
        "price_competitiveness": 9.5,
        "communication_score": 2.5,
        "overall_score": 71.3,
        "grade": "C"
      },

      "critical_issues": [
        "Frequent delivery delays (40% late)",
        "Inconsistent material quality",
        "Poor communication and unresponsive",
        "Two batches arrived damaged"
      ],

      "recommendations": {
        "continue_partnership": false,
        "action": "Phase out, replace with eSUN or Hatchbox",
        "timeline": "Complete transition by Feb 2025",
        "cost_impact": "Minimal (+$0.08/kg = $80/month)"
      }
    }
  ],

  "category_analysis": {
    "PETG": {
      "total_spend": 13450,
      "avg_price_per_kg": 38.75,
      "best_supplier": "eSUN",
      "price_range": "35.00 - 45.00",
      "quality_range": "88% - 97%"
    },
    "PLA": {
      "total_spend": 2100,
      "avg_price_per_kg": 24.50,
      "best_supplier": "Hatchbox",
      "price_range": "22.00 - 28.00",
      "quality_range": "95% - 99%"
    },
    "TPU": {
      "total_spend": 650,
      "avg_price_per_kg": 52.00,
      "best_supplier": "Overture",
      "price_range": "48.00 - 58.00",
      "quality_range": "90% - 96%"
    }
  },

  "market_trends": {
    "PETG": {
      "trend": "Price increasing",
      "change_3m": "+3.8%",
      "forecast_6m": "+2-5%",
      "drivers": ["Raw material cost up", "Demand increase"],
      "recommendation": "Buy bulk before Q2"
    },
    "PLA": {
      "trend": "Stable",
      "change_3m": "+0.5%",
      "forecast_6m": "Flat to +1%",
      "recommendation": "Normal purchasing rhythm"
    }
  },

  "cost_optimization_opportunities": [
    {
      "opportunity": "Bulk purchasing PETG",
      "current_order_size": "20-25kg",
      "proposed_order_size": "100kg",
      "current_price": 39.00,
      "negotiated_price": 35.88,
      "savings_per_kg": 3.12,
      "annual_savings": 1560,
      "storage_cost": 150,
      "net_savings": 1410,
      "payback_period": "Immediate",
      "action": "Negotiate with eSUN for 100kg order"
    },
    {
      "opportunity": "Replace Generic-X with eSUN",
      "current_spend": 1800,
      "new_spend": 1880,
      "cost_increase": 80,
      "quality_improvement": "+8.8% pass rate",
      "defect_reduction_savings": 240,
      "net_benefit": 160,
      "action": "Phase out Generic-X immediately"
    },
    {
      "opportunity": "Dual-sourcing PETG",
      "rationale": "Reduce dependency on single supplier",
      "primary": "eSUN (70%)",
      "secondary": "Polymaker (30%)",
      "risk_reduction": "High",
      "cost_impact": "+$180/year",
      "action": "Implement starting Feb 2025"
    }
  ],

  "risk_assessment": [
    {
      "risk": "eSUN single-source dependency",
      "probability": "Medium",
      "impact": "High",
      "current_mitigation": "None",
      "recommendation": "Add Polymaker as secondary (30% volume)"
    },
    {
      "risk": "PETG price volatility",
      "probability": "High",
      "impact": "Medium",
      "current_mitigation": "None",
      "recommendation": "Bulk purchase with 3-month buffer stock"
    },
    {
      "risk": "Chinese New Year disruption",
      "probability": "High",
      "impact": "Medium",
      "current_mitigation": "Aware",
      "recommendation": "Order 2 months supply before Jan 25"
    }
  ],

  "action_items": [
    {
      "priority": "High",
      "action": "Phase out Generic-X supplier",
      "owner": "Procurement",
      "deadline": "2025-02-15",
      "status": "Not Started"
    },
    {
      "priority": "High",
      "action": "Negotiate bulk discount with eSUN",
      "owner": "Procurement",
      "deadline": "2025-01-25",
      "status": "In Progress"
    },
    {
      "priority": "Medium",
      "action": "Set up Polymaker as backup supplier",
      "owner": "Procurement",
      "deadline": "2025-02-28",
      "status": "Not Started"
    },
    {
      "priority": "Medium",
      "action": "Review Polymaker batch 2402 quality",
      "owner": "QC Team",
      "deadline": "2025-01-20",
      "status": "Not Started"
    }
  ]
}
```

### price_comparison.csv (实时价格对比)
| 材料 | eSUN | Polymaker | Hatchbox | Overture | 市场最低价 | 最佳选择 |
|------|------|-----------|---------|---------|-----------|---------|
| PETG Black | $39.00/kg | $44.50/kg | N/A | $41.00/kg | $38.50 | eSUN |
| PETG White | $39.00/kg | $44.50/kg | N/A | $41.00/kg | $38.50 | eSUN |
| PLA Black | $26.00/kg | $28.00/kg | $24.50/kg | $25.00/kg | $24.00 | Hatchbox |
| TPU 95A | N/A | N/A | N/A | $52.00/kg | $48.00 | Overture |

## 评分算法

### 综合供应商评分 (0-100)
```python
def calculate_supplier_score(metrics):
    score = (
        metrics['on_time_delivery_rate'] * 0.30 +
        metrics['quality_pass_rate'] * 0.30 +
        metrics['price_competitiveness'] * 10 * 0.25 +
        metrics['communication_score'] * 20 * 0.15
    )
    return score

# 等级划分
# A: 90-100
# B+: 85-89
# B: 80-84
# C: 70-79
# D: <70 (考虑淘汰)
```

### 价格竞争力评分 (0-10)
```python
def calculate_price_score(supplier_price, market_min, market_max):
    # 反向评分: 价格越低分数越高
    if supplier_price <= market_min:
        return 10
    elif supplier_price >= market_max:
        return 0
    else:
        # 线性插值
        score = 10 - ((supplier_price - market_min) / (market_max - market_min)) * 10
        return score
```

## 执行频率
- **每周**: 更新供应商绩效数据
- **每月**: 生成供应商评分卡和分析报告
- **每季度**: 深度审查和战略调整
- **实时**: 价格监控和警报

## 技术实现
```python
class SupplierInsightAgent:
    def __init__(self):
        self.suppliers = self.load_supplier_database()
        self.purchase_history = self.load_purchase_history()

    def calculate_performance_metrics(self, supplier_id):
        orders = self.get_supplier_orders(supplier_id)

        # 准时交付率
        on_time = sum(1 for o in orders if o['delivered_on_time']) / len(orders)

        # 质量合格率 (关联QC数据)
        qc_data = self.get_qc_data_for_supplier(supplier_id)
        pass_rate = qc_data['passed'] / qc_data['total']

        # 价格竞争力
        price_score = self.calculate_price_competitiveness(supplier_id)

        # 响应速度 (基于沟通记录)
        comm_score = self.calculate_communication_score(supplier_id)

        return {
            'on_time_delivery_rate': on_time,
            'quality_pass_rate': pass_rate,
            'price_competitiveness': price_score,
            'communication_score': comm_score
        }

    def generate_supplier_scorecard(self):
        scorecards = []

        for supplier in self.suppliers:
            metrics = self.calculate_performance_metrics(supplier['id'])
            overall_score = self.calculate_supplier_score(metrics)
            grade = self.assign_grade(overall_score)

            scorecards.append({
                'supplier': supplier['name'],
                'metrics': metrics,
                'overall_score': overall_score,
                'grade': grade
            })

        return scorecards

    def identify_risks(self, scorecards):
        risks = []

        # 单一供应商依赖
        for material in self.get_material_categories():
            suppliers = [s for s in scorecards if material in s['materials']]
            if len(suppliers) == 1:
                risks.append({
                    'risk': f'Single source for {material}',
                    'probability': 'High',
                    'impact': 'High',
                    'mitigation': f'Identify backup supplier for {material}'
                })

        # 低绩效供应商
        for card in scorecards:
            if card['overall_score'] < 75:
                risks.append({
                    'risk': f'Poor performance: {card["supplier"]}',
                    'score': card['overall_score'],
                    'recommendation': 'Phase out or improvement plan'
                })

        return risks

    def optimize_costs(self):
        opportunities = []

        # 批量采购机会
        for material, data in self.analyze_purchase_patterns().items():
            if data['order_frequency'] > 12:  # 每月订1次以上
                bulk_savings = self.calculate_bulk_discount(material, data)
                if bulk_savings > 0:
                    opportunities.append({
                        'opportunity': f'Bulk purchase {material}',
                        'annual_savings': bulk_savings,
                        'action': 'Negotiate volume discount'
                    })

        # 供应商整合
        duplicate_suppliers = self.find_duplicate_suppliers()
        for dup in duplicate_suppliers:
            consolidation_benefit = self.calculate_consolidation_benefit(dup)
            opportunities.append(consolidation_benefit)

        return opportunities

    def track_market_prices(self, material):
        # 爬取或API获取市场价格
        market_data = self.fetch_market_prices(material)

        trend = self.analyze_price_trend(market_data)

        return {
            'current_avg_price': np.mean([p['price'] for p in market_data]),
            'min_price': min(p['price'] for p in market_data),
            'max_price': max(p['price'] for p in market_data),
            'trend': trend,
            'forecast_6m': self.forecast_price(market_data)
        }
```

## 依赖
- 上游: QC Analyzer Agent (质量数据)
- 下游: Print Scheduler Agent (采购计划)
- 外部数据:
  - 供应商报价
  - 市场价格API/网站
  - 采购和收货记录

## 集成ERP系统
```python
# 从ERP获取采购订单
def fetch_purchase_orders(start_date, end_date):
    erp_api = ERPClient(api_key='...')
    pos = erp_api.get_purchase_orders(
        start_date=start_date,
        end_date=end_date,
        status='all'
    )
    return pos

# 更新收货质检结果
def update_receiving_quality(po_id, qc_result):
    erp_api.update_po_notes(
        po_id=po_id,
        notes=f"QC Pass Rate: {qc_result['pass_rate']}%"
    )
```

## 注意事项
1. 避免过度依赖单一供应商（至少2个备选）
2. 定期审查供应商合同和定价
3. 建立供应商改进计划(SIP)机制
4. 考虑地缘政治和汇率风险
5. 新供应商试用从小批量开始
6. 质量问题要及时反馈并跟踪整改
7. 价格波动时提前锁定批量订单
