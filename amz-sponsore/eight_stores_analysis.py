import pandas as pd
import os
import numpy as np
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

# 设置数据目录
base_dir = '/Users/liujinxingzheng/Documents/ai-file/amz-sponsore'

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

def analyze_store(store_name, file_list):
    """分析单个店铺"""
    print(f"\n{'='*80}")
    print(f"店铺: {store_name}")
    print(f"{'='*80}\n")

    all_data = []

    # 读取所有文件
    for file_path in file_list:
        full_path = os.path.join(base_dir, file_path)
        try:
            df = pd.read_excel(full_path)
            all_data.append(df)
            market = os.path.basename(file_path).split('(')[0].split('-')[-1]
            print(f"✓ 已读取: {os.path.basename(file_path)} ({len(df)} 行)")
        except Exception as e:
            print(f"✗ 读取失败 {file_path}: {str(e)}")

    if not all_data:
        print("没有成功读取任何数据文件")
        return None

    # 合并所有数据
    combined_df = pd.concat(all_data, ignore_index=True)
    print(f"\n总数据行数: {len(combined_df)}")

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
    total_units = combined_df['广告销量'].sum()

    # 计算整体指标
    overall_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
    overall_cpc = (total_spend / total_clicks) if total_clicks > 0 else 0
    overall_acos = (total_spend / total_sales * 100) if total_sales > 0 else 0
    overall_roas = (total_sales / total_spend) if total_spend > 0 else 0
    overall_cvr = (total_orders / total_clicks * 100) if total_clicks > 0 else 0
    overall_cpa = (total_spend / total_orders) if total_orders > 0 else 0

    print(f"\n【核心指标】")
    print(f"曝光量: {total_impressions:,.0f}")
    print(f"点击数: {total_clicks:,.0f}")
    print(f"广告花费: ${total_spend:,.2f}")
    print(f"广告销售额: ${total_sales:,.2f}")
    print(f"订单数: {total_orders:,.0f}")
    print(f"CTR: {overall_ctr:.2f}%")
    print(f"CPC: ${overall_cpc:.2f}")
    print(f"ACoS: {overall_acos:.2f}%")
    print(f"ROAS: {overall_roas:.2f}")
    print(f"CVR: {overall_cvr:.2f}%")
    print(f"CPA: ${overall_cpa:.2f}")

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

    # Top 10关键词
    if '关键词' in combined_df.columns:
        keyword_analysis = combined_df[combined_df['关键词'] != '--'].groupby('关键词').agg({
            '点击': 'sum',
            '花费-本币': 'sum',
            '销售额-本币': 'sum',
            '广告订单': 'sum'
        }).reset_index()

        keyword_analysis['ROAS'] = (keyword_analysis['销售额-本币'] / keyword_analysis['花费-本币']).round(2)
        keyword_analysis['ACoS'] = (keyword_analysis['花费-本币'] / keyword_analysis['销售额-本币'] * 100).round(2)

        # 过滤：至少有10次点击
        keyword_analysis = keyword_analysis[keyword_analysis['点击'] >= 10]

        if len(keyword_analysis) > 0:
            print(f"\n【Top 10 关键词（按ROAS）】")
            top_keywords = keyword_analysis.nlargest(10, 'ROAS')[
                ['关键词', '点击', '花费-本币', '销售额-本币', '广告订单', 'ACoS', 'ROAS']
            ]
            print(top_keywords.to_string(index=False))

            # 问题关键词
            problem_keywords = keyword_analysis[
                (keyword_analysis['花费-本币'] >= 50) &
                ((keyword_analysis['ROAS'] < 1) | (keyword_analysis['广告订单'] == 0))
            ].nlargest(10, '花费-本币')[
                ['关键词', '点击', '花费-本币', '销售额-本币', '广告订单', 'ROAS']
            ]

            if len(problem_keywords) > 0:
                print(f"\n【问题关键词（花费≥$50但ROAS<1或无转化）】")
                print(problem_keywords.to_string(index=False))

    # Top 10广告活动
    if '广告活动' in combined_df.columns:
        campaign_analysis = combined_df[combined_df['广告活动'] != '--'].groupby('广告活动').agg({
            '花费-本币': 'sum',
            '销售额-本币': 'sum',
            '广告订单': 'sum'
        }).reset_index()

        campaign_analysis['ROAS'] = (campaign_analysis['销售额-本币'] / campaign_analysis['花费-本币']).round(2)
        campaign_analysis['ACoS'] = (campaign_analysis['花费-本币'] / campaign_analysis['销售额-本币'] * 100).round(2)

        if len(campaign_analysis) > 0:
            print(f"\n【Top 10 广告活动（按花费）】")
            top_campaigns = campaign_analysis.nlargest(10, '花费-本币')[
                ['广告活动', '花费-本币', '销售额-本币', '广告订单', 'ACoS', 'ROAS']
            ]
            print(top_campaigns.to_string(index=False))

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
        'overall_cpa': overall_cpa
    }

# 主分析循环
all_results = {}

for store_name, file_list in stores.items():
    result = analyze_store(store_name, file_list)
    if result:
        all_results[store_name] = result

# 输出对比总结
print(f"\n\n{'='*100}")
print("【8个店铺对比总结】")
print(f"{'='*100}\n")

comparison_df = pd.DataFrame([
    {
        '店铺': result['store_name'],
        '广告花费': f"${result['total_spend']:,.2f}",
        '销售额': f"${result['total_sales']:,.2f}",
        'ACoS': f"{result['overall_acos']:.2f}%",
        'ROAS': f"{result['overall_roas']:.2f}",
        'CTR': f"{result['overall_ctr']:.2f}%",
        'CPC': f"${result['overall_cpc']:.2f}",
        'CVR': f"{result['overall_cvr']:.2f}%",
        '订单': int(result['total_orders'])
    }
    for result in all_results.values()
])

# 按ACoS排序（从低到高）
comparison_df['ACoS_sort'] = comparison_df['ACoS'].str.replace('%', '').astype(float)
comparison_df = comparison_df.sort_values('ACoS_sort')
comparison_df = comparison_df.drop('ACoS_sort', axis=1)

print(comparison_df.to_string(index=False))

# 评级
print(f"\n【店铺评级】")
for _, row in comparison_df.iterrows():
    acos_val = float(row['ACoS'].replace('%', ''))
    roas_val = float(row['ROAS'])

    if acos_val <= 35 and roas_val >= 2.5:
        rating = "🟢 优秀"
    elif acos_val <= 45 and roas_val >= 2.0:
        rating = "🟡 良好"
    elif acos_val <= 55:
        rating = "🟠 需改进"
    else:
        rating = "🔴 需紧急优化"

    print(f"{row['店铺']:8s} - ACoS: {row['ACoS']:8s} ROAS: {row['ROAS']:6s} {rating}")

print("\n分析完成！")
