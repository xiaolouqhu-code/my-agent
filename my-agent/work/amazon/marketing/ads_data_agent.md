# Ads Data Agent

## 角色定位
从Amazon Ads API获取广告数据,监控PPC广告表现,识别高价值关键词和优化机会,为广告决策提供数据支持。

## 核心职责

### 1. 数据采集
- 拉取Sponsored Products广告数据
- 获取Search Term报告
- 采集竞争对手广告数据
- 收集广告位竞价数据

### 2. 关键词分析
- 识别高转化关键词
- 发现浪费预算的关键词
- 挖掘新关键词机会
- 分析搜索词与目标关键词匹配度

### 3. 广告表现监控
- 追踪ACOS (Advertising Cost of Sale)
- 计算ROAS (Return on Ad Spend)
- 监控CTR和转化率
- 分析不同广告活动ROI

### 4. 竞价分析
- 监控关键词CPC变化
- 识别竞价过高/过低关键词
- 预测最优竞价
- 分析竞价竞争态势

## 输入数据
- Amazon Ads API
- Sponsored Products Campaigns数据
- Search Term报告
- 广告组和关键词设置

## 输出内容

### ads_performance.csv
| Campaign | Ad Group | Keyword | Match Type | Impressions | Clicks | CTR | Orders | Sales | Spend | ACOS | ROAS | CPC | CVR |
|----------|----------|---------|------------|-------------|--------|-----|--------|-------|-------|------|------|-----|-----|
| SP-PhoneStand-Main | Exact-Primary | phone stand | Exact | 12,450 | 348 | 2.80% | 42 | $1,049.58 | $174.20 | 16.6% | 6.03 | $0.50 | 12.1% |
| SP-PhoneStand-Main | Exact-Primary | desk phone holder | Exact | 8,230 | 215 | 2.61% | 28 | $699.72 | $107.50 | 15.4% | 6.51 | $0.50 | 13.0% |
| SP-PhoneStand-Main | Broad-Discovery | phone stand adjustable | Broad | 18,950 | 284 | 1.50% | 15 | $374.85 | $142.00 | 37.9% | 2.64 | $0.50 | 5.3% |
| SP-PhoneStand-Main | Phrase-Mid | "rotating phone holder" | Phrase | 5,120 | 142 | 2.77% | 18 | $449.82 | $71.00 | 15.8% | 6.33 | $0.50 | 12.7% |

### search_term_analysis.csv
| Search Term | Keyword | Match Type | Impressions | Clicks | Orders | Sales | Spend | ACOS | Recommendation |
|-------------|---------|------------|-------------|--------|--------|-------|-------|------|----------------|
| phone stand for desk | phone stand | Broad | 3,240 | 98 | 14 | $349.86 | $49.00 | 14.0% | ✅ Add as Exact |
| best phone stand | phone stand | Broad | 5,120 | 156 | 8 | $199.92 | $78.00 | 39.0% | ⚠️ Add as Negative |
| cheap phone holder | phone stand | Broad | 2,850 | 87 | 2 | $49.98 | $43.50 | 87.0% | 🚫 Negative Exact |
| iphone 15 stand | phone stand | Broad | 1,980 | 45 | 7 | $174.93 | $22.50 | 12.9% | ✅ Add as Phrase |
| phone mount car | phone stand | Broad | 4,120 | 124 | 0 | $0.00 | $62.00 | ∞ | 🚫 Negative Exact |

