# Makerworld Trend Agent

## 角色定位
负责监控和分析 Makerworld 平台的设计趋势，识别高潜力的 3D 打印产品机会。

## 核心职责

### 1. 趋势监控
- 爬取 Makerworld 热门设计排行榜
- 追踪设计的下载量、点赞数、评论数
- 识别快速上升的设计类目
- 监控设计师动态和新品发布

### 2. 数据分析
- 分析设计标签和关键词热度
- 计算趋势分数（综合下载量增速、互动率等）
- 识别季节性和节日性设计趋势
- 对比不同类目的增长潜力

### 3. 机会识别
- 筛选适合商业化的设计方向
- 评估设计的亚马逊销售潜力
- 识别市场空白和蓝海机会
- 标注设计的难易程度和成本

## 输入数据
- Makerworld API 或爬虫数据
- 历史趋势数据（用于对比）
- 类目配置和过滤规则

## 输出内容

### makerworld_trends.csv
| 字段 | 说明 | 示例 |
|------|------|------|
| model_id | 设计ID | 492838 |
| name | 设计名称 | Milwaukee M18 Router Base |
| designer | 设计师 | JohnDoe |
| category | 类目 | Tools & Hardware |
| downloads_7d | 7日下载量 | 1250 |
| downloads_30d | 30日下载量 | 4800 |
| likes | 点赞数 | 680 |
| comments | 评论数 | 45 |
| trend_score | 趋势分数(0-1) | 0.92 |
| growth_rate | 增长率 | +35% |
| tags | 标签 | milwaukee,router,adapter |
| price_potential | 价格潜力 | high/medium/low |
| amazon_opportunity | 亚马逊机会等级 | A/B/C/D |
| collection_date | 采集时间 | 2025-01-15 |

## 关键指标
- 趋势分数算法: `(downloads_7d * 0.4 + growth_rate * 0.3 + engagement_rate * 0.3)`
- 高潜力阈值: 趋势分数 > 0.7
- 机会等级:
  - A级: 高增长 + 低竞争 + 明确需求
  - B级: 中等增长 + 中等竞争
  - C级: 稳定增长 + 高竞争
  - D级: 增长缓慢或竞争激烈

## 执行频率
- **每日**: 更新热门榜单数据
- **每周**: 生成趋势分析报告
- **每月**: 深度分析类目变化

## 技术实现
```python
class MakerworldTrendAgent:
    def fetch_trending_designs(self):
        # 爬取热门设计
        pass

    def calculate_trend_score(self, design_data):
        # 计算趋势分数
        pass

    def identify_opportunities(self, trends):
        # 识别商业机会
        pass

    def export_to_csv(self, opportunities):
        # 导出 CSV
        pass
```

## 依赖
- 上游: 无（起始节点）
- 下游: Opportunity Rank Agent（消费输出数据）

## 注意事项
1. 遵守 Makerworld 的爬虫规则和 API 限制
2. 避免过度抓取导致 IP 被封
3. 定期更新趋势评分算法
4. 保留历史数据用于趋势对比
