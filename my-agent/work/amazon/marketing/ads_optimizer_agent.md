# Ads Optimizer Agent

## 角色定位
基于Ads Data Agent的分析结果,自动执行广告优化操作,包括调整竞价、添加/暂停关键词、优化广告活动,最大化广告ROI。

## 核心职责

### 1. 自动竞价优化
- 根据ACOS自动调整关键词竞价
- 动态调整广告活动预算
- 实施dayparting策略
- 优化placement竞价修饰符

### 2. 关键词管理
- 自动添加高价值搜索词为关键词
- 暂停或删除低效关键词
- 添加否定关键词
- 调整关键词匹配类型

### 3. 广告活动优化
- 创建新广告活动和广告组
- 优化广告活动结构
- A/B测试不同策略
- 自动化规则执行

### 4. 产品定位优化
- 调整产品广告位置(Top of Search vs Rest of Search)
- 优化Product Targeting
- 竞品ASIN定位
- 类目定位策略

## 输入数据
- `ads_insights.json` (Ads Data Agent)
- `ads_performance.csv`
- 优化规则配置
- 历史优化效果数据

## 输出内容

### optimization_actions.json
```json
{
  "optimization_run_id": "OPT-2025-01-16-001",
  "executed_date": "2025-01-16 10:30:00",
  "mode": "auto",

  "actions_executed": [
    {
      "action_id": "ACT-001",
      "type": "bid_adjustment",
      "target": {
        "campaign": "SP-PhoneStand-Main",
        "ad_group": "Exact-Primary",
        "keyword": "desk phone holder",
        "match_type": "Exact"
      },
      "change": {
        "old_bid": 0.50,
        "new_bid": 0.55,
        "change_pct": "+10%"
      },
      "rationale": "ACOS 15.4% below target 20%, high CVR 13.0%, likely losing impression share",
      "expected_impact": "+15% impressions, +$25/day sales",
      "status": "Executed",
      "api_response": "Success"
    },
    {
      "action_id": "ACT-002",
      "type": "keyword_pause",
      "target": {
        "campaign": "SP-PhoneStand-Main",
        "ad_group": "Broad-Discovery",
        "keyword": "smartphone holder",
        "match_type": "Phrase"
      },
      "change": {
        "old_status": "Enabled",
        "new_status": "Paused"
      },
      "rationale": "ACOS 62.4% way above target, CVR only 3.2%, spent $78 with minimal return",
      "expected_impact": "Save $78/week",
      "status": "Executed",
      "api_response": "Success"
    },
    {
      "action_id": "ACT-003",
      "type": "add_keyword",
      "target": {
        "campaign": "SP-PhoneStand-Main",
        "ad_group": "Exact-Primary"
      },
      "new_keyword": {
        "keyword": "phone stand for desk",
        "match_type": "Exact",
        "bid": 0.55
      },
      "rationale": "Search term showed excellent performance: 14% ACOS, 14.3% CVR, $350 sales from broad match",
      "source": "Search term report",
      "expected_impact": "+$50/day sales at 14% ACOS",
      "status": "Executed",
      "api_response": "Success"
    },
    {
      "action_id": "ACT-004",
      "type": "add_negative_keyword",
      "target": {
        "campaign": "SP-PhoneStand-Main",
        "negative_match_type": "Phrase"
      },
      "negative_keyword": "cheap",
      "rationale": "Search terms with 'cheap' showed 87% ACOS, attracting price-sensitive shoppers",
      "expected_impact": "Save $32/week",
      "status": "Executed",
      "api_response": "Success"
    },
    {
      "action_id": "ACT-005",
      "type": "budget_increase",
      "target": {
        "campaign": "SP-PhoneStand-Main"
      },
      "change": {
        "old_budget": 50,
        "new_budget": 75,
        "change_pct": "+50%"
      },
      "rationale": "Campaign consistently hitting budget cap, ACOS 13.5% well below target, ROAS 7.42",
      "expected_impact": "+$300/day sales, maintain 14% ACOS",
      "status": "Executed",
      "api_response": "Success"
    },
    {
      "action_id": "ACT-006",
      "type": "placement_modifier",
      "target": {
        "campaign": "SP-PhoneStand-Main",
        "placement": "Top of Search"
      },
      "change": {
        "old_modifier": "0%",
        "new_modifier": "+20%"
      },
      "rationale": "Top of Search CVR 16.8% vs Rest of Search 9.2%, worth premium bid",
      "expected_impact": "Increase Top of Search share, +$40/day sales",
      "status": "Executed",
      "api_response": "Success"
    },
    {
      "action_id": "ACT-007",
      "type": "create_campaign",
      "new_campaign": {
        "name": "SP-PhoneStand-BrandDefense",
        "type": "Sponsored Products",
        "targeting_type": "Manual",
        "daily_budget": 20,
        "start_date": "2025-01-17"
      },
      "rationale": "Competitors bidding on our brand name, need defensive campaign",
      "initial_keywords": [
        {"keyword": "progrip phone stand", "match_type": "Exact", "bid": 0.30},
        {"keyword": "progrip", "match_type": "Exact", "bid": 0.25}
      ],
      "expected_impact": "Protect brand traffic, 8-10% ACOS",
      "status": "Executed",
      "api_response": "Success"
    }
  ],

  "actions_reviewed_not_executed": [
    {
      "action_id": "REV-001",
      "type": "bid_adjustment",
      "target": {
        "keyword": "phone stand",
        "current_bid": 0.50
      },
      "proposed_change": {
        "new_bid": 0.65,
        "change_pct": "+30%"
      },
      "reason_not_executed": "Change exceeds 25% threshold, requires manual approval",
      "recommendation": "Review and approve manually if desired",
      "status": "Pending Manual Review"
    }
  ],

  "summary": {
    "total_actions_proposed": 8,
    "actions_executed": 7,
    "actions_pending_review": 1,
    "actions_failed": 0,
    "estimated_weekly_savings": 110,
    "estimated_weekly_revenue_increase": 420,
    "net_impact": "+$310/week profit"
  },

  "next_optimization_scheduled": "2025-01-17 10:30:00"
}
```

