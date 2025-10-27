import pandas as pd
import os
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

def analyze_file(file_path):
    """分析单个文件"""
    try:
        df = pd.read_excel(file_path)

        # 打印列名以了解数据结构
        print(f"\n文件: {os.path.basename(file_path)}")
        print(f"列名: {list(df.columns)}")
        print(f"数据行数: {len(df)}")

        # 显示前几行数据
        print("\n前5行数据:")
        print(df.head())

        return df
    except Exception as e:
        print(f"读取文件出错 {file_path}: {str(e)}")
        return None

# 先分析第一个店铺组的第一个文件，了解数据结构
print("=" * 80)
print("分析ZOZO+奇宝乐店铺数据结构")
print("=" * 80)

first_file = os.path.join(base_dir, stores['ZOZO+奇宝乐'][0])
analyze_file(first_file)
