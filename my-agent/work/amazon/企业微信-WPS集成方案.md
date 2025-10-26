# 📱 企业微信 + WPS 集成方案

**项目代号**: `flowgold-wecom-wps-integration`
**设计时间**: 2025-10-26
**目标**: 将数据监控系统与企业微信、WPS深度集成，实现移动办公和协同工作

---

## 🎯 集成目标

### 企业微信集成
1. **实时预警推送** - 断货、ACOS异常等紧急情况立即通知
2. **每日数据报告** - 早上8点自动推送昨日数据总结
3. **移动端查看** - 在企业微信中直接查看Dashboard
4. **审批流程** - 补货申请、调价审批等

### WPS集成
1. **自动生成报表** - 每日/周/月报表自动生成到WPS表格
2. **在线协作** - 团队成员可以在线查看和批注
3. **数据导出** - 支持导出为Excel格式分享
4. **文档归档** - 历史报告自动保存到WPS云文档

---

## 📱 企业微信集成详细方案

### 1. 架构设计

```
┌─────────────────────────────────────────────────┐
│           数据监控系统（Next.js）                │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│         企业微信集成层（API Wrapper）            │
├─────────────────────────────────────────────────┤
│ ├─ 消息推送服务                                  │
│ ├─ 应用管理                                      │
│ ├─ 用户认证                                      │
│ └─ 审批流程                                      │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│         企业微信开放平台 API                      │
├─────────────────────────────────────────────────┤
│ ├─ 消息发送API                                   │
│ ├─ 应用主页API                                   │
│ ├─ 身份验证API                                   │
│ └─ 审批流程API                                   │
└─────────────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│              企业微信客户端                       │
├─────────────────────────────────────────────────┤
│ ├─ 接收预警消息                                  │
│ ├─ 查看数据看板（H5页面）                        │
│ ├─ 处理审批流程                                  │
│ └─ 接收每日报告                                  │
└─────────────────────────────────────────────────┘
```

### 2. 企业微信应用配置

#### 2.1 创建企业微信自建应用

**步骤**：
1. 登录企业微信管理后台：https://work.weixin.qq.com/
2. 进入"应用管理" → "自建" → "创建应用"
3. 填写应用信息：
   - 应用名称：流金亚马逊数据中心
   - 应用Logo：上传公司Logo
   - 可见范围：选择需要使用的部门/人员

#### 2.2 获取配置信息

```
企业ID (corpId): ww1234567890abcdef
应用AgentId: 1000001
应用Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. 消息推送功能实现

#### 3.1 文本消息（预警通知）

```typescript
// lib/wecom/message.ts

import axios from 'axios';

interface WeComConfig {
  corpId: string;
  agentId: string;
  secret: string;
}

export class WeComMessageService {
  private config: WeComConfig;
  private accessToken: string = '';
  private tokenExpireTime: number = 0;

  constructor(config: WeComConfig) {
    this.config = config;
  }