### ads_insights.json
```json
{
  "report_id": "ADS-2025-W03",
  "date_range": "2025-01-09 to 2025-01-15",
  "generated_date": "2025-01-16",

  "overall_performance": {
    "total_spend": 1245.80,
    "total_sales": 8742.65,
    "total_orders": 350,
    "acos": "14.3%",
    "roas": 7.01,
    "target_acos": "15.0%",
    "status": "✅ Below Target (Good)",
    "avg_cpc": 0.48,
    "avg_cvr": "11.2%",
    "total_impressions": 125840,
    "total_clicks": 2595
  },

  "campaign_breakdown": [
    {
      "campaign_name": "SP-PhoneStand-Main",
      "budget": 50,
      "spend": 842.50,
      "sales": 6248.35,
      "orders": 250,
      "acos": "13.5%",
      "roas": 7.42,
      "impressions": 89420,
      "clicks": 1756,
      "ctr": "1.96%",
      "cvr": "14.2%",
      "performance": "Excellent - Scale up"
    },
    {
      "campaign_name": "SP-PhoneStand-Auto",
      "budget": 20,
      "spend": 285.30,
      "sales": 1749.45,
      "orders": 70,
      "acos": "16.3%",
      "roas": 6.13,
      "impressions": 24820,
      "clicks": 594,
      "ctr": "2.39%",
      "cvr": "11.8%",
      "performance": "Good - Monitor"
    },
    {
      "campaign_name": "SP-PhoneStand-Competitor",
      "budget": 15,
      "spend": 118.00,
      "sales": 744.85,
      "orders": 30,
      "acos": "15.8%",
      "roas": 6.31,
      "impressions": 11600,
      "clicks": 245,
      "ctr": "2.11%",
      "cvr": "12.2%",
      "performance": "Good - Slight increase"
    }
  ],

  "top_performing_keywords": [
    {
      "keyword": "phone stand",
      "match_type": "Exact",
      "impressions": 12450,
      "clicks": 348,
      "orders": 42,
      "sales": 1049.58,
      "spend": 174.20,
      "acos": "16.6%",
      "roas": 6.03,
      "cpc": 0.50,
      "cvr": "12.1%",
      "recommendation": "Maintain bid, high volume driver"
    },
    {
      "keyword": "desk phone holder",
      "match_type": "Exact",
      "impressions": 8230,
      "clicks": 215,
      "orders": 28,
      "sales": 699.72,
      "spend": 107.50,
      "acos": "15.4%",
      "roas": 6.51,
      "cpc": 0.50,
      "cvr": "13.0%",
      "recommendation": "Increase bid +10%, undervalued"
    }
  ],

  "underperforming_keywords": [
    {
      "keyword": "phone stand adjustable",
      "match_type": "Broad",
      "impressions": 18950,
      "clicks": 284,
      "orders": 15,
      "sales": 374.85,
      "spend": 142.00,
      "acos": "37.9%",
      "roas": 2.64,
      "cpc": 0.50,
      "cvr": "5.3%",
      "issue": "High ACOS, low conversion",
      "recommendation": "Reduce bid -30% or pause"
    },
    {
      "keyword": "smartphone holder",
      "match_type": "Phrase",
      "impressions": 6840,
      "clicks": 156,
      "orders": 5,
      "sales": 124.95,
      "spend": 78.00,
      "acos": "62.4%",
      "roas": 1.60,
      "cpc": 0.50,
      "cvr": "3.2%",
      "issue": "Very high ACOS",
      "recommendation": "Pause immediately"
    }
  ],

  "search_term_opportunities": [
    {
      "search_term": "phone stand for desk",
      "current_keyword": "phone stand (Broad)",
      "performance": {
        "impressions": 3240,
        "clicks": 98,
        "orders": 14,
        "sales": 349.86,
        "spend": 49.00,
        "acos": "14.0%",
        "cvr": "14.3%"
      },
      "recommendation": {
        "action": "Add as Exact Match keyword",
        "suggested_bid": 0.55,
        "rationale": "High CVR, low ACOS, strong intent",
        "priority": "High"
      }
    },
    {
      "search_term": "iphone 15 stand",
      "current_keyword": "phone stand (Broad)",
      "performance": {
        "impressions": 1980,
        "clicks": 45,
        "orders": 7,
        "sales": 174.93,
        "spend": 22.50,
        "acos": "12.9%",
        "cvr": "15.6%"
      },
      "recommendation": {
        "action": "Add as Phrase Match \"iphone stand\"",
        "suggested_bid": 0.52,
        "rationale": "Excellent CVR and ACOS, brand-specific traffic",
        "priority": "High"
      }
    }
  ],

  "negative_keyword_suggestions": [
    {
      "search_term": "best phone stand",
      "reason": "High spend ($78), high ACOS (39%), informational intent",
      "current_acos": "39.0%",
      "recommendation": "Add as Phrase Negative",
      "estimated_savings": "$45/week"
    },
    {
      "search_term": "cheap phone holder",
      "reason": "Very high ACOS (87%), price-sensitive shoppers",
      "current_acos": "87.0%",
      "recommendation": "Add as Exact Negative",
      "estimated_savings": "$32/week"
    },
    {
      "search_term": "phone mount car",
      "reason": "Zero conversions, wrong product category",
      "current_acos": "∞",
      "recommendation": "Add as Exact Negative",
      "estimated_savings": "$62/week"
    }
  ],

  "bid_optimization_suggestions": [
    {
      "keyword": "desk phone holder",
      "current_bid": 0.50,
      "suggested_bid": 0.55,
      "change": "+10%",
      "rationale": "ACOS 15.4% below target, high CVR 13%, likely losing impression share",
      "estimated_impact": "+15% impressions, +$180 sales/week"
    },
    {
      "keyword": "phone stand adjustable",
      "current_bid": 0.50,
      "suggested_bid": 0.35,
      "change": "-30%",
      "rationale": "ACOS 37.9% way above target, poor CVR 5.3%",
      "estimated_impact": "Save $40/week, minimal sales loss"
    }
  ],

  "dayparting_analysis": {
    "best_hours": [
      {"hour": "20:00-21:00", "cvr": "15.2%", "acos": "12.8%", "note": "Evening prime time"},
      {"hour": "12:00-13:00", "cvr": "14.1%", "acos": "13.5%", "note": "Lunch break"},
      {"hour": "09:00-10:00", "cvr": "13.8%", "acos": "14.2%", "note": "Morning work start"}
    ],
    "worst_hours": [
      {"hour": "03:00-04:00", "cvr": "6.2%", "acos": "28.4%", "note": "Late night low intent"},
      {"hour": "02:00-03:00", "cvr": "5.8%", "acos": "31.2%", "note": "Very low quality traffic"}
    ],
    "recommendation": "Consider dayparting: reduce bids 50% during 1am-5am"
  },

  "competitor_insights": {
    "avg_competitor_bid_estimate": 0.52,
    "our_avg_bid": 0.48,
    "impression_share_estimate": "35-40%",
    "top_of_search_share": "18%",
    "recommendation": "Slightly below market, consider +5% bid increase for top keywords"
  },

  "budget_recommendations": {
    "sp_phonestand_main": {
      "current_budget": 50,
      "actual_spend_avg": 120,
      "status": "Budget capped - losing sales",
      "recommended_budget": 150,
      "estimated_additional_sales": 1250,
      "roi_of_increase": "8.3x"
    }
  }
}
```

