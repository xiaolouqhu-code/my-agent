# Amazon 广告分析系统

这是一个用于分析 Amazon 广告数据并生成优化建议的自动化系统。

## 📁 目录结构

```
amz-sponsore/
├── config.py                                    # 配置管理模块
├── .env                                         # 环境变量配置
├── generate_detailed_keyword_recommendations.py # 生成详细关键词建议
├── generate_store_recommendations.py            # 生成店铺总体建议
├── eight_stores_analysis.py                     # 8店铺对比分析
├── analyze_ads.py                               # 单店广告分析
├── full_analysis.py                             # 完整分析
└── [数据文件夹]/                                # 各店铺原始数据

/ai-file/download/                               # 统一输出目录
└── 广告调整建议/                                # 广告建议报告
```

## ⚙️ 配置说明

### 环境变量 (.env)

系统使用 `.env` 文件管理所有路径配置：

```bash
# 输出文件目录 - 所有生成的报告都保存在这里
OUTPUT_DIR=/Users/liujinxingzheng/Documents/ai-file/download

# 数据源目录 - 原始数据文件位置
DATA_DIR=/Users/liujinxingzheng/Documents/ai-file/amz-sponsore
```

### 修改输出路径

如需更改输出位置，只需编辑 `.env` 文件中的 `OUTPUT_DIR` 变量即可，无需修改任何脚本代码。

## 🚀 使用方法

### 1. 生成详细关键词调整建议

```bash
python3 generate_detailed_keyword_recommendations.py
```

为8个店铺生成详细的关键词级别操作建议，包括：
- 需要暂停的关键词
- 需要降价的关键词（含具体新CPC建议）
- 建议提价的关键词（含具体新CPC建议）
- 需要观察的关键词
- 完整CSV格式清单
- 执行时间表和ROI预期

### 2. 生成店铺总体建议

```bash
python3 generate_store_recommendations.py
```

为8个店铺生成总体广告优化建议，包括：
- 核心指标总览
- 市场表现分析
- Top关键词分析
- 问题关键词识别
- 广告活动建议

### 3. 8店铺对比分析

```bash
python3 eight_stores_analysis.py
```

生成8个店铺的横向对比分析报告。

## 📊 输出文件

所有生成的文件都保存在 `/ai-file/download/` 目录下：

- **广告调整建议/**
  - `YYYYMMDD-广告调整建议-店铺名.md` - 每个店铺的详细建议报告

## 🔧 配置模块 (config.py)

提供统一的配置管理接口：

```python
from config import get_data_path, get_output_path, ensure_output_dir

# 获取数据文件路径
data_file = get_data_path('zozo+奇宝乐/ZOZO-US-数据.xlsx')

# 获取输出文件路径
output_file = get_output_path('报告.md', '广告调整建议')

# 确保输出目录存在
output_dir = ensure_output_dir('广告调整建议')
```

## 📦 依赖包

```bash
pip3 install pandas openpyxl python-dotenv numpy
```

## 🏪 支持的店铺

系统当前支持以下8个店铺的分析：

1. ZOZO
2. 奇宝乐
3. 智恒
4. 新晟
5. 朵越
6. 琴心
7. 建峰
8. 民誉

## 📝 报告特点

### 详细关键词建议报告特点

1. **智能分类** - 根据ROAS、ACoS自动分类关键词
2. **具体操作** - 提供精确的CPC调整建议（如 $0.40 → $0.30）
3. **优先级排序** - 按紧急程度排列操作任务
4. **预期效果** - 预测优化后的ROI提升
5. **CSV导出** - 可直接导入Amazon后台批量操作
6. **执行时间表** - 明确今天、明天、本周的执行计划

## 🔄 更新日志

### 2025-10-27
- ✅ 添加统一配置管理系统
- ✅ 使用环境变量管理路径
- ✅ 所有输出文件统一到 `/ai-file/download/`
- ✅ 创建详细关键词级别建议生成器
- ✅ 支持具体CPC调整建议

### 2024-10-26
- ✅ 初始版本
- ✅ 支持8个店铺的广告分析
- ✅ 生成基础优化建议

## 📧 问题反馈

如遇到问题，请检查：
1. `.env` 文件是否存在且路径正确
2. `python-dotenv` 包是否已安装
3. 输出目录是否有写入权限