  // 获取access_token
  async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.accessToken && now < this.tokenExpireTime) {
      return this.accessToken;
    }

    const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${this.config.corpId}&corpsecret=${this.config.secret}`;
    const response = await axios.get(url);

    if (response.data.errcode === 0) {
      this.accessToken = response.data.access_token;
      this.tokenExpireTime = now + (response.data.expires_in - 300) * 1000; // 提前5分钟刷新
      return this.accessToken;
    }

    throw new Error(`获取access_token失败: ${response.data.errmsg}`);
  }

  // 发送文本消息
  async sendTextMessage(
    content: string,
    toUser?: string, // 指定用户，默认@all
    toParty?: string, // 指定部门
  ): Promise<void> {
    const token = await this.getAccessToken();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${token}`;

    const payload = {
      touser: toUser || '@all',
      toparty: toParty || '',
      msgtype: 'text',
      agentid: this.config.agentId,
      text: {
        content: content
      },
      safe: 0
    };

    const response = await axios.post(url, payload);

    if (response.data.errcode !== 0) {
      throw new Error(`发送消息失败: ${response.data.errmsg}`);
    }
  }

  // 发送Markdown消息
  async sendMarkdownMessage(
    content: string,
    toUser?: string
  ): Promise<void> {
    const token = await this.getAccessToken();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${token}`;

    const payload = {
      touser: toUser || '@all',
      msgtype: 'markdown',
      agentid: this.config.agentId,
      markdown: {
        content: content
      }
    };

    const response = await axios.post(url, payload);

    if (response.data.errcode !== 0) {
      throw new Error(`发送消息失败: ${response.data.errmsg}`);
    }
  }

  // 发送文本卡片（图文消息）
  async sendTextCardMessage(
    title: string,
    description: string,
    url: string,
    btnText: string = '详情'
  ): Promise<void> {
    const token = await this.getAccessToken();
    const apiUrl = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${token}`;

    const payload = {
      touser: '@all',
      msgtype: 'textcard',
      agentid: this.config.agentId,
      textcard: {
        title: title,
        description: description,
        url: url,
        btntxt: btnText
      }
    };

    const response = await axios.post(apiUrl, payload);

    if (response.data.errcode !== 0) {
      throw new Error(`发送消息失败: ${response.data.errmsg}`);
    }
  }
}
```

#### 3.2 预警消息模板

```typescript
// lib/wecom/alert-templates.ts

export function generateCriticalAlertMessage(alerts: Alert[]): string {
  const alertCount = alerts.length;

  let message = `🚨 【紧急预警】检测到${alertCount}个严重问题\n\n`;

  alerts.forEach((alert, index) => {
    message += `${index + 1}. ${alert.message}\n`;
    message += `   建议操作: ${alert.action}\n\n`;
  });

  message += `请立即处理！\n`;
  message += `查看详情: https://dashboard.flowgold.ai/alerts`;

  return message;
}

export function generateDailyReportMessage(data: DailyData): string {
  return `
📊 【流金亚马逊每日数据】${data.date}

💰 销售数据
├─ 昨日销售额: $${data.revenue.toLocaleString()}
├─ 订单量: ${data.orders}
└─ 环比: ${data.revenueChange > 0 ? '📈' : '📉'} ${Math.abs(data.revenueChange)}%

📈 运营指标
├─ 平均毛利率: ${data.avgGrossMargin}%
├─ 平均ACOS: ${data.avgAcos}%
└─ ROAS: ${data.roas}

🏬 店铺表现 TOP3
1. ${data.topStores[0].name}: $${data.topStores[0].revenue}
2. ${data.topStores[1].name}: $${data.topStores[1].revenue}
3. ${data.topStores[2].name}: $${data.topStores[2].revenue}

⚠️ 需要关注
${data.warnings.map(w => `• ${w}`).join('\n')}

查看完整报告 👉 https://dashboard.flowgold.ai
  `.trim();
}
```

#### 3.3 定时推送任务

```typescript
// lib/cron-jobs.ts (添加到现有文件)

import { WeComMessageService } from './wecom/message';
import { generateDailyReportMessage } from './wecom/alert-templates';

const wecom = new WeComMessageService({
  corpId: process.env.WECOM_CORP_ID!,
  agentId: process.env.WECOM_AGENT_ID!,
  secret: process.env.WECOM_SECRET!
});

// 每天早上8点推送日报
cron.schedule('0 8 * * *', async () => {
  console.log('生成并推送每日数据报告...');

  // 1. 获取昨日数据
  const dailyData = await getDailyReportData();

  // 2. 生成消息
  const message = generateDailyReportMessage(dailyData);

  // 3. 推送到企业微信
  await wecom.sendMarkdownMessage(message);

  console.log('每日报告推送完成');
});

// 每小时检查预警并推送
cron.schedule('0 * * * *', async () => {
  const criticalAlerts = await getAlerts('CRITICAL');

  if (criticalAlerts.length > 0) {
    const message = generateCriticalAlertMessage(criticalAlerts);
    await wecom.sendTextMessage(message);
  }
});
```

### 4. 企业微信H5应用（移动端Dashboard）

#### 4.1 配置应用主页

在企业微信应用设置中配置：
- 应用主页URL: `https://dashboard.flowgold.ai/mobile`
- 可信域名: `dashboard.flowgold.ai`

