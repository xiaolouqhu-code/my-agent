# Listing Builder Agent

## 角色定位
使用AI自动生成优化的Amazon产品Listing,包括标题、五点描述、产品描述、关键词和A+ Content,最大化转化率和SEO。

## 核心职责

### 1. Listing文案生成
- AI生成产品标题(符合Amazon规则)
- 创建吸引人的五点描述(Bullet Points)
- 撰写详细产品描述
- 生成后台关键词

### 2. SEO优化
- 研究高搜索量关键词
- 优化关键词密度和位置
- A/B测试标题和描述变体
- 监控搜索排名

### 3. 转化率优化
- 分析竞品Listing优势
- 强调产品差异化卖点
- 使用情感化和利益导向语言
- 解决客户潜在疑虑

### 4. 多语言支持
- 生成其他市场版本(UK, DE, JP等)
- 本地化语言和文化适配
- 关键词翻译和本地化

## 输入数据
- `product_brief_data.json` (Product Brief Agent)
- `design_spec.json` (Design Spec Agent)
- 竞品Listing数据
- 关键词研究数据

## 输出内容

### listing_content.json
```json
{
  "product_id": "OPP-2025-001",
  "marketplace": "US",
  "language": "en-US",
  "generated_date": "2025-01-17",

  "title": {
    "version_1": "ProGrip Adjustable Phone Stand for Desk - 360° Rotating Cell Phone Holder with Cable Management - Universal Smartphone Stand for iPhone, Samsung, All 4-8 inch Devices - Black",
    "version_2": "Adjustable Phone Stand, 360 Degree Rotating Desk Cell Phone Holder with Cable Organizer, Universal Smartphone Cradle for iPhone 15/14/13 Pro Max, Samsung Galaxy, Tablets - Black",
    "recommended": "version_1",
    "character_count": 198,
    "keyword_density": {
      "phone stand": 2,
      "adjustable": 1,
      "rotating": 1,
      "desk": 1
    }
  },

  "bullet_points": [
    "✅ 360° ROTATION & ADJUSTABLE ANGLES - Smoothly rotate your phone to any angle with our precision ball joint design. Adjust viewing angles from 0-90° for perfect positioning whether you're video calling, watching videos, or following recipes. One-hand operation makes adjustments effortless.",

    "📱 UNIVERSAL COMPATIBILITY - Fits all smartphones and small tablets from 4 to 8 inches wide, including iPhone 15/14/13 Pro Max, Samsung Galaxy S24/S23, Google Pixel, and more. Adjustable grip arms with soft rubber padding protect your device from scratches while holding securely.",

    "🔌 BUILT-IN CABLE MANAGEMENT - Say goodbye to tangled charging cables! Integrated cable routing channels keep your desk organized and your phone charging while in use. The weighted base prevents tipping even with cables attached.",

    "💪 PREMIUM QUALITY & STABILITY - Made from high-grade PETG material (not cheap plastic). Weighted non-slip base keeps your phone stable during taps and swipes. Supports devices up to 500g without wobbling. Smooth matte finish complements any desk setup.",

    "🎁 PERFECT FOR HOME & OFFICE - Ideal for video calls, Zoom meetings, online classes, watching content, FaceTime, recipe following, or bedside alarm clock. Makes a thoughtful gift for remote workers, students, and tech enthusiasts. 100% satisfaction guaranteed."
  ],

  "product_description": "Transform Your Desk with the ProGrip Adjustable Phone Stand\n\nTired of propping your phone against random objects or straining your neck looking down? The ProGrip Adjustable Phone Stand is your solution for comfortable, hands-free phone use at your desk.\n\nWHY CHOOSE PROGRIP?\n\n🎯 Ultimate Flexibility\nOur 360° rotating mechanism and 0-90° adjustable viewing angles give you perfect positioning every single time. Whether you're on a Zoom call, watching YouTube, or following a recipe, find your ideal angle in seconds.\n\n🎯 Universal & Protective\nWorks with ANY phone 4-8 inches wide - from the latest iPhone 15 Pro Max to Samsung Galaxy, Google Pixel, and everything in between. Soft rubber grip pads hold your phone securely without scratches.\n\n🎯 Cable Management Done Right\nNo more tangled messes! Built-in cable channels route your charging cable cleanly to keep your desk organized and your phone powered while in use.\n\n🎯 Premium Build Quality\nMade from high-grade PETG (the same material used in premium tech accessories), not flimsy plastic. The weighted base provides rock-solid stability - your phone stays put even during active use.\n\nPERFECT FOR:\n✔️ Video calls & online meetings\n✔️ Watching movies & YouTube\n✔️ Following cooking recipes\n✔️ Bedside alarm clock\n✔️ Hands-free FaceTime\n✔️ Online classes & tutorials\n\nSPECIFICATIONS:\n• Material: Premium PETG plastic\n• Compatibility: 4-8 inch devices\n• Rotation: 360° continuous\n• Tilt Range: 0-90°\n• Weight: 85g\n• Base: Non-slip weighted design\n• Color: Sleek matte black\n\nWHAT'S INCLUDED:\n• 1x ProGrip Phone Stand\n• 1x Cable management clip\n• Quick start guide\n\nJoin thousands of satisfied customers who've upgraded their desk setup with ProGrip. Order now and experience the difference quality makes!",

  "backend_keywords": [
    "phone stand for desk",
    "adjustable phone holder",
    "rotating cell phone stand",
    "desk phone mount",
    "smartphone holder desk",
    "iphone stand adjustable",
    "phone cradle desk",
    "hands free phone holder",
    "video call stand",
    "zoom meeting phone holder",
    "kitchen phone stand",
    "bedside phone holder",
    "office phone stand",
    "universal phone mount",
    "phone dock stand"
  ],

  "search_terms": "phone stand, adjustable phone holder, rotating phone stand, desk phone mount, cell phone holder, smartphone stand, iphone stand, samsung stand, universal phone holder, hands free stand, video call holder, zoom stand, desk accessories, phone cradle, phone dock",

  "key_features": [
    "360° Rotation",
    "Adjustable 0-90° Angles",
    "Cable Management System",
    "Universal Fit 4-8 inches",
    "Non-slip Weighted Base",
    "Premium PETG Material",
    "One-hand Operation",
    "Scratch Protection Pads"
  ],

  "usp_summary": "The only phone stand that combines 360° rotation, adjustable angles, AND built-in cable management in a premium, stable design.",

  "target_keywords": {
    "primary": ["phone stand", "adjustable phone holder", "desk phone stand"],
    "secondary": ["rotating phone stand", "phone holder with cable management", "universal phone stand"],
    "long_tail": ["phone stand for desk with cable management", "adjustable rotating phone holder for desk", "phone stand for zoom calls"]
  },

  "competitor_differentiation": [
    "Unlike cheap plastic stands, ProGrip uses premium PETG material",
    "Built-in cable management (competitors charge extra or don't include)",
    "Heavier base (85g vs typical 40-50g) for better stability",
    "Smoother rotation mechanism with ball joint (vs basic hinge)",
    "Modern matte finish (vs glossy plastic that shows fingerprints)"
  ]
}
```

