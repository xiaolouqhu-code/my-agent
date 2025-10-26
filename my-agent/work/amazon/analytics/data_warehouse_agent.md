# Data Warehouse Agent

## 角色定位
整合所有Agent的数据到统一数据仓库,建立数据模型,支持深度分析和BI报表,为决策提供数据基础设施。

## 核心职责

### 1. 数据集成
- 收集所有Agent输出数据
- 统一数据格式和标准
- 数据清洗和验证
- 建立数据关联关系

### 2. 数据仓库构建
- 设计数据模型(星型/雪花模型)
- 建立事实表和维度表
- 数据ETL流程
- 数据版本控制

### 3. 数据质量管理
- 监控数据完整性
- 检测数据异常
- 数据一致性验证
- 历史数据归档

### 4. 查询服务
- 提供数据API
- 支持BI工具集成
- 自定义报表查询
- 数据导出服务

## 输入数据
- 所有Agent的输出文件(CSV, JSON)
- Amazon SP-API原始数据
- 广告数据
- 财务数据

## 数据仓库架构

### 核心表结构

#### 事实表 (Fact Tables)
```sql
-- 销售事实表
CREATE TABLE fact_sales (
    sale_id SERIAL PRIMARY KEY,
    date_key INT,
    product_key INT,
    customer_key INT,
    order_id VARCHAR(50),
    quantity INT,
    unit_price DECIMAL(10,2),
    total_sales DECIMAL(10,2),
    cogs DECIMAL(10,2),
    amazon_fees DECIMAL(10,2),
    ad_cost DECIMAL(10,2),
    net_profit DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 广告事实表
CREATE TABLE fact_ads (
    ad_id SERIAL PRIMARY KEY,
    date_key INT,
    campaign_key INT,
    keyword_key INT,
    impressions INT,
    clicks INT,
    orders INT,
    sales DECIMAL(10,2),
    spend DECIMAL(10,2),
    acos DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 库存事实表
CREATE TABLE fact_inventory (
    inventory_id SERIAL PRIMARY KEY,
    date_key INT,
    product_key INT,
    fba_available INT,
    inbound INT,
    reserved INT,
    total_inventory INT,
    days_of_supply DECIMAL(5,1),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 评论事实表
CREATE TABLE fact_reviews (
    review_id VARCHAR(50) PRIMARY KEY,
    date_key INT,
    product_key INT,
    rating INT,
    verified_purchase BOOLEAN,
    sentiment VARCHAR(20),
    review_text TEXT,
    helpful_votes INT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 维度表 (Dimension Tables)
```sql
-- 日期维度
CREATE TABLE dim_date (
    date_key INT PRIMARY KEY,
    full_date DATE,
    year INT,
    quarter INT,
    month INT,
    week INT,
    day_of_week INT,
    day_name VARCHAR(10),
    is_weekend BOOLEAN,
    is_holiday BOOLEAN,
    holiday_name VARCHAR(50)
);

