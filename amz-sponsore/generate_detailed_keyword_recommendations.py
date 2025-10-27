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

def get_keyword_action(row):
    """根据关键词数据判断应该采取的操作"""
    spend = row['花费-本币']
    roas = row['ROAS']
    orders = row['广告订单']
    clicks = row['点击']
    ctr = row['CTR']
    cvr = row['CVR']
    acos = row['ACoS']

    # 立即暂停的条件
    if spend >= 50 and orders == 0:
        return "立即暂停", "花费$50+但零转化", "❌"

    if spend >= 30 and roas < 0.5:
        return "立即暂停", f"ROAS极低({roas:.2f})", "❌"

    # 大幅降价的条件
    if spend >= 20 and roas < 1.0 and orders > 0:
        suggested_decrease = 40
        return f"降价{suggested_decrease}%", f"ROAS<1需要降低成本", "⚠️"

    # 小幅降价的条件
    if roas >= 1.0 and roas < 1.5 and acos > 50:
        suggested_decrease = 25
        return f"降价{suggested_decrease}%", f"ACoS偏高({acos:.1f}%)", "⚠️"

    # 保持观察的条件
    if roas >= 1.5 and roas < 2.5:
        return "保持观察", "表现中等，持续监控", "⏸️"

    # 小幅提价的条件
    if roas >= 2.5 and roas < 4.0 and acos < 35:
        suggested_increase = 15
        return f"提价{suggested_increase}%", "表现良好，可扩大规模", "✅"

    # 大幅提价的条件
    if roas >= 4.0 and acos < 25:
        suggested_increase = 25
        return f"提价{suggested_increase}%", "表现优异，强力扩大", "🔥"

    # 新关键词（数据量少）
    if clicks < 10:
        return "继续测试", "数据量不足", "🔄"

    # 默认
    return "保持现状", "继续观察", "⏸️"

