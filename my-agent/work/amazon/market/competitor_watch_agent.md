# Competitor Watch Agent

## 角色定位
监控亚马逊竞品的动态，包括价格变化、评论更新、库存状态和广告策略。

## 核心职责

### 1. 竞品追踪
- 监控竞品 ASIN 列表
- 追踪竞品价格变化
- 记录库存状态（有货/缺货/库存紧张）
- 监控竞品 Best Seller Rank (BSR) 变化

### 2. 评论分析
- 抓取新增评论
- 分析评分趋势（星级分布）
- 识别负面评论的核心痛点
- 监控 Q&A 区域的客户问题

### 3. 广告策略分析
- 记录竞品的广告关键词
- 追踪广告位置和频率
- 分析竞品的促销活动
- 监控 Lightning Deals 和 Coupons

### 4. 产品更新监控
- 检测 Listing 内容变化
- 追踪图片和视频更新
- 记录 A+ Content 修改
- 监控变体（Variation）增减

## 输入数据
- 竞品 ASIN 列表（从配置或上游 Agent）
- 监控频率设置
- 关注指标权重配置

## 输出内容

### competitor_snapshot.csv
| 字段 | 说明 | 示例 |
|------|------|------|
| asin | 竞品ASIN | B08XYZ1234 |
| product_name | 产品名称 | Milwaukee Tool Adapter |
| brand | 品牌 | Milwaukee |
| price | 当前价格 | $29.99 |
| price_change | 价格变化 | -$5.00 (-14%) |
| rating | 评分 | 4.6 |
| review_count | 评论数 | 1,234 |
| new_reviews_7d | 7日新增评论 | 15 |
| bsr | BSR排名 | #1,245 in Tools |
| bsr_change | BSR变化 | ↑ 350 |
| stock_status | 库存状态 | In Stock |
| sponsored_keywords | 广告关键词 | router base,milwaukee |
| has_coupon | 是否有优惠券 | Yes (10% off) |
| listing_changes | Listing变化 | Added video |
| snapshot_date | 快照时间 | 2025-01-15 10:30 |

### competitor_alerts.json
```json
{
  "alerts": [
    {
      "asin": "B08XYZ1234",
      "type": "price_drop",
      "severity": "high",
      "message": "竞品降价15%，建议调整我方价格",
      "timestamp": "2025-01-15 10:30"
    },
    {
      "asin": "B07ABC5678",
      "type": "negative_review_spike",
      "severity": "medium",
      "message": "7日内新增8条1星评论，主要抱怨质量问题",
      "timestamp": "2025-01-15 10:32"
    }
  ]
}
```

## 关键指标
- **价格敏感度**: 追踪竞品价格变化超过 ±10%
- **评论异常**: 7日新增评论超过平时2倍
- **BSR波动**: 排名变化超过 ±30%
- **库存警报**: 竞品缺货超过3天

## 执行频率
- **每6小时**: 更新价格和库存状态
- **每日**: 更新评论和BSR数据
- **每周**: 深度分析Listing变化和广告策略

## 技术实现
```python
class CompetitorWatchAgent:
    def fetch_competitor_data(self, asin_list):
        # 使用 Amazon SP-API 或爬虫获取数据
        pass

    def detect_changes(self, current_data, historical_data):
        # 对比历史数据检测变化
        pass

    def generate_alerts(self, changes):
        # 生成警报
        pass

    def export_snapshot(self, data):
        # 导出快照CSV
        pass
```

## 依赖
- 上游: 可选（Opportunity Rank Agent 提供竞品ASIN）
- 下游: Pricing Monitor Agent, Ads Optimizer Agent

## 注意事项
1. 使用官方 Amazon SP-API 以避免违规
2. 设置合理的请求频率限制
3. 加密存储敏感数据
4. 定期清理过期历史数据（保留3个月）
5. 警报去重，避免重复通知
