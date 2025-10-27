import pandas as pd
import os
import numpy as np
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

# 设置数据目录
base_dir = '/Users/liujinxingzheng/Documents/ai-file/amz-sponsore'

# 店铺分组
stores = {
    'ZOZO+奇宝乐': [
        'zozo+奇宝乐/ZOZO-US-(10.18-10.24)-每日明细-840626529318195200.xlsx',
        'zozo+奇宝乐/奇宝乐-US-(10.18-10.24)-每日明细-840626797477761024.xlsx',
        'zozo+奇宝乐/ZOZO-US-(10.18-10.24)-每日明细-840626902300938240.xlsx',
        'zozo+奇宝乐/奇宝乐-CA-(10.18-10.24)-每日明细-840627029244764160.xlsx'
    ],
    '新晟智恒': [
        '新晟智恒10.18-10.24关键词报表/智恒US（10.18-10.24）-每日明细-840626717170073600.xlsx',
        '新晟智恒10.18-10.24关键词报表/智恒CA（10.18-10.24）-每日明细-840626852446949376.xlsx',
        '新晟智恒10.18-10.24关键词报表/新晟US（10.18-10.24）-每日明细-840626999588167680.xlsx',
        '新晟智恒10.18-10.24关键词报表/新晟CA（10.18-10.24）-每日明细-840627098069270528.xlsx'
    ],
    '朵越-琴心': [
        '朵越-琴心 SP关键词数据/朵越US(10.18-10.24)-每日明细-840626503986221056.xlsx',
        '朵越-琴心 SP关键词数据/朵越CA(10.18-10.24)-每日明细-840626891834294272.xlsx',
        '朵越-琴心 SP关键词数据/朵越AE(10.18-10.24)-每日明细-840627029204635648.xlsx',
        '朵越-琴心 SP关键词数据/朵越UK(10.18-10.24)-每日明细-840627255614652416.xlsx',
        '朵越-琴心 SP关键词数据/朵越DE(10.18-10.24)-每日明细-840627129391939584.xlsx',
        '朵越-琴心 SP关键词数据/琴心US(10.18-10.24)-每日明细-840627401357033472.xlsx'
    ],
    '建峰+民誉': [
        '建峰+民誉/民誉US(10.18-10.24)-每日明细-840628173874954240.xlsx',
        '建峰+民誉/民誉CA(10.18-10.24)-每日明细-840628056322609152.xlsx',
        '建峰+民誉/建峰CA(10.18-10.24)-每日明细-840627006393303040.xlsx',
        '建峰+民誉/建峰US(10.18-10.24)-每日明细-840627219971309568.xlsx'
    ]
}

def clean_percentage(val):
    """清理百分比数据"""
    if pd.isna(val) or val == '--' or val == '':
        return 0.0
    if isinstance(val, str):
        # 处理特殊文本
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
        # 处理特殊文本
        if '有花费无销售额' in val or '无' in val:
            return 0.0
        try:
            return float(val.replace(',', '').replace('$', ''))
        except:
            return 0.0
    return float(val)