## 关键指标定义

### ACOS (Advertising Cost of Sale)
```
ACOS = Ad Spend / Ad Sales × 100%

目标ACOS通常为:
- 新品推广: 25-35%
- 成熟产品: 15-20%
- 利润优化: <15%
```

### ROAS (Return on Ad Spend)
```
ROAS = Ad Sales / Ad Spend

ROAS = 1 / ACOS
例如: ACOS 20% → ROAS = 5.0
```

### TACoS (Total Advertising Cost of Sale)
```
TACoS = Ad Spend / Total Sales × 100%

包含有机销售,衡量广告对整体业务的影响
```

## 执行频率
- **每小时**: 实时监控关键广告活动
- **每日**: 更新广告数据,生成日报
- **每周**: 深度分析,生成优化建议
- **每月**: 战略review和长期趋势分析

## 技术实现
```python
from sp_api.api import Reports
import pandas as pd

class AdsDataAgent:
    def __init__(self, ads_api_client):
        self.ads_api = ads_api_client

    def fetch_sponsored_products_data(self, date_range):
        # 使用Amazon Ads API获取数据
        report = self.ads_api.request_report(
            recordType='campaigns',
            reportDate=date_range,
            metrics='impressions,clicks,cost,sales,orders'
        )

        # 解析报告
        data = self._parse_ads_report(report)
        return data

    def analyze_search_terms(self, search_term_report):
        df = pd.DataFrame(search_term_report)

        # 计算关键指标
        df['acos'] = df['spend'] / df['sales']
        df['cvr'] = df['orders'] / df['clicks']
        df['cpc'] = df['spend'] / df['clicks']

        # 识别机会
        opportunities = df[
            (df['acos'] < 0.20) &
            (df['orders'] >= 5) &
            (df['search_term'].notna())
        ].sort_values('sales', ascending=False)

        # 识别浪费
        waste = df[
            (df['acos'] > 0.35) |
            ((df['clicks'] > 20) & (df['orders'] == 0))
        ].sort_values('spend', ascending=False)

        return {
            'opportunities': opportunities.to_dict('records'),
            'waste': waste.to_dict('records')
        }

    def generate_negative_keyword_suggestions(self, search_terms):
        suggestions = []

        for term in search_terms:
            # 高花费低转化
            if term['spend'] > 20 and term['acos'] > 0.40:
                suggestions.append({
                    'search_term': term['query'],
                    'reason': f"High ACOS {term['acos']:.1%}, spent ${term['spend']}",
                    'match_type': 'phrase',
                    'priority': 'high'
                })

            # 完全无转化
            if term['clicks'] > 10 and term['orders'] == 0:
                suggestions.append({
                    'search_term': term['query'],
                    'reason': f"{term['clicks']} clicks, zero conversions",
                    'match_type': 'exact',
                    'priority': 'medium'
                })

        return suggestions

    def optimize_bids(self, keyword_performance):
        recommendations = []

        for kw in keyword_performance:
            current_bid = kw['bid']
            acos = kw['acos']
            target_acos = 0.15

            # 简化的竞价优化逻辑
            if acos < target_acos * 0.8:  # ACOS显著低于目标
                # 提高竞价争取更多流量
                suggested_bid = current_bid * 1.10
                action = "Increase bid +10%"
            elif acos > target_acos * 1.3:  # ACOS显著高于目标
                # 降低竞价减少浪费
                suggested_bid = current_bid * 0.80
                action = "Decrease bid -20%"
            else:
                suggested_bid = current_bid
                action = "Maintain current bid"

            recommendations.append({
                'keyword': kw['keyword'],
                'current_bid': current_bid,
                'suggested_bid': round(suggested_bid, 2),
                'action': action,
                'acos': acos
            })

        return recommendations
```

