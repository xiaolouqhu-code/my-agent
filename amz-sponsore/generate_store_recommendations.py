import pandas as pd
import os
import numpy as np
from datetime import datetime
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

# 导入配置
from config import get_data_path, get_output_path, ensure_output_dir, DATA_DIR

# 设置数据目录
base_dir = DATA_DIR
output_dir = ensure_output_dir('广告调整建议')

# 8个独立店铺的文件映射
stores = {
    'ZOZO': [
        'zozo+奇宝乐/ZOZO-US-(10.18-10.24)-每日明细-840626529318195200.xlsx',
        'zozo+奇宝乐/ZOZO-US-(10.18-10.24)-每日明细-840626902300938240.xlsx'
    ],
    '奇宝乐': [
        'zozo+奇宝乐/奇宝乐-US-(10.18-10.24)-每日明细-840626797477761024.xlsx',
        'zozo+奇宝乐/奇宝乐-CA-(10.18-10.24)-每日明细-840627029244764160.xlsx'
    ],
    '智恒': [
        '新晟智恒10.18-10.24关键词报表/智恒US（10.18-10.24）-每日明细-840626717170073600.xlsx',
        '新晟智恒10.18-10.24关键词报表/智恒CA（10.18-10.24）-每日明细-840626852446949376.xlsx'
    ],
    '新晟': [
        '新晟智恒10.18-10.24关键词报表/新晟US（10.18-10.24）-每日明细-840626999588167680.xlsx',
        '新晟智恒10.18-10.24关键词报表/新晟CA（10.18-10.24）-每日明细-840627098069270528.xlsx'
    ],
    '朵越': [
        '朵越-琴心 SP关键词数据/朵越US(10.18-10.24)-每日明细-840626503986221056.xlsx',
        '朵越-琴心 SP关键词数据/朵越CA(10.18-10.24)-每日明细-840626891834294272.xlsx',
        '朵越-琴心 SP关键词数据/朵越AE(10.18-10.24)-每日明细-840627029204635648.xlsx',
        '朵越-琴心 SP关键词数据/朵越UK(10.18-10.24)-每日明细-840627255614652416.xlsx',
        '朵越-琴心 SP关键词数据/朵越DE(10.18-10.24)-每日明细-840627129391939584.xlsx'
    ],
    '琴心': [
        '朵越-琴心 SP关键词数据/琴心US(10.18-10.24)-每日明细-840627401357033472.xlsx'
    ],
    '建峰': [
        '建峰+民誉/建峰CA(10.18-10.24)-每日明细-840627006393303040.xlsx',
        '建峰+民誉/建峰US(10.18-10.24)-每日明细-840627219971309568.xlsx'
    ],
    '民誉': [
        '建峰+民誉/民誉US(10.18-10.24)-每日明细-840628173874954240.xlsx',
        '建峰+民誉/民誉CA(10.18-10.24)-每日明细-840628056322609152.xlsx'
    ]
}

def clean_percentage(val):
    """清理百分比数据"""
    if pd.isna(val) or val == '--' or val == '':
        return 0.0
    if isinstance(val, str):
        if '有花费无销售额' in val or '无' in val:
            return 0.0
        try:
            return float(val.replace('%', '').replace(',', ''))
        except:
            return 0.0
    return float(val)

def clean_currency(val):
    """清理货币数据"""
    if pd.isna(val) or val == '--' or val == '':
        return 0.0
    if isinstance(val, str):
        if '有花费无销售额' in val or '无' in val:
            return 0.0
        try:
            return float(val.replace(',', '').replace('$', ''))
        except:
            return 0.0
    return float(val)

