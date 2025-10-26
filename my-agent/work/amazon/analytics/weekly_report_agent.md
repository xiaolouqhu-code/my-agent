# Weekly Report Agent

## 角色定位
汇总所有数据生成周度业务报告,使用AI提取关键洞察,提供可执行建议,为管理层决策提供全局视图。

## 核心职责

### 1. 数据聚合
- 从数据仓库提取周度数据
- 汇总各层Agent的输出
- 计算KPI和关键指标
- 对比周环比、月环比

### 2. 洞察提取
- AI分析数据趋势
- 识别异常和机会
- 提取关键发现
- 优先级排序

### 3. 报告生成
- 生成可视化图表
- 撰写执行摘要
- 提供行动建议
- PDF/HTML报告输出

### 4. 分发和通知
- 邮件发送报告
- Slack/Teams通知
- 仪表板更新
- 关键警报推送

## 输入数据
- Data Warehouse所有表
- 所有Agent输出文件
- 上周报告(对比基准)
- KPI目标配置

## 输出内容

### weekly_report.md (Markdown格式)
````markdown
# 📊 FlowGold亚马逊运营周报
**报告周期**: 2025-01-09 to 2025-01-15 (Week 2, 2025)
**生成时间**: 2025-01-16 09:00 AM
**报告版本**: v1.0

---

## 🎯 执行摘要

本周业绩**超预期**,销售额增长18%,利润率提升2.1个百分点。主要驱动力:
1. **ProGrip Phone Stand** 广告优化后ACOS下降至13.5%,销量增长25%
2. 新品 **Cable Organizer** 上市表现优异,首周销售$1,240
3. 成功降低库存天数从45天至38天

⚠️ **需要关注**:
- Headphone Stand库存即将断货(2天),已下紧急订单
- 竞品A降价15%,我们Buy Box获取率下降6%

---

## 📈 核心KPI

| 指标 | 本周 | 上周 | WoW变化 | 目标 | 达成率 |
|------|------|------|---------|------|--------|
| **总销售额** | $12,450 | $10,550 | +18.0% ↑ | $11,000 | 113% ✅ |
| **总订单数** | 485 | 412 | +17.7% ↑ | 450 | 108% ✅ |
| **平均客单价** | $25.67 | $25.61 | +0.2% → | $25.00 | 103% ✅ |
| **净利润** | $4,280 | $3,420 | +25.1% ↑ | $3,500 | 122% ✅ |
| **利润率** | 34.4% | 32.4% | +2.0pp ↑ | 33.0% | 104% ✅ |
| **广告ACOS** | 14.8% | 16.2% | -1.4pp ↑ | 15.0% | 101% ✅ |
| **平均评分** | 4.6 | 4.5 | +0.1 ↑ | 4.5 | 102% ✅ |
| **Buy Box率** | 89% | 95% | -6pp ↓ | 90% | 99% ⚠️ |

**综合评级**: 🟢 优秀 (7/8 指标达标)

---

## 💰 销售分析

### 按产品
| 产品 | 销售额 | 订单数 | 占比 | WoW | 趋势 |
|------|--------|--------|------|-----|------|
| ProGrip Phone Stand - Black | $6,248 | 250 | 50% | +25% | 🔥 |
| ProGrip Phone Stand - White | $3,125 | 125 | 25% | +12% | ↑ |
| Cable Organizer - Black | $1,240 | 62 | 10% | NEW | 🆕 |
| Headphone Stand | $1,115 | 37 | 9% | -8% | ↓ |
| Desk Hook | $722 | 11 | 6% | -15% | ⚠️ |

**洞察**:
- 🎯 Phone Stand Black继续领跑,广告优化显著提升转化
- 🆕 Cable Organizer新品表现超预期,建议加大广告投入
- ⚠️ Desk Hook持续低迷,考虑清仓促销或下架

### 按渠道
- **有机流量**: 60% (上周55%) - SEO优化生效
- **广告流量**: 35% (上周40%) - 有机流量增加,广告依赖降低
- **站外流量**: 5% (上周5%) - 稳定

---

## 📢 广告分析