### optimization_rules.yml (配置文件)
```yaml
optimization_rules:
  enabled: true
  mode: "auto"  # auto, review, manual
  run_frequency: "daily"
  run_time: "10:30"

  bid_optimization:
    enabled: true
    min_data_points: 20  # 至少20次点击才调整
    max_bid_change_pct: 25  # 单次最多调整25%
    min_bid: 0.20
    max_bid: 3.00

    increase_bid_if:
      - condition: "acos < target_acos * 0.80"
        action: "increase 10%"
        rationale: "Performance good, scale up"
      - condition: "cvr > 15% AND acos < target_acos"
        action: "increase 15%"
        rationale: "Excellent conversion, likely losing share"

    decrease_bid_if:
      - condition: "acos > target_acos * 1.30"
        action: "decrease 20%"
        rationale: "Too expensive, reduce spend"
      - condition: "clicks > 30 AND orders == 0"
        action: "decrease 30%"
        rationale: "No conversions, bad match"

  keyword_management:
    add_keyword_if:
      - condition: "search_term with sales > $100 AND acos < 25%"
        action: "add as Exact match"
        bid_strategy: "match_bid * 1.05"

      - condition: "search_term with orders >= 5 AND acos < target_acos"
        action: "add as Phrase match"
        bid_strategy: "cpc_avg"

    pause_keyword_if:
      - condition: "acos > 50% AND spend > $50"
        action: "pause immediately"

      - condition: "clicks > 50 AND orders == 0"
        action: "pause after 7 days"

    negative_keyword_if:
      - condition: "search_term with spend > $30 AND acos > 45%"
        action: "add as Phrase negative"

      - condition: "search_term with clicks > 15 AND orders == 0"
        action: "add as Exact negative"

  budget_optimization:
    increase_budget_if:
      - condition: "budget_consumed > 90% AND acos < target_acos"
        action: "increase 25%"
        max_budget: 200

    decrease_budget_if:
      - condition: "budget_consumed < 60% for 7 days"
        action: "decrease 20%"

  campaign_management:
    create_campaign_for:
      - trigger: "new_product_launched"
        template: "new_product_template"

      - trigger: "competitor_bidding_on_brand"
        template: "brand_defense_template"

  safety_limits:
    max_daily_spend_change: 100  # 最多增加$100/天预算
    max_keywords_added_per_day: 20
    max_bid_increase_per_keyword: 0.50
    require_approval_if:
      - "bid_change > 25%"
      - "budget_change > $50"
      - "campaign_creation"

  notifications:
    email: ["ads-team@company.com"]
    slack_webhook: "https://hooks.slack.com/..."
    notify_on:
      - "optimization_completed"
      - "action_requires_approval"
      - "api_error"
      - "budget_limit_reached"
```