### listing_images_brief.md (给摄影/设计团队的指导)
```markdown
# ProGrip Phone Stand - 产品图片简报

## 主图要求 (Main Image)
- 纯白背景 (RGB 255,255,255)
- 产品占图片85%面积
- 展示完整产品,45°角
- 不含文字或logo
- 分辨率: 2000x2000px最低
- 格式: JPG, sRGB色彩空间

## 附加图片 (Additional Images)

### 图片2: 使用场景 - 视频通话
- 场景: 干净的桌面,电脑背景
- 产品: ProGrip放在桌上,iPhone正在进行视频通话
- 重点: 展示实际使用,professional work from home场景

### 图片3: 360°旋转功能
- 展示: 4个角度的产品合成图
- 标注: "360° Smooth Rotation"
- 重点: 突出灵活性

### 图片4: 细节特写 - 电缆管理
- 特写: 电缆穿过管理槽
- 标注: "Built-in Cable Management"
- 重点: 整洁有序

### 图片5: 兼容性展示
- 展示: 多款手机(iPhone, Samsung, Pixel)都能使用
- 标注: "Universal Fit: 4-8 inch Devices"

### 图片6: 尺寸和规格信息图
- 信息图: 产品尺寸, 重量, 材料, 兼容性
- 风格: 现代简约, 黑白配色

### 图片7: 使用场景 - 厨房
- 场景: 厨房台面,正在看食谱
- 重点: 多场景应用

## A+ Content (EBC) 设计

### Module 1: 品牌故事
标题: "Designed for the Modern Workspace"
内容: 简短品牌故事 + 产品lifestyle图

### Module 2: 四大特色
图文并茂展示4个核心功能:
1. 360°旋转
2. 电缆管理
3. 稳固底座
4. 通用兼容

### Module 3: 使用场景
3个场景图:
- Home office / Video calls
- Kitchen / Recipes
- Bedside / Alarm clock

### Module 4: 规格对比表
ProGrip vs 竞品对比表格

### Module 5: 100% Satisfaction Guarantee
- 保证声明
- CTA: Add to Cart
```

