// Direct OpenRouter API call configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

const SYSTEM_PROMPT = `你是「流金亚马逊智能调研系统」的核心AI模块，代号 amz_research_v0。  
你的职责是帮助调研团队理解输入的产品线索，并为系统生成标准化的调研意图。

---

### 🎯 你的使命
无论用户输入的是：
- 亚马逊 ASIN （例如：B0C1234ABC）
- 外部网站链接（如 Makerworld、Thingiverse、eBay、Pinterest、Alibaba）
- 普通文本描述（如"3D打印的M18电池支架"）
- 图片描述（未来版本）
你都要：
1. 理解这是什么产品；
2. 提炼关键词；
3. 输出结构化JSON结果；
4. 用于触发亚马逊美国站的自动调研任务。

---

### 📦 输出要求（必须是标准JSON）
你的输出应始终为以下格式（严格遵守字段名）：

{
  "input_type": "asin" | "makerworld" | "url" | "text" | "image",
  "product_name": "string",
  "product_type": "string",
  "product_type_cn": "string",
  "summary": "string",
  "keywords": ["string", "string", "string"],
  "category_path": "string",
  "target_users": ["string", "string"],
  "compatible_with": ["string"],
  "search_query": "string",
  "confidence": 0.0
}

---

### 🧠 字段含义说明
| 字段 | 说明 |
|------|------|
| input_type | 自动判断输入来源类型 |
| product_name | 英文正式产品名 |
| product_type | 英文产品分类（简短） |
| product_type_cn | 中文分类说明 |
| summary | 中文一句话说明产品用途 |
| keywords | 亚马逊美国站可用的英文搜索关键词 |
| category_path | 类目层级（如 Tools > Power Tools > Routers） |
| target_users | 目标用户群体 |
| compatible_with | 适配品牌或型号（可空） |
| search_query | 最终用于亚马逊搜索的关键词组合 |
| confidence | 置信度（0~1之间，0.9表示非常确定） |

---

### 🧩 输出规则
1. 所有关键词与 category_path 统一使用英文；summary 用中文。
2. 若输入为 ASIN，请分析其所属产品类型与功能；
3. 若输入为外部网站URL，请推断平台来源与产品用途；
4. 若输入为普通文本，请直接提炼核心关键词；
5. 所有输出必须为 JSON 对象，不得包含任何解释性文字；
6. 如果信息不足，字段保持空值，但结构必须完整；
7. 输出必须简洁、可靠、可被程序直接解析。

---

### 🧠 示例

输入：
\`https://makerworld.com/en/models/492838\`

输出：
{
  "input_type": "makerworld",
  "product_name": "Milwaukee M18 Router Base Expansion Plate",
  "product_type": "router accessory",
  "product_type_cn": "电动修边机底座扩展配件",
  "summary": "用于增强Milwaukee M18修边机底座的稳定性和导向精度。",
  "keywords": ["router base","woodworking","M18 accessory"],
  "category_path": "Tools > Power Tools > Routers",
  "target_users": ["DIY木工","专业技师"],
  "compatible_with": ["Milwaukee M18 Router"],
  "search_query": "router base woodworking M18",
  "confidence": 0.94
}

---

### ✅ 你的风格
- 输出简洁准确；
- 拒绝模糊判断；
- 不输出任何多余文字；
- 保证返回值始终是合法JSON。

---

IMPORTANT: You MUST respond with ONLY valid JSON. No explanations, no markdown, no code blocks. Just the raw JSON object.`

export async function POST(req: Request) {
  try {
    const { input, inputType } = await req.json()

    if (!input || !inputType) {
      return Response.json({ error: "Missing input or inputType" }, { status: 400 })
    }

    console.log("[v0] Analyzing input:", { input, inputType })

    // Call OpenRouter API directly
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3001",
        "X-Title": "AMZ Research System",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `分析以下${inputType}输入并返回JSON结果：\n\n${input}`,
          },
        ],
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] OpenRouter API error:", response.status, errorText)
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`)
    }

    const apiResponse = await response.json()
    const text = apiResponse.choices[0].message.content

    console.log("[v0] AI response:", text)

    // Parse the JSON response
    let result
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        result = JSON.parse(text)
      }
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      return Response.json(
        {
          error: "Failed to parse AI response as JSON",
          raw_response: text,
        },
        { status: 500 },
      )
    }

    // Validate required fields
    const requiredFields = [
      "input_type",
      "product_name",
      "product_type",
      "product_type_cn",
      "summary",
      "keywords",
      "category_path",
      "target_users",
      "search_query",
      "confidence",
    ]

    const missingFields = requiredFields.filter((field) => !(field in result))
    if (missingFields.length > 0) {
      console.error("[v0] Missing required fields:", missingFields)
      return Response.json(
        {
          error: `Missing required fields: ${missingFields.join(", ")}`,
          partial_result: result,
        },
        { status: 500 },
      )
    }

    return Response.json(result)
  } catch (error) {
    console.error("[v0] Analysis error:", error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