### optimization_history.csv (历史记录)
| Date | Action Type | Target | Old Value | New Value | Rationale | Impact (7d) | Status |
|------|-------------|--------|-----------|-----------|-----------|-------------|--------|
| 2025-01-16 | Bid Increase | desk phone holder | $0.50 | $0.55 | Low ACOS, high CVR | +$180 sales | Success |
| 2025-01-16 | Keyword Pause | smartphone holder | Enabled | Paused | High ACOS 62% | -$78 waste | Success |
| 2025-01-16 | Add Keyword | phone stand for desk | - | $0.55 | High value search term | +$350 sales | Success |
| 2025-01-15 | Budget Increase | SP-Main Campaign | $50 | $75 | Budget capped | +$420 sales | Success |

## 优化策略

### 1. 基于ACOS的竞价优化
```python
def optimize_bid_by_acos(keyword_data, target_acos):
    current_acos = keyword_data['acos']
    current_bid = keyword_data['bid']

    if current_acos < target_acos * 0.75:
        # ACOS远低于目标,提价争取更多流量
        new_bid = current_bid * 1.15
        action = "increase"

    elif current_acos < target_acos * 0.90:
        # ACOS略低于目标,小幅提价
        new_bid = current_bid * 1.05
        action = "increase"

    elif current_acos > target_acos * 1.30:
        # ACOS远高于目标,降价减少浪费
        new_bid = current_bid * 0.80
        action = "decrease"

    elif current_acos > target_acos * 1.10:
        # ACOS略高于目标,小幅降价
        new_bid = current_bid * 0.95
        action = "decrease"

    else:
        # ACOS在目标范围内,保持
        new_bid = current_bid
        action = "maintain"

    return new_bid, action
```

### 2. 搜索词挖掘
```python
def harvest_search_terms(search_term_report, target_acos):
    candidates = []

    for term in search_term_report:
        # 高价值搜索词
        if (term['sales'] > 100 and
            term['acos'] < target_acos * 1.2 and
            term['orders'] >= 3):

            candidates.append({
                'search_term': term['query'],
                'recommended_match_type': 'Exact',
                'suggested_bid': term['cpc'] * 1.05,
                'reason': f"High value: ${term['sales']}, good ACOS {term['acos']:.1%}"
            })

    return candidates
```

## 执行频率
- **每日**: 自动执行优化操作(如启用auto mode)
- **每周**: 深度review和策略调整
- **实时**: 监控预算消耗,动态调整

