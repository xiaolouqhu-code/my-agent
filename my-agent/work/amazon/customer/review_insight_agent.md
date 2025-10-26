# Review Insight Agent

## 角色定位
分析产品评论和Q&A,提取客户洞察,识别产品问题和改进机会,为产品优化和客服提供数据支持。

## 核心职责

### 1. 评论分析
- 采集和分类产品评论
- 情感分析(正面/负面/中性)
- 提取核心主题和关键词
- 识别评论趋势变化

### 2. 问题识别
- 发现产品缺陷和痛点
- 追踪负面评论模式
- 识别质量问题根源
- 预警评分下降风险

### 3. 机会挖掘
- 发现客户未满足需求
- 识别产品改进方向
- 提取Listing优化建议
- 发现交叉销售机会

### 4. 竞品对比
- 分析竞品评论优劣势
- 对比客户满意度
- 学习竞品解决方案
- 识别差异化机会

## 输入数据
- Amazon SP-API (评论和Q&A)
- 产品ASIN列表
- 竞品ASIN列表
- 历史评论数据

## 输出内容

### review_insights.json
```json
{
  "report_id": "REVIEW-2025-01-16",
  "generated_date": "2025-01-16",
  "period": "Last 30 days",

  "overall_metrics": {
    "total_reviews": 145,
    "avg_rating": 4.6,
    "rating_trend": "+0.1 vs last 30d",
    "review_velocity": "4.8 reviews/day",
    "sentiment_breakdown": {
      "positive": "82%",
      "neutral": "12%",
      "negative": "6%"
    },
    "verified_purchase_rate": "94%"
  },

  "rating_distribution": {
    "5_star": {"count": 98, "percentage": "67.6%"},
    "4_star": {"count": 28, "percentage": "19.3%"},
    "3_star": {"count": 11, "percentage": "7.6%"},
    "2_star": {"count": 4, "percentage": "2.8%"},
    "1_star": {"count": 4, "percentage": "2.8%"}
  },

  "review_themes": [
    {
      "theme": "Stability & Quality",
      "sentiment": "Positive",
      "frequency": 89,
      "percentage": "61%",
      "sample_quotes": [
        "Very stable, doesn't wobble at all",
        "High quality materials, feels premium",
        "Weighted base keeps it secure"
      ],
      "keywords": ["stable", "quality", "sturdy", "premium", "solid"]
    },
    {
      "theme": "360° Rotation",
      "sentiment": "Positive",
      "frequency": 72,
      "percentage": "50%",
      "sample_quotes": [
        "Smooth 360 rotation is perfect",
        "Love the flexibility of angles",
        "Easy to adjust with one hand"
      ],
      "keywords": ["rotation", "smooth", "flexible", "adjustable", "360"]
    },
    {
      "theme": "Cable Management",
      "sentiment": "Positive",
      "frequency": 58,
      "percentage": "40%",
      "sample_quotes": [
        "Cable management is genius",
        "Keeps my desk organized",
        "No more tangled cables"
      ],
      "keywords": ["cable", "organized", "clean", "management", "tidy"]
    },
    {
      "theme": "Size / Compatibility",
      "sentiment": "Mixed",
      "frequency": 24,
      "percentage": "17%",
      "sample_quotes": [
        "Perfect for my iPhone 15 Pro Max",
        "Struggled to fit my phone with thick case",
        "Works great with most phones"
      ],
      "keywords": ["size", "fit", "case", "compatibility", "tight"],
      "issues_identified": [
        "Some users with thick cases have difficulty",
        "Tablet users want wider grip"
      ]
    },
    {
      "theme": "Assembly / Instructions",
      "sentiment": "Negative",
      "frequency": 12,
      "percentage": "8%",
      "sample_quotes": [
        "Instructions were unclear",
        "Took me 15 minutes to figure out",
        "No video tutorial"
      ],
      "keywords": ["instructions", "confusing", "assembly", "unclear"],
      "issues_identified": [
        "Assembly instructions need improvement",
        "Video tutorial requested"
      ]
    }
  ],

  "pain_points": [
    {
      "issue": "Thick Phone Cases Compatibility",
      "severity": "Medium",
      "frequency": 12,
      "impact_on_rating": "-0.3 stars (estimate)",
      "sample_reviews": [
        {"rating": 3, "text": "Good stand but barely fits my Otterbox case", "verified": true},
        {"rating": 2, "text": "Had to remove my case to use it", "verified": true}
      ],
      "recommendation": {
        "action": "Product improvement",
        "solution": "Widen grip arms by 2-3mm in next version",
        "priority": "High",
        "estimated_impact": "+0.2 stars, reduce 3-star reviews 40%"
      }
    },
    {
      "issue": "Unclear Assembly Instructions",
      "severity": "Low",
      "frequency": 8,
      "impact_on_rating": "-0.1 stars",
      "sample_reviews": [
        {"rating": 4, "text": "Great product but instructions could be clearer", "verified": true}
      ],
      "recommendation": {
        "action": "Listing improvement",
        "solution": "Add assembly video to listing images, improve insert card",
        "priority": "Medium",
        "estimated_cost": "$150 (video production)"
      }
    }
  ],

  "positive_highlights": [
    {
      "strength": "Build Quality & Stability",
      "frequency": 89,
      "impact": "+0.5 stars (estimate)",
      "usage_in_marketing": "Emphasize 'premium PETG material' and 'weighted base' in ads"
    },
    {
      "strength": "360° Smooth Rotation",
      "frequency": 72,
      "impact": "+0.3 stars",
      "usage_in_marketing": "Create video showcasing rotation mechanism"
    },
    {
      "strength": "Cable Management",
      "frequency": 58,
      "impact": "+0.2 stars",
      "usage_in_marketing": "Before/after desk organization photo in listing"
    }
  ],

  "feature_requests": [
    {
      "request": "Wider grip for tablets",
      "frequency": 7,
      "votes": 23,
      "business_case": "New product opportunity: Tablet version at $34.99",
      "priority": "Medium"
    },
    {
      "request": "More color options (white, silver)",
      "frequency": 12,
      "votes": 45,
      "business_case": "Expand to 3 colors: Black, White, Space Gray",
      "priority": "High"
    },
    {
      "request": "Built-in wireless charging",
      "frequency": 5,
      "votes": 18,
      "business_case": "Premium version at $49.99 with Qi charging",
      "priority": "Low (complex, high cost)"
    }
  ],

  "competitive_comparison": {
    "our_product": {
      "asin": "B08XYZ1234",
      "rating": 4.6,
      "review_count": 1234,
      "top_complaints": ["Thick case fit", "Instructions"],
      "top_praises": ["Stability", "Rotation", "Cable management"]
    },
    "competitors": [
      {
        "asin": "B07ABC5678",
        "name": "CompetitorA Stand",
        "rating": 4.5,
        "review_count": 2340,
        "top_complaints": ["Wobbles", "Cheap plastic", "Paint peeling"],
        "top_praises": ["Price", "Looks nice"],
        "our_advantage": "We have better stability and build quality"
      },
      {
        "asin": "B09DEF1234",
        "name": "CompetitorB Premium Stand",
        "rating": 4.7,
        "review_count": 890,
        "top_complaints": ["Expensive", "Heavy"],
        "top_praises": ["Excellent quality", "Smooth rotation", "Premium feel"],
        "our_advantage": "Similar quality at 30% lower price"
      }
    ],
    "differentiation_opportunities": [
      "Emphasize stability vs CompetitorA",
      "Position as 'premium quality at mid-tier price'",
      "Highlight cable management (unique feature)"
    ]
  },

  "review_velocity_trend": [
    {"date": "2025-01-09", "reviews": 4, "avg_rating": 4.5},
    {"date": "2025-01-10", "reviews": 6, "avg_rating": 4.8},
    {"date": "2025-01-11", "reviews": 5, "avg_rating": 4.6},
    {"date": "2025-01-12", "reviews": 4, "avg_rating": 4.4},
    {"date": "2025-01-13", "reviews": 7, "avg_rating": 4.7}
  ],

  "alerts": [
    {
      "type": "Potential Issue",
      "severity": "Low",
      "message": "3 reviews in past week mention 'case fit' issue",
      "action": "Monitor, consider product adjustment if frequency increases",
      "status": "Monitoring"
    }
  ],

  "action_items": [
    {
      "priority": "High",
      "action": "Add assembly video to listing",
      "owner": "Marketing",
      "estimated_impact": "Reduce 4-star 'instruction' complaints by 60%",
      "cost": "$150",
      "timeline": "1 week"
    },
    {
      "priority": "High",
      "action": "Develop white and gray color variants",
      "owner": "Product",
      "estimated_impact": "+30% TAM, requested by 12% of reviewers",
      "cost": "$500 (design + testing)",
      "timeline": "4 weeks"
    },
    {
      "priority": "Medium",
      "action": "Improve grip width by 2mm for next batch",
      "owner": "Product",
      "estimated_impact": "Reduce case-fit complaints 80%",
      "cost": "$200 (design adjustment)",
      "timeline": "Next production run"
    }
  ]
}
```