## AI Prompt模板

### 生成Listing标题
```
你是亚马逊Listing优化专家。请为以下产品生成优化的Amazon产品标题。

产品信息:
{product_brief}

要求:
1. 长度: 180-200字符 (Amazon推荐)
2. 包含关键词: [phone stand, adjustable, rotating, desk]
3. 符合Amazon标题规则:
   - 首字母大写
   - 不使用promotional语言(如"Best", "#1")
   - 包含品牌名、产品类型、关键特性、兼容性
4. 突出核心卖点和差异化
5. 优化SEO但保持可读性

请生成3个标题变体,并说明推荐理由。
```

### 生成五点描述
```
为以下Amazon产品生成5个bullet points (五点描述)。

产品信息:
{product_brief}
{competitor_analysis}

要求:
1. 每条200-250字符
2. 以emoji开头增加可读性
3. 以核心利益(benefit)开头,而非feature
4. 使用情感化和利益导向语言
5. 解决客户痛点
6. 每条包含至少1个关键词
7. 格式: EMOJI + 大写标题 - 详细描述

请生成优化的5条bullet points。
```

## 执行频率
- **新品**: Product Brief完成后立即生成
- **A/B测试**: 每月生成新变体测试
- **SEO更新**: 每季度根据关键词表现优化
- **节日版本**: 重大节日前定制化

## 技术实现
```python
class ListingBuilderAgent:
    def __init__(self, ai_client):
        self.ai = ai_client

    def generate_listing(self, product_brief, competitor_data):
        # 1. 生成标题
        title_variants = self.generate_titles(product_brief)

        # 2. 生成五点描述
        bullet_points = self.generate_bullets(product_brief, competitor_data)

        # 3. 生成产品描述
        description = self.generate_description(product_brief)

        # 4. 研究和生成关键词
        keywords = self.research_keywords(product_brief)

        # 5. 组装listing
        listing = {
            'title': title_variants,
            'bullet_points': bullet_points,
            'product_description': description,
            'backend_keywords': keywords['backend'],
            'search_terms': keywords['search_terms']
        }

        # 6. SEO评分
        seo_score = self.calculate_seo_score(listing)

        # 7. 导出
        self.export_listing_json(listing)
        self.export_images_brief()

        return listing

    def generate_titles(self, brief):
        prompt = self._build_title_prompt(brief)
        response = self.ai.chat(
            model="anthropic/claude-3-sonnet",
            messages=[{"role": "user", "content": prompt}]
        )

        titles = self._parse_title_response(response)
        return titles

    def research_keywords(self, brief):
        # 使用Helium 10, Jungle Scout API或自己爬取
        # 简化示例:
        base_keywords = [brief['product_name'].lower()]

        # 扩展关键词
        expanded = self._expand_keywords(base_keywords)

        # 筛选高搜索量低竞争关键词
        filtered = self._filter_keywords(expanded)

        return {
            'primary': filtered[:5],
            'secondary': filtered[5:15],
            'backend': filtered[:50]  # Amazon允许250字节
        }

    def calculate_seo_score(self, listing):
        score = 0

        # 标题包含主关键词 (+20)
        if self._contains_primary_keywords(listing['title']):
            score += 20

        # 五点描述关键词密度合理 (+20)
        kw_density = self._calculate_keyword_density(listing['bullet_points'])
        if 0.02 < kw_density < 0.05:
            score += 20

        # 字符数利用率 (+10)
        if self._title_length_optimal(listing['title']):
            score += 10

        # 后台关键词无重复 (+10)
        if not self._has_duplicate_keywords(listing['backend_keywords']):
            score += 10

        # ... 更多评分标准

        return score  # 0-100
```

## 依赖
- 上游: Product Brief Agent, Design Spec Agent
- 下游: Ads Data Agent (使用关键词)
- 外部工具:
  - OpenRouter AI (Claude/GPT)
  - Helium 10 / Jungle Scout (关键词研究)
  - Grammarly API (语法检查)

## A/B测试策略
1. 先运行版本A(保守)2周
2. 切换版本B(激进)2周
3. 对比转化率、点击率、销售
4. 选择表现更好的版本
5. 重复迭代

## 注意事项
1. 遵守Amazon Listing规则,避免禁用词
2. 不夸大宣传,确保描述准确
3. 定期检查竞品Listing变化
4. 关键词不要堆砌,保持自然
5. 不同市场需要本地化(UK用"colour")
6. 保留历史版本用于回滚