-- 产品维度
CREATE TABLE dim_product (
    product_key INT PRIMARY KEY,
    asin VARCHAR(20),
    sku VARCHAR(50),
    product_name VARCHAR(200),
    category VARCHAR(100),
    brand VARCHAR(100),
    list_price DECIMAL(10,2),
    launch_date DATE,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 广告活动维度
CREATE TABLE dim_campaign (
    campaign_key INT PRIMARY KEY,
    campaign_id VARCHAR(50),
    campaign_name VARCHAR(200),
    campaign_type VARCHAR(50),
    targeting_type VARCHAR(20),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 关键词维度
CREATE TABLE dim_keyword (
    keyword_key INT PRIMARY KEY,
    keyword_text VARCHAR(200),
    match_type VARCHAR(20),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 供应商维度
CREATE TABLE dim_supplier (
    supplier_key INT PRIMARY KEY,
    supplier_name VARCHAR(100),
    country VARCHAR(50),
    material_type VARCHAR(50),
    rating DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 聚合表 (Aggregate Tables)
```sql
-- 每日产品业绩汇总
CREATE TABLE agg_product_daily (
    product_key INT,
    date_key INT,
    units_sold INT,
    total_sales DECIMAL(10,2),
    total_profit DECIMAL(10,2),
    ad_spend DECIMAL(10,2),
    acos DECIMAL(5,4),
    avg_rating DECIMAL(3,2),
    review_count INT,
    PRIMARY KEY (product_key, date_key)
);

-- 每周广告活动汇总
CREATE TABLE agg_campaign_weekly (
    campaign_key INT,
    week_start_date DATE,
    total_impressions BIGINT,
    total_clicks INT,
    total_orders INT,
    total_sales DECIMAL(10,2),
    total_spend DECIMAL(10,2),
    avg_cpc DECIMAL(5,2),
    avg_cvr DECIMAL(5,4),
    acos DECIMAL(5,4),
    PRIMARY KEY (campaign_key, week_start_date)
);
```

## ETL流程

### 数据流程图
```
[Agent Outputs]
    ↓
[Data Collector]
    ↓
[Data Validator]
    ↓
[Data Transformer]
    ↓
[Data Loader]
    ↓
[Data Warehouse]
    ↓
[BI Tools / Reports]
```

### ETL脚本示例
```python
class DataWarehouseAgent:
    def __init__(self, db_connection):
        self.db = db_connection

    def run_etl(self):
        # 1. Extract - 从各Agent收集数据
        sales_data = self.extract_sales_data()
        ads_data = self.extract_ads_data()
        inventory_data = self.extract_inventory_data()
        review_data = self.extract_review_data()

        # 2. Transform - 数据转换和清洗
        sales_transformed = self.transform_sales(sales_data)
        ads_transformed = self.transform_ads(ads_data)

        # 3. Load - 加载到数据仓库
        self.load_to_warehouse(sales_transformed, 'fact_sales')
        self.load_to_warehouse(ads_transformed, 'fact_ads')

        # 4. 更新聚合表
        self.update_aggregates()

        # 5. 数据质量检查
        self.run_quality_checks()

    def extract_sales_data(self):
        # 从Amazon SP-API或本地文件提取销售数据
        sales_files = glob.glob('data/output/sales_*.csv')
        dfs = [pd.read_csv(f) for f in sales_files]
        return pd.concat(dfs, ignore_index=True)

    def transform_sales(self, df):
        # 数据清洗
        df = df.dropna(subset=['order_id'])
        df = df[df['total_sales'] > 0]

        # 添加派生字段
        df['net_profit'] = df['total_sales'] - df['cogs'] - df['amazon_fees'] - df['ad_cost']
        df['margin'] = df['net_profit'] / df['total_sales']

        # 添加date_key
        df['date_key'] = df['order_date'].apply(self.date_to_key)

        # 添加product_key
        df['product_key'] = df['asin'].apply(self.get_product_key)

        return df

    def load_to_warehouse(self, df, table_name):
        # 批量插入
        df.to_sql(
            table_name,
            self.db,
            if_exists='append',
            index=False,
            method='multi',
            chunksize=1000
        )

    def update_aggregates(self):
        # 更新每日产品汇总
        query = """
        INSERT INTO agg_product_daily
        SELECT
            product_key,
            date_key,
            SUM(quantity) as units_sold,
            SUM(total_sales) as total_sales,
            SUM(net_profit) as total_profit,
            SUM(ad_cost) as ad_spend,
            CASE WHEN SUM(total_sales) > 0
                THEN SUM(ad_cost) / SUM(total_sales)
                ELSE 0
            END as acos,
            AVG(rating) as avg_rating,
            COUNT(DISTINCT review_id) as review_count
        FROM fact_sales fs
        LEFT JOIN fact_reviews fr ON fs.product_key = fr.product_key
            AND fs.date_key = fr.date_key
        WHERE fs.date_key >= (SELECT MAX(date_key) - 7 FROM agg_product_daily)
        GROUP BY product_key, date_key
        ON CONFLICT (product_key, date_key)
        DO UPDATE SET
            units_sold = EXCLUDED.units_sold,
            total_sales = EXCLUDED.total_sales,
            total_profit = EXCLUDED.total_profit;
        """
        self.db.execute(query)

    def run_quality_checks(self):
        checks = []

        # 检查1: 销售金额不能为负
        negative_sales = self.db.execute("""
            SELECT COUNT(*) FROM fact_sales WHERE total_sales < 0
        """).fetchone()[0]

        checks.append({
            'check': 'No negative sales',
            'passed': negative_sales == 0,
            'details': f'{negative_sales} records with negative sales'
        })

        # 检查2: 日期完整性
        missing_dates = self.db.execute("""
            SELECT COUNT(*) FROM (
                SELECT generate_series(
                    (SELECT MIN(full_date) FROM dim_date),
                    CURRENT_DATE,
                    '1 day'::interval
                ) AS date
            ) dates
            LEFT JOIN dim_date ON dates.date = dim_date.full_date
            WHERE dim_date.date_key IS NULL
        """).fetchone()[0]

        checks.append({
            'check': 'Complete date dimension',
            'passed': missing_dates == 0,
            'details': f'{missing_dates} missing dates'
        })

        return checks
```

## 数据模型

### 星型模式示例
```
       ┌─────────────┐
       │ dim_product │
       └──────┬──────┘
              │
       ┌──────┴──────┐
       │             │
┌──────▼──────┐ ┌───▼───────┐
│  dim_date   │ │ fact_sales│
└──────┬──────┘ └───┬───────┘
       │            │
       └────────────┘
```

## BI集成

### 支持的BI工具
- **Metabase** (开源, 易用)
- **Tableau**
- **Power BI**
- **Looker**
- **Google Data Studio**

### 示例查询 - 产品表现仪表板
```sql
-- 过去30天销售趋势
SELECT
    dd.full_date,
    dp.product_name,
    SUM(fs.quantity) as units,
    SUM(fs.total_sales) as sales,
    SUM(fs.net_profit) as profit
FROM fact_sales fs
JOIN dim_date dd ON fs.date_key = dd.date_key
JOIN dim_product dp ON fs.product_key = dp.product_key
WHERE dd.full_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY dd.full_date, dp.product_name
ORDER BY dd.full_date;

-- 广告ROI分析
SELECT
    dc.campaign_name,
    SUM(fa.impressions) as total_impressions,
    SUM(fa.clicks) as total_clicks,
    SUM(fa.orders) as total_orders,
    SUM(fa.sales) as total_sales,
    SUM(fa.spend) as total_spend,
    SUM(fa.sales) / NULLIF(SUM(fa.spend), 0) as roas,
    SUM(fa.spend) / NULLIF(SUM(fa.sales), 0) as acos
FROM fact_ads fa
JOIN dim_campaign dc ON fa.campaign_key = dc.campaign_key
JOIN dim_date dd ON fa.date_key = dd.date_key
WHERE dd.full_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY dc.campaign_name
ORDER BY total_sales DESC;
```

## 输出内容

### data_quality_report.json
```json
{
  "report_date": "2025-01-16",
  "etl_runs": {
    "total_runs_today": 24,
    "successful": 24,
    "failed": 0,
    "avg_duration_seconds": 45
  },
  "data_quality_checks": [
    {
      "check_name": "No negative sales",
      "status": "Passed",
      "records_checked": 125000,
      "issues_found": 0
    },
    {
      "check_name": "Complete date dimension",
      "status": "Passed",
      "date_range": "2023-01-01 to 2025-01-16",
      "missing_dates": 0
    },
    {
      "check_name": "Product key integrity",
      "status": "Passed",
      "orphaned_records": 0
    }
  ],
  "table_statistics": {
    "fact_sales": {
      "total_rows": 125430,
      "rows_added_today": 450,
      "size_mb": 45.2
    },
    "fact_ads": {
      "total_rows": 89200,
      "rows_added_today": 1200,
      "size_mb": 32.1
    },
    "fact_inventory": {
      "total_rows": 15680,
      "rows_added_today": 48,
      "size_mb": 5.8
    }
  }
}
```

## 执行频率
- **每小时**: ETL增量数据更新
- **每日**: 全量数据质量检查
- **每周**: 性能优化和索引重建
- **每月**: 数据归档和清理

## 技术栈

### 数据库选择
- **PostgreSQL**: 功能强大,开源,适合中小规模
- **BigQuery**: 谷歌云,适合大规模数据
- **Redshift**: AWS,数据仓库专用
- **Snowflake**: 云原生,弹性扩展

### ETL工具
- **Apache Airflow**: 工作流编排
- **dbt**: 数据转换建模
- **Python pandas**: 数据处理
- **Singer/Meltano**: ELT框架

## 依赖
- 上游: 所有Agent输出
- 下游: Weekly Report Agent, BI工具

## 数据治理

### 数据保留策略
```yaml
data_retention:
  fact_tables:
    raw_data: 2_years
    aggregated_daily: 5_years
    aggregated_monthly: unlimited

  dimension_tables:
    scd_type_2: unlimited  # 保留所有历史版本

  logs:
    etl_logs: 90_days
    error_logs: 1_year
```

### 安全和权限
- 数据加密(传输和存储)
- 角色基于访问控制(RBAC)
- 审计日志
- PII数据脱敏

## 注意事项
1. 确保数据一致性和完整性
2. 定期备份数据
3. 监控查询性能,优化慢查询
4. 文档化数据字典和血缘关系
5. 遵守数据隐私法规(GDPR, CCPA)
6. 定期清理冗余数据