def analyze_and_recommend(store_name, file_list):
    """分析单个店铺并生成详细的关键词级别建议"""
    print(f"\n正在分析店铺: {store_name}")

    all_data = []
    markets = []

    # 读取所有文件
    for file_path in file_list:
        full_path = os.path.join(base_dir, file_path)
        try:
            df = pd.read_excel(full_path)
            all_data.append(df)
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
    percentage_fields = ['CTR', 'ACoS', '间接订单占比', 'CVR']
    currency_fields = ['CPC-本币', '花费-本币', '销售额-本币']

    for field in percentage_fields:
        if field in combined_df.columns:
            combined_df[field] = combined_df[field].apply(clean_percentage)

    for field in currency_fields:
        if field in combined_df.columns:
            combined_df[field] = combined_df[field].apply(clean_currency)

    numeric_fields = ['曝光量', '点击', '广告订单']
    for field in numeric_fields:
        if field in combined_df.columns:
            combined_df[field] = pd.to_numeric(combined_df[field], errors='coerce').fillna(0)

    # 整体数据分析
    total_impressions = combined_df['曝光量'].sum()
    total_clicks = combined_df['点击'].sum()
    total_spend = combined_df['花费-本币'].sum()
    total_sales = combined_df['销售额-本币'].sum()
    total_orders = combined_df['广告订单'].sum()

    overall_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
    overall_cpc = (total_spend / total_clicks) if total_clicks > 0 else 0
    overall_acos = (total_spend / total_sales * 100) if total_sales > 0 else 0
    overall_roas = (total_sales / total_spend) if total_spend > 0 else 0
    overall_cvr = (total_orders / total_clicks * 100) if total_clicks > 0 else 0

    # 生成建议文档
    recommendations = []
    recommendations.append(f"# {store_name} 广告关键词调整建议（详细版）")
    recommendations.append(f"\n**分析周期**: 2024年10月18日 - 10月24日")
    recommendations.append(f"**生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    recommendations.append(f"**覆盖市场**: {', '.join(set(markets))}")

    # 核心指标
    recommendations.append("\n## 一、核心指标总览")
    recommendations.append(f"\n- 广告花费: **${total_spend:,.2f}**")
    recommendations.append(f"- 广告销售额: **${total_sales:,.2f}**")
    recommendations.append(f"- ACoS: **{overall_acos:.2f}%**")
    recommendations.append(f"- ROAS: **{overall_roas:.2f}**")
    recommendations.append(f"- 点击数: **{total_clicks:,.0f}**")
    recommendations.append(f"- 订单数: **{total_orders:,.0f}**")
    recommendations.append(f"- CTR: **{overall_ctr:.2f}%** | CVR: **{overall_cvr:.2f}%** | CPC: **${overall_cpc:.2f}**")

    # 关键词详细分析
    if '关键词' in combined_df.columns:
        recommendations.append("\n## 二、关键词详细操作清单")

        # 准备关键词数据
        keyword_df = combined_df[combined_df['关键词'] != '--'].copy()

        keyword_analysis = keyword_df.groupby('关键词').agg({
            '点击': 'sum',
            '花费-本币': 'sum',
            '销售额-本币': 'sum',
            '广告订单': 'sum',
            '曝光量': 'sum',
            'CPC-本币': 'mean'
        }).reset_index()

        keyword_analysis['ROAS'] = (keyword_analysis['销售额-本币'] / keyword_analysis['花费-本币']).replace([np.inf, -np.inf], 0).fillna(0).round(2)
        keyword_analysis['ACoS'] = (keyword_analysis['花费-本币'] / keyword_analysis['销售额-本币'] * 100).replace([np.inf, -np.inf], 0).fillna(0).round(2)
        keyword_analysis['CTR'] = (keyword_analysis['点击'] / keyword_analysis['曝光量'] * 100).replace([np.inf, -np.inf], 0).fillna(0).round(2)
        keyword_analysis['CVR'] = (keyword_analysis['广告订单'] / keyword_analysis['点击'] * 100).replace([np.inf, -np.inf], 0).fillna(0).round(2)

        # 为每个关键词生成操作建议
        keyword_analysis[['操作', '原因', '状态']] = keyword_analysis.apply(
            lambda row: pd.Series(get_keyword_action(row)), axis=1
        )

        # 按花费排序，确保重要的关键词在前
        keyword_analysis = keyword_analysis.sort_values('花费-本币', ascending=False)

        # 分类统计
        pause_keywords = keyword_analysis[keyword_analysis['操作'].str.contains('暂停')]
        decrease_keywords = keyword_analysis[keyword_analysis['操作'].str.contains('降价')]
        increase_keywords = keyword_analysis[keyword_analysis['操作'].str.contains('提价')]
        observe_keywords = keyword_analysis[keyword_analysis['操作'].str.contains('保持|观察')]

        recommendations.append(f"\n### 📊 操作统计")
        recommendations.append(f"- ❌ 需要暂停: **{len(pause_keywords)}** 个关键词")
        recommendations.append(f"- ⚠️ 需要降价: **{len(decrease_keywords)}** 个关键词")
        recommendations.append(f"- ✅ 建议提价: **{len(increase_keywords)}** 个关键词")
        recommendations.append(f"- ⏸️ 保持观察: **{len(observe_keywords)}** 个关键词")

        # 1. 立即暂停的关键词
        if len(pause_keywords) > 0:
            recommendations.append(f"\n### ❌ 优先级1: 立即暂停的关键词 ({len(pause_keywords)}个)")
            recommendations.append("\n**这些关键词表现极差，建议立即暂停以止损**")
            recommendations.append("\n| # | 关键词 | 花费 | 销售额 | 订单 | 点击 | ROAS | ACoS | 原因 |")
            recommendations.append("|---|--------|------|--------|------|------|------|------|------|")

            for idx, (_, row) in enumerate(pause_keywords.iterrows(), 1):
                recommendations.append(
                    f"| {idx} | {row['关键词']} | ${row['花费-本币']:.2f} | ${row['销售额-本币']:.2f} | "
                    f"{int(row['广告订单'])} | {int(row['点击'])} | {row['ROAS']:.2f} | {row['ACoS']:.1f}% | {row['原因']} |"
                )

            total_pause_spend = pause_keywords['花费-本币'].sum()
            recommendations.append(f"\n💰 **预计节省**: 暂停这些关键词可节省 **${total_pause_spend:.2f}** 的未来花费")

        # 2. 需要降价的关键词
        if len(decrease_keywords) > 0:
            recommendations.append(f"\n### ⚠️ 优先级2: 需要降价的关键词 ({len(decrease_keywords)}个)")
            recommendations.append("\n**这些关键词成本过高，建议降低出价**")
            recommendations.append("\n| # | 关键词 | 当前CPC | 花费 | ROAS | ACoS | 订单 | 建议操作 | 原因 |")
            recommendations.append("|---|--------|---------|------|------|------|------|----------|------|")

            for idx, (_, row) in enumerate(decrease_keywords.iterrows(), 1):
                current_cpc = row['CPC-本币']
                # 从操作中提取降价百分比
                if '降价' in row['操作']:
                    try:
                        decrease_pct = int(row['操作'].replace('降价', '').replace('%', ''))
                        new_cpc = current_cpc * (1 - decrease_pct/100)
                        action_detail = f"{row['操作']} (${current_cpc:.2f}→${new_cpc:.2f})"
                    except:
                        action_detail = row['操作']
                else:
                    action_detail = row['操作']

                recommendations.append(
                    f"| {idx} | {row['关键词']} | ${current_cpc:.2f} | ${row['花费-本币']:.2f} | "
                    f"{row['ROAS']:.2f} | {row['ACoS']:.1f}% | {int(row['广告订单'])} | {action_detail} | {row['原因']} |"
                )

        # 3. 建议提价的关键词（表现优秀）
        if len(increase_keywords) > 0:
            recommendations.append(f"\n### ✅ 优先级3: 建议提价的关键词 ({len(increase_keywords)}个)")
            recommendations.append("\n**这些关键词表现优秀，建议提高出价以获得更多流量**")
            recommendations.append("\n| # | 关键词 | 当前CPC | 花费 | 销售额 | ROAS | ACoS | 订单 | 建议操作 | 原因 |")
            recommendations.append("|---|--------|---------|------|--------|------|------|------|----------|------|")

            for idx, (_, row) in enumerate(increase_keywords.iterrows(), 1):
                current_cpc = row['CPC-本币']
                # 从操作中提取提价百分比
                if '提价' in row['操作']:
                    try:
                        increase_pct = int(row['操作'].replace('提价', '').replace('%', ''))
                        new_cpc = current_cpc * (1 + increase_pct/100)
                        action_detail = f"{row['操作']} (${current_cpc:.2f}→${new_cpc:.2f})"
                    except:
                        action_detail = row['操作']
                else:
                    action_detail = row['操作']

                recommendations.append(
                    f"| {idx} | {row['关键词']} | ${current_cpc:.2f} | ${row['花费-本币']:.2f} | "
                    f"${row['销售额-本币']:.2f} | {row['ROAS']:.2f} | {row['ACoS']:.1f}% | {int(row['广告订单'])} | "
                    f"{action_detail} | {row['原因']} |"
                )

            total_increase_sales = increase_keywords['销售额-本币'].sum()
            recommendations.append(f"\n📈 **增长潜力**: 这些优质关键词已贡献 **${total_increase_sales:.2f}** 销售额，提价后预期增长20-30%")

        # 4. 保持观察的关键词（只显示花费较高的前20个）
        observe_high_spend = observe_keywords[observe_keywords['花费-本币'] >= 10].nlargest(20, '花费-本币')
        if len(observe_high_spend) > 0:
            recommendations.append(f"\n### ⏸️ 优先级4: 重点观察的关键词 (显示前20个)")
            recommendations.append("\n**这些关键词表现中等，需要持续监控并根据后续数据调整**")
            recommendations.append("\n| # | 关键词 | CPC | 花费 | ROAS | ACoS | 订单 | CTR | CVR | 建议 |")
            recommendations.append("|---|--------|-----|------|------|------|------|-----|-----|------|")

            for idx, (_, row) in enumerate(observe_high_spend.iterrows(), 1):
                recommendations.append(
                    f"| {idx} | {row['关键词']} | ${row['CPC-本币']:.2f} | ${row['花费-本币']:.2f} | "
                    f"{row['ROAS']:.2f} | {row['ACoS']:.1f}% | {int(row['广告订单'])} | "
                    f"{row['CTR']:.2f}% | {row['CVR']:.2f}% | {row['原因']} |"
                )

        # 完整关键词清单（CSV格式便于导入）
        recommendations.append(f"\n## 三、完整关键词操作清单")
        recommendations.append(f"\n**共 {len(keyword_analysis)} 个关键词**")
        recommendations.append("\n```csv")
        recommendations.append("关键词,状态,操作,原因,花费,销售额,ROAS,ACoS,订单,点击,CPC,CTR,CVR")

        for _, row in keyword_analysis.iterrows():
            recommendations.append(
                f"{row['关键词']},{row['状态']},{row['操作']},{row['原因']},"
                f"${row['花费-本币']:.2f},${row['销售额-本币']:.2f},{row['ROAS']:.2f},"
                f"{row['ACoS']:.1f}%,{int(row['广告订单'])},{int(row['点击'])},"
                f"${row['CPC-本币']:.2f},{row['CTR']:.2f}%,{row['CVR']:.2f}%"
            )
        recommendations.append("```")

        # 执行时间表
        recommendations.append("\n## 四、执行时间表")
        recommendations.append("\n### 今天立即执行")
        recommendations.append("1. ❌ 暂停所有「优先级1」中的关键词")
        recommendations.append(f"   - 数量: {len(pause_keywords)} 个")
        recommendations.append(f"   - 预计影响: 节省约 ${pause_keywords['花费-本币'].sum():.2f}/周")

        recommendations.append("\n### 明天执行")
        recommendations.append("2. ⚠️ 调整所有「优先级2」中的关键词出价")
        recommendations.append(f"   - 数量: {len(decrease_keywords)} 个")
        recommendations.append("   - 操作: 按建议百分比降低出价")

        recommendations.append("\n### 本周内执行")
        recommendations.append("3. ✅ 调整所有「优先级3」中的关键词出价")
        recommendations.append(f"   - 数量: {len(increase_keywords)} 个")
        recommendations.append("   - 操作: 按建议百分比提高出价")

        recommendations.append("\n### 持续执行")
        recommendations.append("4. ⏸️ 每日监控「优先级4」中的关键词")
        recommendations.append("   - 根据3天数据变化及时调整策略")

        # 预期效果
        recommendations.append("\n## 五、优化预期效果")

        pause_waste = pause_keywords['花费-本币'].sum()
        decrease_savings = decrease_keywords['花费-本币'].sum() * 0.3  # 预计降价可节省30%
        increase_revenue = increase_keywords['销售额-本币'].sum() * 0.25  # 预计提价可增加25%销售

        recommendations.append(f"\n### 成本优化")
        recommendations.append(f"- 暂停低效关键词预计每周节省: **${pause_waste:.2f}**")
        recommendations.append(f"- 降低出价预计每周节省: **${decrease_savings:.2f}**")
        recommendations.append(f"- **总计节省**: **${pause_waste + decrease_savings:.2f}**/周")

        recommendations.append(f"\n### 收入增长")
        recommendations.append(f"- 优质关键词提价预计增加销售: **${increase_revenue:.2f}**/周")

        recommendations.append(f"\n### 整体预期")
        current_roi = (total_sales - total_spend) / total_spend * 100 if total_spend > 0 else 0
        expected_roi = ((total_sales + increase_revenue) - (total_spend - pause_waste - decrease_savings)) / (total_spend - pause_waste - decrease_savings) * 100

        recommendations.append(f"- 当前ROI: **{current_roi:.1f}%**")
        recommendations.append(f"- 优化后预期ROI: **{expected_roi:.1f}%**")
        recommendations.append(f"- ROI提升: **+{expected_roi - current_roi:.1f}%**")

    # 附录
    recommendations.append("\n## 附录：操作指南")
    recommendations.append("\n### 如何暂停关键词")
    recommendations.append("1. 登录Amazon Advertising后台")
    recommendations.append("2. 进入对应的广告活动")
    recommendations.append("3. 找到关键词标签")
    recommendations.append("4. 选择要暂停的关键词，点击「暂停」")

    recommendations.append("\n### 如何调整出价")
    recommendations.append("1. 登录Amazon Advertising后台")
    recommendations.append("2. 进入对应的广告活动")
    recommendations.append("3. 找到关键词标签")
    recommendations.append("4. 找到对应关键词，点击出价栏")
    recommendations.append("5. 输入新的出价金额（参考建议中的新CPC）")
    recommendations.append("6. 保存更改")

    recommendations.append("\n### 批量操作建议")
    recommendations.append("- 使用Amazon的批量编辑功能可以提高效率")
    recommendations.append("- 可以下载上方的CSV清单，批量上传调整")
    recommendations.append("- 建议分批执行，每批不超过50个关键词")

    return '\n'.join(recommendations)

# 主程序
print("="*80)
print("开始生成8个店铺的详细关键词调整建议")
print("="*80)

today = datetime.now().strftime('%Y%m%d')
generated_files = []

for store_name, file_list in stores.items():
    print(f"\n处理店铺: {store_name}")

    report = analyze_and_recommend(store_name, file_list)

    if report:
        filename = f"{today}-广告调整建议-{store_name}.md"
        filepath = os.path.join(output_dir, filename)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(report)

        print(f"  ✓ 已生成: {filename}")
        generated_files.append(filename)
    else:
        print(f"  ✗ 生成失败: {store_name}")

print("\n" + "="*80)
print("生成完成！")
print("="*80)
print(f"\n共生成 {len(generated_files)} 个店铺的详细关键词调整建议:")
for filename in generated_files:
    print(f"  - {filename}")
print(f"\n文件保存位置: {output_dir}")