### review_summary.csv
| Date | Total Reviews | 5★ | 4★ | 3★ | 2★ | 1★ | Avg Rating | Sentiment | Top Theme |
|------|---------------|----|----|----|----|----|-----------|-----------| |
| 2025-01-16 | 5 | 4 | 1 | 0 | 0 | 0 | 4.8 | Positive | Stability |
| 2025-01-15 | 6 | 4 | 1 | 1 | 0 | 0 | 4.5 | Positive | Rotation |
| 2025-01-14 | 4 | 2 | 2 | 0 | 0 | 0 | 4.5 | Positive | Quality |

## AI分析实现

### 使用Claude/GPT进行主题提取
```python
def analyze_reviews_with_ai(reviews):
    # 准备评论文本
    review_texts = [r['text'] for r in reviews]
    combined = "\n\n".join(review_texts[:50])  # 分析最近50条

    prompt = f"""
    分析以下Amazon产品评论,提取核心主题和洞察。

    评论内容:
    {combined}

    请提供:
    1. 主要主题(至少5个,按频率排序)
    2. 每个主题的情感倾向(正面/负面/中性)
    3. 产品痛点和改进建议
    4. 客户最喜欢的特性
    5. 功能需求建议

    返回JSON格式。
    """

    response = openai.chat.completions.create(
        model="gpt-4-turbo",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )

    insights = json.loads(response.choices[0].message.content)
    return insights
```