def analyze_and_recommend(store_name, file_list):
    """分析单个店铺并生成建议"""
    print(f"\n正在分析店铺: {store_name}")

    all_data = []
    markets = []

    # 读取所有文件
    for file_path in file_list:
        full_path = os.path.join(base_dir, file_path)
        try:
            df = pd.read_excel(full_path)
            all_data.append(df)
            # 提取市场信息
            market = os.path.basename(file_path).split('(')[0].split('-')[-1].strip()
            markets.append(market)
        except Exception as e:
            print(f"  读取失败 {file_path}: {str(e)}")

    if not all_data:
        print(f"  {store_name} 没有成功读取任何数据文件")
        return None

    # 合并所有数据
    combined_df = pd.concat(all_data, ignore_index=True)

    # 数据清理
    percentage_fields = ['CTR', 'ACoS', '间接订单占比', 'CVR', '"品牌新买家" 转化率', '5秒观看率', 'VTR', 'vCTR', '搜索结果首页首位IS']
    currency_fields = ['CPC-本币', '花费-本币', '销售额-本币', '直接成交销售额-本币', '间接成交销售额-本币',
                       'CPA-本币', '广告笔单价-本币', '直接成交笔单价-本币', '间接成交笔单价-本币', '"品牌新买家" 销售额-本币']

    for field in percentage_fields:
        if field in combined_df.columns:
            combined_df[field] = combined_df[field].apply(clean_percentage)

    for field in currency_fields:
        if field in combined_df.columns:
            combined_df[field] = combined_df[field].apply(clean_currency)

    # 确保数值列为数值类型
    numeric_fields = ['曝光量', '点击', '广告订单', '直接成交订单', '间接成交订单',
                     '广告销量', '直接成交销量', '间接成交销量', 'ROAS']
    for field in numeric_fields:
        if field in combined_df.columns:
            combined_df[field] = pd.to_numeric(combined_df[field], errors='coerce').fillna(0)

    # 整体数据分析
    total_impressions = combined_df['曝光量'].sum()
    total_clicks = combined_df['点击'].sum()
    total_spend = combined_df['花费-本币'].sum()
    total_sales = combined_df['销售额-本币'].sum()
    total_orders = combined_df['广告订单'].sum()

    # 计算整体指标
    overall_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
    overall_cpc = (total_spend / total_clicks) if total_clicks > 0 else 0
    overall_acos = (total_spend / total_sales * 100) if total_sales > 0 else 0
    overall_roas = (total_sales / total_spend) if total_spend > 0 else 0
    overall_cvr = (total_orders / total_clicks * 100) if total_clicks > 0 else 0
    overall_cpa = (total_spend / total_orders) if total_orders > 0 else 0

    # 生成建议文档
    recommendations = []
    recommendations.append(f"# {store_name} 广告调整建议")
    recommendations.append(f"\n**分析周期**: 2024年10月18日 - 10月24日")
    recommendations.append(f"**生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    recommendations.append(f"**覆盖市场**: {', '.join(set(markets))}")

    # 核心指标总览
    recommendations.append("\n## 一、核心指标总览")
    recommendations.append("\n| 指标 | 数值 |")
    recommendations.append("|------|------|")
    recommendations.append(f"| 曝光量 | {total_impressions:,.0f} |")
    recommendations.append(f"| 点击数 | {total_clicks:,.0f} |")
    recommendations.append(f"| 广告花费 | ${total_spend:,.2f} |")
    recommendations.append(f"| 广告销售额 | ${total_sales:,.2f} |")
    recommendations.append(f"| 订单数 | {total_orders:,.0f} |")
    recommendations.append(f"| CTR | {overall_ctr:.2f}% |")
    recommendations.append(f"| CPC | ${overall_cpc:.2f} |")
    recommendations.append(f"| ACoS | {overall_acos:.2f}% |")
    recommendations.append(f"| ROAS | {overall_roas:.2f} |")
    recommendations.append(f"| CVR | {overall_cvr:.2f}% |")
    recommendations.append(f"| CPA | ${overall_cpa:.2f} |")

    # 整体评级和建议
    recommendations.append("\n## 二、整体表现评级")

    if overall_acos <= 35 and overall_roas >= 2.5:
        rating = "优秀"
        status = "🟢"
        summary = "店铺广告效果优秀，保持当前策略并寻求进一步优化机会。"
    elif overall_acos <= 45 and overall_roas >= 2.0:
        rating = "良好"
        status = "🟡"
        summary = "店铺广告效果良好，有一定优化空间。"
    elif overall_acos <= 55:
        rating = "需改进"
        status = "🟠"
        summary = "店铺广告效果一般，需要重点优化。"
    else:
        rating = "需紧急优化"
        status = "🔴"
        summary = "店铺广告效果较差，需要立即采取优化措施。"

    recommendations.append(f"\n**评级**: {status} {rating}")
    recommendations.append(f"\n**总体评估**: {summary}")

    # 按国家分析
    if '国家' in combined_df.columns:
        recommendations.append("\n## 三、市场表现分析")
        country_analysis = combined_df.groupby('国家').agg({
            '曝光量': 'sum',
            '点击': 'sum',
            '花费-本币': 'sum',
            '销售额-本币': 'sum',
            '广告订单': 'sum'
        }).reset_index()

        country_analysis['CTR'] = (country_analysis['点击'] / country_analysis['曝光量'] * 100).round(2)
        country_analysis['CPC'] = (country_analysis['花费-本币'] / country_analysis['点击']).round(2)
        country_analysis['ACoS'] = (country_analysis['花费-本币'] / country_analysis['销售额-本币'] * 100).round(2)
        country_analysis['ROAS'] = (country_analysis['销售额-本币'] / country_analysis['花费-本币']).round(2)

        recommendations.append("\n| 市场 | 花费 | 销售额 | ACoS | ROAS | CTR | CPC | 订单 |")
        recommendations.append("|------|------|--------|------|------|-----|-----|------|")
        for _, row in country_analysis.iterrows():
            recommendations.append(
                f"| {row['国家']} | ${row['花费-本币']:,.2f} | ${row['销售额-本币']:,.2f} | "
                f"{row['ACoS']:.2f}% | {row['ROAS']:.2f} | {row['CTR']:.2f}% | ${row['CPC']:.2f} | {int(row['广告订单'])} |"
            )

        # 市场建议
        recommendations.append("\n### 市场优化建议")
        for _, row in country_analysis.iterrows():
            market = row['国家']
            acos = row['ACoS']
            roas = row['ROAS']

            if roas >= 3.0:
                recommendations.append(f"- **{market}市场**: 表现优异，建议适当提高预算以扩大规模")
            elif roas >= 2.0:
                recommendations.append(f"- **{market}市场**: 表现良好，继续优化关键词和出价策略")
            elif roas >= 1.0:
                recommendations.append(f"- **{market}市场**: 表现一般，需要优化关键词选择和广告创意")
            else:
                recommendations.append(f"- **{market}市场**: 表现较差，建议暂停低效广告活动，重新评估市场策略")

    # 关键词分析
    if '关键词' in combined_df.columns:
        recommendations.append("\n## 四、关键词优化建议")

        keyword_analysis = combined_df[combined_df['关键词'] != '--'].groupby('关键词').agg({
            '点击': 'sum',
            '花费-本币': 'sum',
            '销售额-本币': 'sum',
            '广告订单': 'sum',
            '曝光量': 'sum'
        }).reset_index()

        keyword_analysis['ROAS'] = (keyword_analysis['销售额-本币'] / keyword_analysis['花费-本币']).round(2)
        keyword_analysis['ACoS'] = (keyword_analysis['花费-本币'] / keyword_analysis['销售额-本币'] * 100).round(2)
        keyword_analysis['CTR'] = (keyword_analysis['点击'] / keyword_analysis['曝光量'] * 100).round(2)
        keyword_analysis['CVR'] = (keyword_analysis['广告订单'] / keyword_analysis['点击'] * 100).round(2)

        # 过滤：至少有10次点击
        keyword_analysis_filtered = keyword_analysis[keyword_analysis['点击'] >= 10]

        # Top表现关键词
        if len(keyword_analysis_filtered) > 0:
            recommendations.append("\n### 4.1 优秀表现关键词 (Top 10)")
            recommendations.append("\n建议：加大投入，提高竞价，确保充足曝光")
            recommendations.append("\n| 关键词 | 点击 | 花费 | 销售额 | 订单 | ACoS | ROAS |")
            recommendations.append("|--------|------|------|--------|------|------|------|")

            top_keywords = keyword_analysis_filtered.nlargest(10, 'ROAS')
            for _, row in top_keywords.iterrows():
                recommendations.append(
                    f"| {row['关键词']} | {int(row['点击'])} | ${row['花费-本币']:.2f} | "
                    f"${row['销售额-本币']:.2f} | {int(row['广告订单'])} | {row['ACoS']:.2f}% | {row['ROAS']:.2f} |"
                )

            # 问题关键词
            problem_keywords = keyword_analysis[
                (keyword_analysis['花费-本币'] >= 50) &
                ((keyword_analysis['ROAS'] < 1) | (keyword_analysis['广告订单'] == 0))
            ].nlargest(10, '花费-本币')

            if len(problem_keywords) > 0:
                recommendations.append("\n### 4.2 问题关键词")
                recommendations.append("\n建议：立即暂停或大幅降低出价")
                recommendations.append("\n| 关键词 | 点击 | 花费 | 销售额 | 订单 | ROAS | 操作建议 |")
                recommendations.append("|--------|------|------|--------|------|------|----------|")

                for _, row in problem_keywords.iterrows():
                    roas = row['ROAS']
                    orders = int(row['广告订单'])
                    spend = row['花费-本币']

                    if orders == 0:
                        action = "❌ 立即暂停"
                    elif roas < 0.5:
                        action = "⚠️ 大幅降价或暂停"
                    else:
                        action = "⚠️ 降低出价50%"

                    recommendations.append(
                        f"| {row['关键词']} | {int(row['点击'])} | ${spend:.2f} | "
                        f"${row['销售额-本币']:.2f} | {orders} | {roas:.2f} | {action} |"
                    )

            # 中等表现关键词
            moderate_keywords = keyword_analysis_filtered[
                (keyword_analysis_filtered['ROAS'] >= 1.5) &
                (keyword_analysis_filtered['ROAS'] < 2.5) &
                (keyword_analysis_filtered['花费-本币'] >= 30)
            ].nlargest(10, '花费-本币')

            if len(moderate_keywords) > 0:
                recommendations.append("\n### 4.3 潜力关键词")
                recommendations.append("\n建议：优化广告创意和落地页，提升转化率")
                recommendations.append("\n| 关键词 | 点击 | 花费 | 销售额 | 订单 | ACoS | ROAS |")
                recommendations.append("|--------|------|------|--------|------|------|------|")

                for _, row in moderate_keywords.iterrows():
                    recommendations.append(
                        f"| {row['关键词']} | {int(row['点击'])} | ${row['花费-本币']:.2f} | "
                        f"${row['销售额-本币']:.2f} | {int(row['广告订单'])} | {row['ACoS']:.2f}% | {row['ROAS']:.2f} |"
                    )

    # 广告活动分析
    if '广告活动' in combined_df.columns:
        recommendations.append("\n## 五、广告活动优化建议")

        campaign_analysis = combined_df[combined_df['广告活动'] != '--'].groupby('广告活动').agg({
            '花费-本币': 'sum',
            '销售额-本币': 'sum',
            '广告订单': 'sum',
            '点击': 'sum',
            '曝光量': 'sum'
        }).reset_index()

        campaign_analysis['ROAS'] = (campaign_analysis['销售额-本币'] / campaign_analysis['花费-本币']).round(2)
        campaign_analysis['ACoS'] = (campaign_analysis['花费-本币'] / campaign_analysis['销售额-本币'] * 100).round(2)
        campaign_analysis['CTR'] = (campaign_analysis['点击'] / campaign_analysis['曝光量'] * 100).round(2)

        if len(campaign_analysis) > 0:
            recommendations.append("\n### 主要广告活动表现")
            recommendations.append("\n| 广告活动 | 花费 | 销售额 | 订单 | ACoS | ROAS | 建议 |")
            recommendations.append("|----------|------|--------|------|------|------|------|")

            top_campaigns = campaign_analysis.nlargest(10, '花费-本币')
            for _, row in top_campaigns.iterrows():
                roas = row['ROAS']
                acos = row['ACoS']

                if roas >= 3.0:
                    suggestion = "✅ 增加预算"
                elif roas >= 2.0:
                    suggestion = "✅ 保持并优化"
                elif roas >= 1.0:
                    suggestion = "⚠️ 需要优化"
                else:
                    suggestion = "❌ 考虑暂停"

                campaign_name = row['广告活动'][:30] + "..." if len(row['广告活动']) > 30 else row['广告活动']
                recommendations.append(
                    f"| {campaign_name} | ${row['花费-本币']:.2f} | ${row['销售额-本币']:.2f} | "
                    f"{int(row['广告订单'])} | {acos:.2f}% | {roas:.2f} | {suggestion} |"
                )

    # 具体行动计划
    recommendations.append("\n## 六、具体行动计划")

    recommendations.append("\n### 立即执行 (优先级: 高)")
    action_count = 1

    # 根据整体表现给出建议
    if overall_acos > 50:
        recommendations.append(f"{action_count}. 整体ACoS过高({overall_acos:.2f}%)，立即暂停ROAS<1的所有关键词和广告活动")
        action_count += 1

    if overall_ctr < 0.3:
        recommendations.append(f"{action_count}. CTR过低({overall_ctr:.2f}%)，优化广告标题和主图，提高点击吸引力")
        action_count += 1

    if overall_cvr < 5:
        recommendations.append(f"{action_count}. CVR偏低({overall_cvr:.2f}%)，优化产品详情页、价格策略和客户评价")
        action_count += 1

    recommendations.append("\n### 本周执行 (优先级: 中)")
    recommendations.append(f"{action_count}. 对优秀表现关键词提高出价15-20%，扩大曝光")
    action_count += 1
    recommendations.append(f"{action_count}. 添加5-10个与高转化关键词相关的新关键词")
    action_count += 1
    recommendations.append(f"{action_count}. 对中等表现关键词进行A/B测试，优化广告文案")
    action_count += 1

    recommendations.append("\n### 持续优化 (优先级: 低)")
    recommendations.append(f"{action_count}. 每周审查广告数据，调整不符合预期的关键词和广告活动")
    action_count += 1
    recommendations.append(f"{action_count}. 关注竞品动态，及时调整竞价策略")
    action_count += 1
    recommendations.append(f"{action_count}. 定期更新产品图片和描述，保持竞争力")

    # 预期效果
    recommendations.append("\n## 七、优化预期效果")

    expected_acos = overall_acos * 0.85  # 预期降低15%
    expected_roas = overall_roas * 1.2   # 预期提升20%

    recommendations.append("\n通过执行以上建议，预期在2-4周内达到以下效果：")
    recommendations.append(f"\n- **ACoS**: 从 {overall_acos:.2f}% 降低至 {expected_acos:.2f}% (降低约15%)")
    recommendations.append(f"- **ROAS**: 从 {overall_roas:.2f} 提升至 {expected_roas:.2f} (提升约20%)")
    recommendations.append(f"- **总广告花费**: 优化后预计节省 ${total_spend * 0.1:.2f} 或提升销售额 ${total_sales * 0.2:.2f}")

    # 附录
    recommendations.append("\n## 附录：指标说明")
    recommendations.append("\n- **ACoS (广告成本销售占比)**: 广告花费 ÷ 广告销售额，越低越好，一般目标<35%")
    recommendations.append("- **ROAS (广告支出回报率)**: 广告销售额 ÷ 广告花费，越高越好，一般目标>2.5")
    recommendations.append("- **CTR (点击率)**: 点击数 ÷ 曝光量，越高越好，一般目标>0.5%")
    recommendations.append("- **CVR (转化率)**: 订单数 ÷ 点击数，越高越好，一般目标>10%")
    recommendations.append("- **CPC (单次点击成本)**: 广告花费 ÷ 点击数")
    recommendations.append("- **CPA (单次获客成本)**: 广告花费 ÷ 订单数")

    return '\n'.join(recommendations)

# 主程序
print("="*80)
print("开始生成8个店铺的广告调整建议")
print("="*80)

today = datetime.now().strftime('%Y%m%d')
generated_files = []

for store_name, file_list in stores.items():
    print(f"\n处理店铺: {store_name}")

    report = analyze_and_recommend(store_name, file_list)

    if report:
        # 生成文件名
        filename = f"{today}-广告调整建议-{store_name}.md"
        filepath = os.path.join(output_dir, filename)

        # 保存文件
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(report)

        print(f"  ✓ 已生成: {filename}")
        generated_files.append(filename)
    else:
        print(f"  ✗ 生成失败: {store_name}")

print("\n" + "="*80)
print("生成完成！")
print("="*80)
print(f"\n共生成 {len(generated_files)} 个店铺的广告调整建议:")
for filename in generated_files:
    print(f"  - {filename}")
print(f"\n文件保存位置: {output_dir}")