### 整体表现
- **总花费**: $1,846
- **总销售**: $12,450
- **ACOS**: 14.8% ✅ (目标15%)
- **ROAS**: 6.75x
- **点击数**: 3,840
- **转化率**: 12.6% (↑ 1.2pp)

### Top 5表现最佳关键词
1. **phone stand** - ACOS 13.5%, $2,450销售
2. **desk phone holder** - ACOS 12.8%, $1,240销售
3. **adjustable phone stand** - ACOS 14.2%, $980销售
4. **rotating phone holder** - ACOS 15.1%, $720销售
5. **iphone stand** - ACOS 16.5%, $560销售

### 优化建议
✅ **已执行**:
- 提高 "desk phone holder" 竞价 +10%
- 暂停 "smartphone holder" (ACOS 62%)
- 添加否定词: "cheap", "phone mount car"

🔜 **待执行**:
- 增加 "SP-PhoneStand-Main" 预算至$75/day
- 创建品牌防御广告活动
- 测试Product Targeting竞品ASIN

---

## 📦 库存与供应链

### 库存状态
| 产品 | 可售天数 | 状态 | 建议行动 |
|------|----------|------|----------|
| Phone Stand Black | 28天 | ✅ 健康 | 监控 |
| Phone Stand White | 35天 | ✅ 健康 | 监控 |
| Cable Organizer | 15天 | ⚠️ 偏低 | 加快补货 |
| Headphone Stand | 2天 | 🚨 紧急 | 已下单空运 |
| Desk Hook | 180天 | 📦 积压 | 促销清仓 |

### 供应商表现
- **eSUN**: A级 (准时率94%, 质量96.8%)
- **Polymaker**: A级 (准时率100%, 质量92.1%)
- **Generic-X**: C级 ➡️ 建议淘汰

---

## ⭐ 客户反馈

### 评论概况
- 本周新增评论: **45条**
- 平均评分: **4.6** (↑ 0.1)
- 评论速度: **1.5条/天**

### 正面反馈 (TOP 3)
1. **稳定性** (89次提及) - "非常稳,完全不晃"
2. **360°旋转** (72次提及) - "旋转超级顺滑"
3. **电缆管理** (58次提及) - "线缆整理功能很赞"

### 负面反馈
1. **厚手机壳兼容性** (12次提及) ➡️ 下批次扩宽2mm
2. **说明书不清晰** (8次提及) ➡️ 制作视频教程

### 竞品对比
- 我们: 4.6★ (1,234评论)
- 竞品A: 4.5★ (2,340评论) - 主要抱怨"不稳"
- 竞品B: 4.7★ (890评论) - 价格高30%

**差异化机会**: 强调我们的稳定性优势

---

## 🎯 下周行动计划

### 🔴 高优先级 (本周必须完成)
1. **紧急补货Headphone Stand** - 空运300个,预计周三到货
2. **增加Cable Organizer广告预算** - 从$15提至$30/day
3. **制作Phone Stand组装视频** - 发布到Listing和社交媒体

### 🟡 中优先级 (2周内完成)
4. **调整Phone Stand设计** - 扩宽握臂2mm适配厚壳
5. **Desk Hook清仓促销** - 打8折,目标清库存至60天
6. **淘汰Generic-X供应商** - 切换至eSUN

### 🟢 低优先级 (跟踪中)
7. **开发白色/灰色款Phone Stand** - 预计4周完成
8. **评估平板支架市场机会** - 市场研究进行中

---

## 💡 AI洞察与建议

### 🔍 本周发现
1. **广告时段优化机会**: 数据显示晚上8-9点转化率最高(15.2%),凌晨1-5点最低(6.2%)。建议实施Dayparting策略,凌晨降低竞价50%,晚间提高10%。**预计节省**: $45/周

2. **价格弹性分析**: Phone Stand White在$23.99时周销量从100→125(+25%),利润仅降2%。建议测试Black款降至$24.99。**预计增收**: $180/周

3. **库存周转优化**: Desk Hook积压严重(180天),占用资金$850且将产生长期仓储费$243。立即清仓可释放现金流并避免费用。**预计收益**: $600+