#### 4.2 移动端页面适配

```tsx
// app/mobile/page.tsx

export default function MobileDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部KPI卡片 */}
      <div className="p-4 space-y-3">
        <MobileKPICard
          title="今日销售额"
          value="$12,345"
          change="+8.2%"
          trend="up"
        />
        <MobileKPICard
          title="平均毛利率"
          value="12.3%"
          target="15%"
          status="warning"
        />
      </div>

      {/* 预警列表 */}
      <div className="px-4 py-3 bg-white">
        <h2 className="text-lg font-semibold mb-3">🚨 预警</h2>
        <AlertList alerts={alerts} compact />
      </div>

      {/* 店铺快速切换 */}
      <div className="px-4 py-3">
        <h2 className="text-lg font-semibold mb-3">🏬 店铺</h2>
        <StoreGrid stores={stores} />
      </div>

      {/* 底部导航 */}
      <MobileBottomNav />
    </div>
  );
}
```

#### 4.3 企业微信JS-SDK集成

```typescript
// lib/wecom/jssdk.ts

export async function initWeComJSSDK() {
  // 引入企业微信JS-SDK
  const script = document.createElement('script');
  script.src = 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js';
  document.head.appendChild(script);

  script.onload = async () => {
    // 获取签名
    const signature = await getJsApiSignature(window.location.href);

    // 配置
    wx.config({
      beta: true,
      debug: false,
      appId: signature.corpId,
      timestamp: signature.timestamp,
      nonceStr: signature.nonceStr,
      signature: signature.signature,
      jsApiList: [
        'scanQRCode',
        'getLocation',
        'chooseImage',
        'uploadImage'
      ]
    });

    wx.ready(() => {
      console.log('企业微信JS-SDK初始化成功');
    });
  };
}
```

### 5. 审批流程集成

#### 5.1 补货申请流程

```typescript
// lib/wecom/approval.ts

export async function createReplenishmentApproval(data: {
  asin: string;
  productName: string;
  currentStock: number;
  suggestedQty: number;
  estimatedCost: number;
  urgency: 'normal' | 'urgent';
}) {
  const token = await wecom.getAccessToken();
  const url = `https://qyapi.weixin.qq.com/cgi-bin/oa/applyevent?access_token=${token}`;

  const payload = {
    creator_userid: 'system',
    template_id: 'replenishment_template_001', // 需在企业微信后台创建模板
    use_template_approver: 1,
    apply_data: {
      contents: [
        {
          control: 'Text',
          id: 'ASIN',
          value: { text: data.asin }
        },
        {
          control: 'Text',
          id: 'ProductName',
          value: { text: data.productName }
        },
        {
          control: 'Number',
          id: 'CurrentStock',
          value: { new_number: data.currentStock.toString() }
        },
        {
          control: 'Number',
          id: 'SuggestedQty',
          value: { new_number: data.suggestedQty.toString() }
        },
        {
          control: 'Money',
          id: 'EstimatedCost',
          value: { new_money: (data.estimatedCost * 100).toString() } // 单位：分
        }
      ]
    },
    summary_list: [
      {
        summary_info: [
          { text: '补货申请', lang: 'zh_CN' },
          { text: data.productName, lang: 'zh_CN' }
        ]
      }
    ]
  };

  const response = await axios.post(url, payload);
  return response.data;
}
```

---

## 📊 WPS集成详细方案

### 1. WPS开放平台架构

```
┌─────────────────────────────────────────────────┐
│           数据监控系统（Next.js）                │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│         WPS集成层（API Wrapper）                 │
├─────────────────────────────────────────────────┤
│ ├─ 文档创建服务                                  │
│ ├─ 数据写入服务                                  │
│ ├─ 权限管理                                      │
│ └─ 模板管理                                      │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│         WPS开放平台 API                          │
├─────────────────────────────────────────────────┤
│ ├─ 表格API（类似Google Sheets API）             │
│ ├─ 文档API                                      │
│ ├─ 协作API                                      │
│ └─ 云文档API                                    │
└─────────────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│              WPS云文档                           │
├─────────────────────────────────────────────────┤
│ ├─ 在线查看/编辑                                 │
│ ├─ 团队协作                                      │
│ ├─ 评论批注                                      │
│ └─ 版本管理                                      │
└─────────────────────────────────────────────────┘
```

### 2. WPS API接入

#### 2.1 注册WPS开放平台

**步骤**：
1. 访问：https://open.wps.cn/
2. 注册开发者账号
3. 创建应用，获取AppID和AppSecret

#### 2.2 WPS表格API集成

```typescript
// lib/wps/spreadsheet.ts