## Amazon Ads API集成
```python
from ad_api.api.sp import Campaigns, AdGroups, Keywords

# 初始化API客户端
def init_ads_api():
    return {
        'campaigns': Campaigns(
            account='ENTITY_ID',
            credentials=dict(
                refresh_token='Atzr|...',
                client_id='amzn1.application-oa2-client...',
                client_secret='...'
            ),
            marketplace=Marketplaces.US
        )
    }

# 获取广告活动数据
def get_campaign_metrics(start_date, end_date):
    campaigns_api = Campaigns(...)
    metrics = campaigns_api.get_campaigns_metrics(
        startDate=start_date,
        endDate=end_date
    )
    return metrics
```

## 依赖
- 上游: Listing Builder Agent (关键词来源)
- 下游: Ads Optimizer Agent (消费分析结果)
- 外部API: Amazon Advertising API

## 数据仓库集成
所有广告数据应存入Data Warehouse用于长期分析:
```python
def export_to_warehouse(ads_data):
    # 导出到BigQuery/Redshift/Snowflake
    warehouse.insert('ads_performance_daily', ads_data)

    # 便于后续BI分析和ML模型训练
```

## 注意事项
1. Amazon Ads API有速率限制,注意请求频率
2. 报告通常有2-24小时延迟
3. 周末数据可能不完整,周一更新
4. ACOS目标需根据产品利润率设定
5. 新品前30天数据波动大,谨慎优化
6. 季节性因素影响CTR和CVR