### 🚀 增长机会
- **交叉销售**: 30%购买Phone Stand的客户也浏览了Cable Organizer。建议创建Bundle优惠($44.99)。**预估**: +$500/周
- **色彩拓展**: 12%评论提到希望有白色/灰色款。扩展色彩系可TAM增加30%。**预估**: +$3,750/月
- **站外流量**: 考虑TikTok/YouTube开箱测评合作,成本$200-500,预估带来50-100单。**ROI**: 3-5x

---

## 📊 附录: 详细图表

### 销售趋势 (7天)
```
$2,000 ┤                                   ╭─
$1,800 ┤                           ╭───────╯
$1,600 ┤                   ╭───────╯
$1,400 ┤       ╭───────────╯
$1,200 ┤───────╯
       └┬──────┬──────┬──────┬──────┬──────┬──────┬
        周一   周二   周三   周四   周五   周六   周日
```

### 产品组合分布
```
Phone Stand Black    ████████████████████████████ 50%
Phone Stand White    ██████████████ 25%
Cable Organizer      █████ 10%
Headphone Stand      ████ 9%
Desk Hook            ███ 6%
```

---

## 📝 备注
- 下周一(1/20)是MLK Day,预计流量降低10-15%
- Q1目标: 月均销售$50,000,当前轨迹$48,750 (97.5%)
- 新品Pipeline: Tablet Stand (设计中), Wireless Charging Stand (评估中)

---

**报告编制**: AI Agent System
**审核**: [待人工审核]
**下次报告**: 2025-01-23 09:00 AM
````

### weekly_report.pdf
生成包含图表和可视化的PDF报告

