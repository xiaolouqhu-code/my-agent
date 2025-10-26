# Cross Platform Agent

## 角色定位
跨平台趋势分析，整合 Makerworld、Printables、Thingiverse、Pinterest、TikTok 等平台数据，识别多平台共振的爆款信号。

## 核心职责

### 1. 多平台数据采集
- **3D设计平台**: Makerworld, Printables, Thingiverse
- **社交媒体**: Pinterest, TikTok, Instagram
- **电商平台**: Etsy, eBay (3D打印品类)
- **论坛社区**: Reddit (r/3Dprinting), Facebook Groups

### 2. 趋势聚合分析
- 识别多平台同时出现的热门关键词
- 追踪设计在不同平台的传播路径
- 分析跨平台的互动数据（分享、保存、评论）
- 检测病毒式传播的早期信号

### 3. 关键词挖掘
- 提取高频搜索词和标签
- 识别长尾关键词机会
- 分析关键词的季节性趋势
- 对比不同平台的关键词表现

### 4. 内容趋势分析
- 分析热门内容的共同特征
- 识别视觉风格和设计元素趋势
- 追踪 DIY 教程和使用场景
- 监控 KOL 和设计师的内容方向

## 输入数据
- 各平台 API 或爬虫数据
- 关键词列表和类目配置
- 历史趋势基线数据

## 输出内容

### cross_platform_trends.csv
| 字段 | 说明 | 示例 |
|------|------|------|
| keyword | 关键词/标签 | phone stand |
| makerworld_mentions | Makerworld提及次数 | 245 |
| printables_mentions | Printables提及次数 | 189 |
| pinterest_pins | Pinterest Pin数 | 1,250 |
| tiktok_views | TikTok总观看量 | 2.5M |
| etsy_listings | Etsy商品数量 | 3,420 |
| reddit_posts | Reddit帖子数 | 67 |
| trend_velocity | 趋势速度 | +85% (7d) |
| platform_coverage | 平台覆盖度 | 6/7 platforms |
| virality_score | 病毒性分数(0-1) | 0.88 |
| estimated_demand | 预估需求 | High |
| competition_level | 竞争程度 | Medium |
| analysis_date | 分析时间 | 2025-01-15 |

### platform_comparison.json
```json
{
  "keyword": "phone stand",
  "platforms": {
    "makerworld": {
      "total_designs": 245,
      "avg_downloads": 850,
      "top_design": "Adjustable Phone Stand",
      "growth_7d": "+12%"
    },
    "pinterest": {
      "total_pins": 1250,
      "avg_saves": 420,
      "trending_style": "minimalist wooden",
      "growth_7d": "+28%"
    },
    "tiktok": {
      "total_videos": 189,
      "total_views": 2500000,
      "avg_engagement": "4.2%",
      "top_creator": "@techDIYguru",
      "growth_7d": "+95%"
    }
  },
  "cross_platform_insights": {
    "common_themes": ["adjustable", "minimalist", "desk organizer"],
    "color_trends": ["black", "white", "natural wood"],
    "use_cases": ["WFH setup", "bedside", "car holder"],
    "price_range": "$12-$35"
  }
}
```

## 关键指标
- **病毒性分数**: 综合考虑增长速度、平台覆盖度、互动率
- **趋势速度**: 7日/30日增长率
- **平台共振**: 出现在3+平台的关键词优先级更高
- **需求估算**: 基于搜索量、商品数、互动数的综合评估

## 执行频率
- **每日**: 更新社交媒体和设计平台数据
- **每周**: 生成跨平台趋势报告
- **每月**: 深度分析季节性和长期趋势

## 技术实现
```python
class CrossPlatformAgent:
    def fetch_platform_data(self, platform, keywords):
        # 针对不同平台使用不同的API/爬虫
        pass

    def aggregate_trends(self, multi_platform_data):
        # 聚合多平台数据
        pass

    def calculate_virality_score(self, trend_data):
        # 计算病毒性分数
        # score = (growth_rate * 0.4) + (platform_coverage * 0.3) +
        #         (engagement_rate * 0.3)
        pass

    def identify_cross_platform_trends(self, aggregated_data):
        # 识别跨平台共振趋势
        pass

    def export_insights(self, trends):
        # 导出CSV和JSON
        pass
```

## 依赖
- 上游: Makerworld Trend Agent（提供基础设计数据）
- 下游: Opportunity Rank Agent（消费跨平台分析结果）

## API/数据源
- Pinterest API
- TikTok Research API
- Instagram Basic Display API
- Reddit API (PRAW)
- Printables/Thingiverse 爬虫
- Etsy API

## 注意事项
1. 各平台API有不同的速率限制，需要配置请求队列
2. 社交媒体数据存在时效性，优先处理最新数据
3. 关键词需要跨语言处理（英文为主，可扩展其他语言）
4. 避免被平台识别为爬虫，使用代理池和请求间隔
5. 定期更新平台列表和权重配置