def analyze_store_group(store_name, file_list):
    """分析单个店铺组"""
    print(f"\n{'='*80}")
    print(f"分析店铺组: {store_name}")
    print(f"{'='*80}\n")

    all_data = []

    # 读取所有文件
    for file_path in file_list:
        full_path = os.path.join(base_dir, file_path)
        try:
            df = pd.read_excel(full_path)
            all_data.append(df)
            print(f"✓ 已读取: {os.path.basename(file_path)} ({len(df)} 行)")
        except Exception as e:
            print(f"✗ 读取失败 {file_path}: {str(e)}")

    if not all_data:
        print("没有成功读取任何数据文件")
        return None

    # 合并所有数据
    combined_df = pd.concat(all_data, ignore_index=True)
    print(f"\n总数据行数: {len(combined_df)}")

    # 数据清理 - 处理百分比和货币字段
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
    total_units = combined_df['广告销量'].sum()

    # 计算整体指标
    overall_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
    overall_cpc = (total_spend / total_clicks) if total_clicks > 0 else 0
    overall_acos = (total_spend / total_sales * 100) if total_sales > 0 else 0
    overall_roas = (total_sales / total_spend) if total_spend > 0 else 0
    overall_cvr = (total_orders / total_clicks * 100) if total_clicks > 0 else 0
    overall_cpa = (total_spend / total_orders) if total_orders > 0 else 0

    print(f"\n【整体数据概览】")
    print(f"曝光量: {total_impressions:,.0f}")
    print(f"点击数: {total_clicks:,.0f}")
    print(f"广告花费: ${total_spend:,.2f}")
    print(f"广告销售额: ${total_sales:,.2f}")
    print(f"订单数: {total_orders:,.0f}")
    print(f"销量: {total_units:,.0f}")
    print(f"\n【整体表现指标】")
    print(f"CTR (点击率): {overall_ctr:.2f}%")
    print(f"CPC (单次点击成本): ${overall_cpc:.2f}")
    print(f"ACoS (广告销售成本): {overall_acos:.2f}%")
    print(f"ROAS (广告投资回报率): {overall_roas:.2f}")
    print(f"CVR (转化率): {overall_cvr:.2f}%")
    print(f"CPA (单次转化成本): ${overall_cpa:.2f}")

    # 按国家分析
    if '国家' in combined_df.columns:
        print(f"\n【按国家分析】")
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

        print(country_analysis.to_string(index=False))

    # 关键词表现分析（Top 20表现最好的）
    if '关键词' in combined_df.columns:
        print(f"\n【Top 20 表现最佳关键词（按ROAS排序）】")
        keyword_analysis = combined_df[combined_df['关键词'] != '--'].groupby('关键词').agg({
            '曝光量': 'sum',
            '点击': 'sum',
            '花费-本币': 'sum',
            '销售额-本币': 'sum',
            '广告订单': 'sum'
        }).reset_index()

        keyword_analysis['ROAS'] = (keyword_analysis['销售额-本币'] / keyword_analysis['花费-本币']).round(2)
        keyword_analysis['ACoS'] = (keyword_analysis['花费-本币'] / keyword_analysis['销售额-本币'] * 100).round(2)
        keyword_analysis['CTR'] = (keyword_analysis['点击'] / keyword_analysis['曝光量'] * 100).round(2)

        # 过滤：至少有10次点击和100美元花费
        keyword_analysis = keyword_analysis[
            (keyword_analysis['点击'] >= 10) &
            (keyword_analysis['花费-本币'] >= 100)
        ]

        top_keywords = keyword_analysis.nlargest(20, 'ROAS')[
            ['关键词', '曝光量', '点击', '花费-本币', '销售额-本币', '广告订单', 'CTR', 'ACoS', 'ROAS']
        ]
        print(top_keywords.to_string(index=False))

    # 问题关键词分析（高花费低回报）
    if '关键词' in combined_df.columns:
        print(f"\n【问题关键词（高花费但ROAS<1或无转化）】")
        problem_keywords = keyword_analysis[
            (keyword_analysis['花费-本币'] >= 50) &
            ((keyword_analysis['ROAS'] < 1) | (keyword_analysis['广告订单'] == 0))
        ].nlargest(20, '花费-本币')[
            ['关键词', '曝光量', '点击', '花费-本币', '销售额-本币', '广告订单', 'ACoS', 'ROAS']
        ]
        print(problem_keywords.to_string(index=False))

    # 按广告活动分析
    if '广告活动' in combined_df.columns:
        print(f"\n【广告活动表现分析】")
        campaign_analysis = combined_df[combined_df['广告活动'] != '--'].groupby('广告活动').agg({
            '曝光量': 'sum',
            '点击': 'sum',
            '花费-本币': 'sum',
            '销售额-本币': 'sum',
            '广告订单': 'sum'
        }).reset_index()

        campaign_analysis['CTR'] = (campaign_analysis['点击'] / campaign_analysis['曝光量'] * 100).round(2)
        campaign_analysis['ACoS'] = (campaign_analysis['花费-本币'] / campaign_analysis['销售额-本币'] * 100).round(2)
        campaign_analysis['ROAS'] = (campaign_analysis['销售额-本币'] / campaign_analysis['花费-本币']).round(2)

        # 按花费排序显示
        campaign_analysis = campaign_analysis.nlargest(15, '花费-本币')
        print(campaign_analysis.to_string(index=False))

    return {
        'store_name': store_name,
        'total_impressions': total_impressions,
        'total_clicks': total_clicks,
        'total_spend': total_spend,
        'total_sales': total_sales,
        'total_orders': total_orders,
        'overall_ctr': overall_ctr,
        'overall_cpc': overall_cpc,
        'overall_acos': overall_acos,
        'overall_roas': overall_roas,
        'overall_cvr': overall_cvr,
        'overall_cpa': overall_cpa,
        'top_keywords': top_keywords if 'top_keywords' in locals() else None,
        'problem_keywords': problem_keywords if 'problem_keywords' in locals() else None,
        'country_data': country_analysis if 'country_analysis' in locals() else None
    }

# 主分析循环
all_results = {}

for store_name, file_list in stores.items():
    result = analyze_store_group(store_name, file_list)
    if result:
        all_results[store_name] = result

# 输出对比总结
print(f"\n\n{'='*80}")
print("【所有店铺对比总结】")
print(f"{'='*80}\n")

comparison_df = pd.DataFrame([
    {
        '店铺组': result['store_name'],
        '广告花费': f"${result['total_spend']:,.2f}",
        '销售额': f"${result['total_sales']:,.2f}",
        'ACoS': f"{result['overall_acos']:.2f}%",
        'ROAS': f"{result['overall_roas']:.2f}",
        'CTR': f"{result['overall_ctr']:.2f}%",
        'CPC': f"${result['overall_cpc']:.2f}",
        'CVR': f"{result['overall_cvr']:.2f}%",
        '订单数': f"{int(result['total_orders']):,}"
    }
    for result in all_results.values()
])

print(comparison_df.to_string(index=False))

print("\n分析完成！")