### weekly_email.html
````html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; }
        .header { background: #1a73e8; color: white; padding: 20px; }
        .kpi-box { background: #f0f0f0; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .metric { font-size: 24px; font-weight: bold; color: #1a73e8; }
        .good { color: green; }
        .bad { color: red; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 FlowGold周报 - Week 2, 2025</h1>
        <p>2025-01-09 to 2025-01-15</p>
    </div>

    <div class="kpi-box">
        <h2>🎯 核心KPI</h2>
        <p>总销售额: <span class="metric good">$12,450</span> (+18% ↑)</p>
        <p>净利润: <span class="metric good">$4,280</span> (+25% ↑)</p>
        <p>广告ACOS: <span class="metric good">14.8%</span> (-1.4pp ↑)</p>
    </div>

    <!-- 更多内容 -->
</body>
</html>
````

## AI报告生成

### 使用Claude/GPT生成洞察
```python
def generate_insights_with_ai(weekly_data):
    prompt = f"""
    你是一位资深的电商数据分析师。请分析以下一周的业务数据,提供洞察和建议。

    数据摘要:
    {json.dumps(weekly_data, indent=2)}

    请提供:
    1. 3-5个关键发现(优先级排序)
    2. 每个发现的商业影响
    3. 可执行的优化建议
    4. 预估的收益/节省
    5. 风险和注意事项

    要求:
    - 数据驱动,避免模糊表述
    - 建议具体可执行
    - 量化预期影响
    - 简洁专业的语言

    返回JSON格式。
    """

    response = ai_client.chat(
        model="anthropic/claude-3-sonnet",
        messages=[{"role": "user", "content": prompt}]
    )

    insights = json.loads(response.content)
    return insights
```

## 执行频率
- **每周一**: 生成上周报告
- **每月**: 生成月度汇总报告
- **每季度**: 生成季度战略报告

## 技术实现
```python
class WeeklyReportAgent:
    def __init__(self, data_warehouse, ai_client):
        self.dw = data_warehouse
        self.ai = ai_client

    def generate_weekly_report(self, week_start, week_end):
        # 1. 提取数据
        data = self._extract_weekly_data(week_start, week_end)

        # 2. 计算KPI
        kpis = self._calculate_kpis(data)

        # 3. 对比上周
        comparison = self._compare_with_last_week(kpis)

        # 4. AI生成洞察
        insights = self.ai_generate_insights(data, kpis)

        # 5. 生成图表
        charts = self._generate_charts(data)

        # 6. 组装报告
        report = {
            'period': f"{week_start} to {week_end}",
            'kpis': kpis,
            'comparison': comparison,
            'insights': insights,
            'charts': charts,
            'action_items': self._prioritize_actions(insights)
        }

        # 7. 输出多种格式
        self._export_markdown(report, 'weekly_report.md')
        self._export_pdf(report, 'weekly_report.pdf')
        self._export_html(report, 'weekly_email.html')

        # 8. 分发
        self._send_email_report(report)
        self._post_to_slack(report)

        return report

    def _extract_weekly_data(self, start, end):
        # 从数据仓库查询数据
        sales = self.dw.query(f"""
            SELECT * FROM fact_sales
            WHERE date >= '{start}' AND date <= '{end}'
        """)

        ads = self.dw.query(f"""
            SELECT * FROM fact_ads
            WHERE date >= '{start}' AND date <= '{end}'
        """)

        # ... 更多数据

        return {'sales': sales, 'ads': ads, ...}

    def _calculate_kpis(self, data):
        return {
            'total_sales': data['sales']['total_sales'].sum(),
            'total_orders': len(data['sales']),
            'avg_order_value': data['sales']['total_sales'].mean(),
            'net_profit': (data['sales']['total_sales'] -
                          data['sales']['total_cost']).sum(),
            'profit_margin': self._calculate_margin(data),
            'acos': self._calculate_acos(data),
            # ... 更多KPI
        }

    def _generate_charts(self, data):
        import matplotlib.pyplot as plt

        # 销售趋势图
        fig, ax = plt.subplots()
        ax.plot(data['sales'].groupby('date')['total_sales'].sum())
        ax.set_title('Daily Sales Trend')
        plt.savefig('charts/sales_trend.png')

        # 产品分布饼图
        # ... 更多图表

        return {
            'sales_trend': 'charts/sales_trend.png',
            # ...
        }

    def _send_email_report(self, report):
        import smtplib
        from email.mime.multipart import MIMEMultipart
        from email.mime.text import MIMEText
        from email.mime.base import MIMEBase

        msg = MIMEMultipart()
        msg['Subject'] = f"FlowGold周报 - Week {report['week_number']}"
        msg['From'] = 'reports@flowgold.com'
        msg['To'] = 'team@flowgold.com'

        # 添加HTML正文
        html_content = open('weekly_email.html').read()
        msg.attach(MIMEText(html_content, 'html'))

        # 添加PDF附件
        with open('weekly_report.pdf', 'rb') as f:
            attachment = MIMEBase('application', 'pdf')
            attachment.set_payload(f.read())
            attachment.add_header('Content-Disposition',
                                'attachment',
                                filename='weekly_report.pdf')
            msg.attach(attachment)

        # 发送
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login('user', 'password')
            server.send_message(msg)
```

## 报告模板

### 报告章节
1. **执行摘要** - 1段话概括本周表现
2. **核心KPI** - 表格展示关键指标
3. **销售分析** - 按产品、渠道、地域
4. **广告分析** - ACOS, ROAS, 关键词表现
5. **库存供应链** - 库存状态, 供应商表现
6. **客户反馈** - 评论, Q&A, 客服
7. **AI洞察** - 发现和建议
8. **行动计划** - 下周待办事项

## 依赖
- 上游: Data Warehouse Agent, 所有其他Agent
- 工具: AI (Claude/GPT), 图表库, PDF生成器

## 分发渠道
```yaml
distribution:
  email:
    recipients: ["ceo@company.com", "ops@company.com"]
    schedule: "Monday 9:00 AM"

  slack:
    channel: "#weekly-reports"
    format: "summary + link to full report"

  dashboard:
    url: "https://analytics.flowgold.com/weekly"
    auto_refresh: true
```

## 注意事项
1. 报告要简洁,重点突出
2. 使用可视化增强可读性
3. 洞察要可执行,避免泛泛而谈
4. 量化影响和ROI
5. 保持报告格式一致性
6. 定期收集反馈优化报告