## 技术实现
```python
from sp_api.api.advertising import Campaigns, Keywords

class AdsOptimizerAgent:
    def __init__(self, ads_api, rules_config):
        self.ads_api = ads_api
        self.rules = rules_config

    def run_optimization(self, ads_insights):
        actions_executed = []
        actions_review = []

        # 1. 竞价优化
        bid_actions = self._optimize_bids(ads_insights['keyword_performance'])
        actions_executed.extend(self._execute_actions(bid_actions))

        # 2. 添加新关键词
        new_keywords = self._harvest_search_terms(ads_insights['search_term_opportunities'])
        actions_executed.extend(self._add_keywords(new_keywords))

        # 3. 添加否定关键词
        negative_kws = self._add_negative_keywords(ads_insights['negative_keyword_suggestions'])
        actions_executed.extend(negative_kws)

        # 4. 预算调整
        budget_actions = self._optimize_budgets(ads_insights['campaign_breakdown'])
        actions_executed.extend(self._execute_budget_changes(budget_actions))

        # 5. 暂停低效关键词
        pause_actions = self._pause_underperformers(ads_insights['underperforming_keywords'])
        actions_executed.extend(pause_actions)

        # 6. 生成报告
        report = {
            'optimization_run_id': self._generate_run_id(),
            'executed_date': datetime.now(),
            'actions_executed': actions_executed,
            'actions_pending_review': actions_review,
            'summary': self._summarize_actions(actions_executed)
        }

        self._export_report(report)
        self._send_notifications(report)

        return report

    def _optimize_bids(self, keyword_performance):
        actions = []

        for kw in keyword_performance:
            if kw['clicks'] < self.rules['bid_optimization']['min_data_points']:
                continue  # 数据不足,跳过

            new_bid, action = self.optimize_bid_by_acos(kw, target_acos=0.15)

            # 检查是否超过阈值
            bid_change_pct = abs(new_bid - kw['bid']) / kw['bid']
            if bid_change_pct > self.rules['bid_optimization']['max_bid_change_pct'] / 100:
                # 需要人工审核
                continue

            if action != "maintain":
                actions.append({
                    'type': 'bid_adjustment',
                    'target': kw,
                    'old_bid': kw['bid'],
                    'new_bid': new_bid,
                    'action': action
                })

        return actions

    def _execute_actions(self, actions):
        executed = []

        for action in actions:
            try:
                if action['type'] == 'bid_adjustment':
                    # 使用Amazon Ads API更新竞价
                    response = self.ads_api.update_keyword_bid(
                        keyword_id=action['target']['keyword_id'],
                        new_bid=action['new_bid']
                    )

                    executed.append({
                        **action,
                        'status': 'Executed',
                        'api_response': 'Success'
                    })

                elif action['type'] == 'add_keyword':
                    response = self.ads_api.create_keyword(
                        ad_group_id=action['target']['ad_group_id'],
                        keyword_text=action['keyword'],
                        match_type=action['match_type'],
                        bid=action['bid']
                    )

                    executed.append({
                        **action,
                        'status': 'Executed',
                        'keyword_id': response['keywordId']
                    })

                # ... 其他action类型

            except Exception as e:
                executed.append({
                    **action,
                    'status': 'Failed',
                    'error': str(e)
                })

        return executed

    def _send_notifications(self, report):
        # Slack通知
        slack_message = f"""
        🤖 广告优化完成

        执行时间: {report['executed_date']}
        总操作数: {len(report['actions_executed'])}

        预计影响:
        - 每周节省: ${report['summary']['estimated_weekly_savings']}
        - 每周增收: ${report['summary']['estimated_weekly_revenue_increase']}

        详细报告: [链接]
        """

        requests.post(
            self.rules['notifications']['slack_webhook'],
            json={'text': slack_message}
        )
```

## 安全机制

### 1. 渐进式优化
- 单次竞价调整不超过25%
- 新关键词从低竞价开始测试
- 预算增加有每日上限

### 2. 人工审核触发
- 大额预算变动(>$50)
- 大幅竞价调整(>25%)
- 创建新广告活动
- 暂停高收入关键词

### 3. 回滚机制
- 保留所有历史操作记录
- 支持一键回滚
- A/B测试验证效果

## 依赖
- 上游: Ads Data Agent
- 外部API: Amazon Advertising API
- 配置: optimization_rules.yml

## 监控和报警
```yaml
alerts:
  budget_overrun:
    condition: "daily_spend > budget * 1.2"
    action: "pause campaigns + notify"

  acos_spike:
    condition: "campaign_acos > target * 2.0 for 2 days"
    action: "notify + suggest review"

  api_errors:
    condition: "api_error_rate > 10%"
    action: "stop optimization + notify"
```

## 注意事项
1. 从保守规则开始,逐步放宽
2. 新品前30天数据波动大,谨慎自动化
3. 重大节日期间可能需要暂停自动优化
4. 定期review自动化效果,调整规则
5. API限制: 不要过于频繁调整(每天1-2次足够)
6. 保留手动介入能力