## 执行频率
- **每日**: 采集新评论,更新指标
- **每周**: 深度分析,生成洞察报告
- **实时**: 监控负面评论,触发警报

## 技术实现
```python
class ReviewInsightAgent:
    def __init__(self, sp_api, ai_client):
        self.sp_api = sp_api
        self.ai = ai_client

    def fetch_reviews(self, asin, days=30):
        # 使用SP-API或爬虫获取评论
        reviews = []
        # ... API调用
        return reviews

    def analyze_sentiment(self, review_text):
        # 简单情感分析
        from textblob import TextBlob
        blob = TextBlob(review_text)
        polarity = blob.sentiment.polarity

        if polarity > 0.3:
            return "Positive"
        elif polarity < -0.3:
            return "Negative"
        else:
            return "Neutral"

    def extract_themes(self, reviews):
        # 使用AI提取主题
        insights = self.analyze_reviews_with_ai(reviews)
        return insights['themes']

    def identify_pain_points(self, reviews):
        # 筛选负面和中性评论
        negative_reviews = [r for r in reviews if r['rating'] <= 3]

        # 使用AI分析
        pain_points = self.ai_analyze_pain_points(negative_reviews)

        return pain_points

    def generate_insights(self, asin):
        # 1. 获取评论
        reviews = self.fetch_reviews(asin)

        # 2. 基础统计
        metrics = self._calculate_metrics(reviews)

        # 3. 主题提取
        themes = self.extract_themes(reviews)

        # 4. 痛点识别
        pain_points = self.identify_pain_points(reviews)

        # 5. 竞品对比
        competitor_analysis = self.compare_with_competitors(asin)

        # 6. 生成行动建议
        action_items = self._generate_action_items(pain_points, themes)

        # 7. 导出
        insights = {
            'overall_metrics': metrics,
            'review_themes': themes,
            'pain_points': pain_points,
            'competitive_comparison': competitor_analysis,
            'action_items': action_items
        }

        self.export_json(insights, 'review_insights.json')
        return insights
```

## 依赖
- 上游: 无(直接从Amazon获取)
- 下游: CS Reply Agent, Product Brief Agent
- AI: OpenRouter / OpenAI API
- NLP库: TextBlob, NLTK, spaCy

## 警报配置
```yaml
review_alerts:
  rating_drop:
    condition: "avg_rating_7d < avg_rating_30d - 0.3"
    action: "urgent notification"

  negative_spike:
    condition: "1_star_reviews_24h >= 3"
    action: "investigate immediately"

  recurring_complaint:
    condition: "same_issue_mentioned >= 5 times in 7d"
    action: "notify product team"
```

## 注意事项
1. 遵守Amazon服务条款,使用官方API
2. 负面评论需快速响应
3. 定期校准AI分析准确性
4. 关注竞品评论获取灵感
5. 将洞察反馈到产品改进循环