import axios from 'axios';

interface WPSConfig {
  appId: string;
  appSecret: string;
}

export class WPSSpreadsheetService {
  private config: WPSConfig;
  private accessToken: string = '';

  constructor(config: WPSConfig) {
    this.config = config;
  }

  // 获取access_token
  async getAccessToken(): Promise<string> {
    // WPS的OAuth 2.0认证流程
    const url = 'https://open.wps.cn/api/v1/oauth2/token';
    const response = await axios.post(url, {
      grant_type: 'client_credentials',
      appid: this.config.appId,
      secret: this.config.appSecret
    });

    this.accessToken = response.data.access_token;
    return this.accessToken;
  }

  // 创建新表格
  async createSpreadsheet(title: string): Promise<string> {
    const token = await this.getAccessToken();
    const url = 'https://open.wps.cn/api/v1/spreadsheet/create';

    const response = await axios.post(
      url,
      { title },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    return response.data.file_id;
  }

  // 写入数据到表格
  async writeData(
    fileId: string,
    sheetName: string,
    data: any[][],
    startRow: number = 1,
    startCol: number = 1
  ): Promise<void> {
    const token = await this.getAccessToken();
    const url = `https://open.wps.cn/api/v1/spreadsheet/${fileId}/values`;

    const range = `${sheetName}!${this.columnToLetter(startCol)}${startRow}`;

    await axios.put(
      url,
      {
        range,
        values: data
      },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
  }

  // 读取表格数据
  async readData(
    fileId: string,
    range: string
  ): Promise<any[][]> {
    const token = await this.getAccessToken();
    const url = `https://open.wps.cn/api/v1/spreadsheet/${fileId}/values/${range}`;

    const response = await axios.get(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    return response.data.values;
  }

  // 设置表格格式
  async formatCells(
    fileId: string,
    range: string,
    format: {
      backgroundColor?: string;
      fontColor?: string;
      fontSize?: number;
      bold?: boolean;
    }
  ): Promise<void> {
    const token = await this.getAccessToken();
    const url = `https://open.wps.cn/api/v1/spreadsheet/${fileId}/format`;

    await axios.post(
      url,
      { range, format },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
  }

  // 列号转字母（A, B, C...）
  private columnToLetter(column: number): string {
    let temp, letter = '';
    while (column > 0) {
      temp = (column - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      column = (column - temp - 1) / 26;
    }
    return letter;
  }
}
```

### 3. 自动生成报表

#### 3.1 每日报表生成

```typescript
// lib/wps/daily-report.ts

import { WPSSpreadsheetService } from './spreadsheet';

export async function generateDailyReport(date: string) {
  const wps = new WPSSpreadsheetService({
    appId: process.env.WPS_APP_ID!,
    appSecret: process.env.WPS_APP_SECRET!
  });

  // 1. 创建新表格
  const title = `流金亚马逊日报_${date}`;
  const fileId = await wps.createSpreadsheet(title);

  // 2. 获取数据
  const data = await getDailyReportData(date);

  // 3. 写入总览数据
  await wps.writeData(fileId, 'Sheet1', [
    ['流金亚马逊每日数据报告'],
    ['日期', date],
    [''],
    ['核心指标', '数值', '环比', '目标'],
    ['总销售额', `$${data.revenue}`, `${data.revenueChange}%`, '-'],
    ['平均毛利率', `${data.avgGrossMargin}%`, `${data.marginChange}%`, '15%'],
    ['平均ACOS', `${data.avgAcos}%`, `${data.acosChange}%`, '<30%'],
    ['订单量', data.orders, `${data.ordersChange}%`, '-']
  ]);

  // 4. 格式化标题行
  await wps.formatCells(fileId, 'Sheet1!A1:D1', {
    backgroundColor: '#4472C4',
    fontColor: '#FFFFFF',
    fontSize: 14,
    bold: true
  });

  // 5. 写入店铺数据
  const storeData = [
    ['店铺名称', '销售额', '订单量', '毛利率', 'ACOS'],
    ...data.stores.map(store => [
      store.name,
      `$${store.revenue}`,
      store.orders,
      `${store.margin}%`,
      `${store.acos}%`
    ])
  ];

  await wps.writeData(fileId, 'Sheet1', storeData, 11, 1);

  // 6. 写入TOP产品
  const productData = [
    ['ASIN', '产品名称', '销量', '销售额', '毛利率', 'ROAS'],
    ...data.topProducts.map(p => [
      p.asin,
      p.name,
      p.sales,
      `$${p.revenue}`,
      `${p.margin}%`,
      p.roas
    ])
  ];

  await wps.writeData(fileId, 'Sheet1', productData, 11 + storeData.length + 2, 1);

  // 7. 返回文件链接
  const shareLink = await wps.getShareLink(fileId);
  return { fileId, shareLink };
}
```

#### 3.2 定时生成并推送

```typescript
// lib/cron-jobs.ts (添加)

// 每天早上8:30：生成WPS日报并推送到企业微信
cron.schedule('30 8 * * *', async () => {
  console.log('生成WPS每日报表...');

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const date = yesterday.toISOString().split('T')[0];

  // 生成WPS报表
  const report = await generateDailyReport(date);

  // 推送到企业微信
  await wecom.sendTextCardMessage(
    `📊 每日数据报表已生成 - ${date}`,
    '点击查看详细数据报表（可在线编辑和协作）',
    report.shareLink,
    '查看报表'
  );

  console.log('WPS报表生成并推送完成');
});
```

### 4. 报表模板设计

#### 4.1 每日报表模板

```
┌──────────────────────────────────────────────────────┐
│ 流金亚马逊每日数据报告                                │
│ 日期: 2025-10-26                                      │
├──────────────────────────────────────────────────────┤
│ 核心指标    │ 数值      │ 环比    │ 目标              │
├──────────────────────────────────────────────────────┤
│ 总销售额    │ $12,345   │ +8.2%   │ -                │
│ 平均毛利率  │ 12.3%     │ +2.1%   │ 15%              │
│ 平均ACOS    │ 32.1%     │ -1.5%   │ <30%             │
│ 订单量      │ 856       │ +5.3%   │ -                │
├──────────────────────────────────────────────────────┤
│ 店铺表现                                              │
├──────────────────────────────────────────────────────┤
│ 店铺名称    │ 销售额    │ 订单    │ 毛利率 │ ACOS    │
│ 新晟        │ $3,456    │ 234     │ 13.2%  │ 28.5%   │
│ 智恒        │ $2,890    │ 189     │ 11.8%  │ 33.2%   │
│ ...                                                   │
├──────────────────────────────────────────────────────┤
│ TOP 10 产品                                           │
├──────────────────────────────────────────────────────┤
│ ASIN        │ 产品名    │ 销量 │ 销售额 │ 毛利率 │ ROAS │
│ B0DCJ531MQ  │ 转换器    │ 45   │ $890   │ 34.2%  │ 4.90 │
│ ...                                                   │
└──────────────────────────────────────────────────────┘
```

#### 4.2 周报模板

```typescript
// lib/wps/weekly-report.ts

export async function generateWeeklyReport(weekStart: string, weekEnd: string) {
  const wps = new WPSSpreadsheetService({
    appId: process.env.WPS_APP_ID!,
    appSecret: process.env.WPS_APP_SECRET!
  });

  const title = `流金亚马逊周报_${weekStart}_${weekEnd}`;
  const fileId = await wps.createSpreadsheet(title);

  const data = await getWeeklyReportData(weekStart, weekEnd);

  // 创建多个Sheet
  // Sheet1: 总览
  // Sheet2: 店铺对比
  // Sheet3: 产品分析
  // Sheet4: 广告分析
  // Sheet5: 预警汇总

  // ... 实现细节
}
```

---

## 🔄 完整工作流程示例

### 场景1：断货预警自动处理

```
1. 系统检测到断货
   ↓
2. 触发预警规则
   ↓
3. 保存到数据库alerts表
   ↓
4. 推送企业微信消息（文本）
   【紧急预警】
   库存告急：B081C32LWG 仅剩0天库存
   建议操作：紧急补货
   ↓
5. 用户点击消息
   ↓
6. 打开H5页面，显示详细信息
   ↓
7. 用户点击"发起补货申请"
   ↓
8. 创建企业微信审批流程
   ↓
9. 审批通过后，记录到系统
```

### 场景2：每日数据报告

```
时间：每天早上8:00

1. Cron任务触发
   ↓
2. 从数据库获取昨日数据
   ↓
3. 计算各项KPI指标
   ↓
4. 生成Markdown格式消息
   ↓
5. 推送到企业微信（所有人）
   ↓
6. 8:30 自动生成WPS报表
   ↓
7. 推送WPS报表链接到企业微信
   ↓
8. 团队成员可在线查看/协作
```

### 场景3：ACOS异常处理

```
1. 每小时检查ACOS
   ↓
2. 发现某产品ACOS>60%且广告费>$500
   ↓
3. 生成WARNING级别预警
   ↓
4. 推送到企业微信
   【关注预警】
   ACOS过高：B09TXQMNBZ ACOS 66.24%
   建议操作：优化广告投放
   ↓
5. 运营人员点击查看
   ↓
6. H5页面显示：
   - 7日ACOS趋势图
   - 主要消耗关键词
   - AI优化建议
   ↓
7. 用户点击"暂停广告"
   ↓
8. 确认后，通过API调用领星ERP暂停
   ↓
9. 记录操作日志
```

---

## 🔧 环境变量配置

```bash
# .env.local

# 企业微信配置
WECOM_CORP_ID=ww1234567890abcdef
WECOM_AGENT_ID=1000001
WECOM_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxx

# WPS配置
WPS_APP_ID=your_wps_app_id
WPS_APP_SECRET=your_wps_app_secret

# Dashboard URL
DASHBOARD_URL=https://dashboard.flowgold.ai
```

---

## 📱 企业微信消息示例

### 1. 紧急预警消息

```
🚨 【紧急预警】检测到3个严重问题

1. 库存告急：B081C32LWG 仅剩0天库存
   建议操作: 紧急补货

2. 严重亏损：B09TXQMNBZ 毛利率-6.63%，本月广告费$7,741
   建议操作: 立即暂停广告

3. 退款率异常：B0D528MGDG 退款率17.12%
   建议操作: 检查产品质量

请立即处理！
查看详情: https://dashboard.flowgold.ai/alerts
```

### 2. 每日报告消息（Markdown格式）

```markdown
📊 【流金亚马逊每日数据】2025-10-26

💰 销售数据
├─ 昨日销售额: $12,345
├─ 订单量: 856
└─ 环比: 📈 +8.2%

📈 运营指标
├─ 平均毛利率: 12.3%
├─ 平均ACOS: 32.1%
└─ ROAS: 2.8

🏬 店铺表现 TOP3
1. 新晟: $3,456
2. 智恒: $2,890
3. 民誉: $2,345

⚠️ 需要关注
• 5个产品库存<7天
• 德国站点毛利率-6.81%
• 23个产品ACOS>50%

查看完整报告 👉 https://dashboard.flowgold.ai
```

### 3. WPS报表推送消息（卡片格式）

```
标题: 📊 每日数据报表已生成 - 2025-10-26
描述: 点击查看详细数据报表（可在线编辑和协作）
按钮: 查看报表
链接: https://wps.cn/sheets/xxxxx
```

---

## 🎨 移动端界面设计

### Dashboard首页（企业微信H5）

```
┌─────────────────────────────┐
│  流金亚马逊数据中心           │
│  2025-10-26 09:30           │
├─────────────────────────────┤
│ 💰 今日销售额                │
│ $12,345                     │
│ 环比 ↑ +8.2%                │
├─────────────────────────────┤
│ 📊 平均毛利率                │
│ 12.3% / 目标15%             │
│ ▓▓▓▓▓▓▓▓░░ 82%              │
├─────────────────────────────┤
│ 🎯 平均ACOS                  │
│ 32.1% / 目标<30%            │
│ ⚠️ 超出目标                  │
├─────────────────────────────┤
│ 🚨 预警 (5)                  │
│ • B081C32LWG 断货           │
│ • B09TXQMNBZ ACOS过高       │
│ • 查看全部 →                │
├─────────────────────────────┤
│ 🏬 店铺                      │
│ [新晟] [智恒] [民誉] [建峰]  │
│ [朵越] [琴心] [奇宝乐] [ZOZO]│
└─────────────────────────────┘
│ [首页] [预警] [报表] [我的] │
└─────────────────────────────┘
```

---

## 💡 扩展功能建议

### 1. 企业微信机器人
- 支持@机器人查询数据
- 例如：@流金数据 今日销售额
- 机器人自动回复实时数据

### 2. 语音播报
- 利用企业微信语音消息
- 每日早晨自动播报关键数据

### 3. 视频号直播
- 重大数据节点（如破百万销售额）
- 自动发送视频号通知

### 4. 会议室大屏
- 企业微信扫码登录
- 实时显示Dashboard数据

---

## 📊 成本估算

### 企业微信
- 基础版：免费（100人以内）
- 企业版：¥2,800/年（不限人数）

### WPS企业版
- 基础版：免费（5G空间）
- 专业版：¥99/人/年（100G空间）
- 企业版：¥299/人/年（1T空间）

**建议配置**：
- 企业微信企业版（¥2,800/年）
- WPS专业版（10人 × ¥99 = ¥990/年）
- **总计**：约¥3,800/年

---

## 🚀 实施步骤

### Week 1: 企业微信基础集成
- [ ] 注册企业微信，创建应用
- [ ] 开发消息推送功能
- [ ] 实现预警推送
- [ ] 测试每日报告推送

### Week 2: 移动端H5开发
- [ ] 开发移动端Dashboard
- [ ] 集成企业微信JS-SDK
- [ ] 实现扫码登录
- [ ] 优化移动端体验

### Week 3: WPS集成
- [ ] 注册WPS开放平台
- [ ] 开发报表生成功能
- [ ] 实现自动推送
- [ ] 测试团队协作

### Week 4: 审批流程
- [ ] 设计审批模板
- [ ] 开发审批API
- [ ] 测试完整流程
- [ ] 上线试运行

---

## ✅ 验收标准

1. **企业微信消息推送**
   - ✅ 每日8:00准时推送日报
   - ✅ 紧急预警<5分钟送达
   - ✅ 消息格式美观易读

2. **移动端H5**
   - ✅ 在企业微信中流畅打开
   - ✅ 数据实时刷新
   - ✅ 响应式设计，适配各种屏幕

3. **WPS报表**
   - ✅ 每日自动生成
   - ✅ 数据准确无误
   - ✅ 团队成员可在线协作

4. **审批流程**
   - ✅ 补货申请流程畅通
   - ✅ 审批结果自动同步

---

**下一步**：开始企业微信应用注册和基础集成开发

