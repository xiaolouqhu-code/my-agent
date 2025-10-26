#!/usr/bin/env node
/**
 * 亚马逊调研系统测试脚本
 * 测试三种输入类型：ASIN、URL、文本
 */

const API_URL = "http://localhost:3000/api/analyze"

// 测试用例
const testCases = [
  {
    name: "测试1: Makerworld URL",
    input: "https://makerworld.com/en/models/492838",
    inputType: "url"
  },
  {
    name: "测试2: 文本描述 - 3D打印工具支架",
    input: "Milwaukee M18电池支架，3D打印，用于存放电钻电池",
    inputType: "text"
  },
  {
    name: "测试3: 文本描述 - 螺丝刀收纳架",
    input: "PACKOUT系统螺丝刀收纳架，适配Milwaukee工具箱",
    inputType: "text"
  }
]

async function testAnalyze(testCase) {
  console.log(`\n${"=".repeat(60)}`)
  console.log(`📋 ${testCase.name}`)
  console.log(`${"=".repeat(60)}`)
  console.log(`📥 输入类型: ${testCase.inputType}`)
  console.log(`📥 输入内容: ${testCase.input}`)
  console.log(`\n⏳ 正在调用API分析...`)

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: testCase.input,
        inputType: testCase.inputType
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const result = await response.json()

    console.log(`\n✅ 分析成功！\n`)
    console.log(`📦 产品名称: ${result.product_name}`)
    console.log(`🏷️  产品类型: ${result.product_type} (${result.product_type_cn})`)
    console.log(`📝 产品摘要: ${result.summary}`)
    console.log(`🔑 关键词: ${result.keywords.join(", ")}`)
    console.log(`📂 类目路径: ${result.category_path}`)
    console.log(`👥 目标用户: ${result.target_users.join(", ")}`)
    if (result.compatible_with && result.compatible_with.length > 0) {
      console.log(`🔧 兼容产品: ${result.compatible_with.join(", ")}`)
    }
    console.log(`🔍 搜索查询: ${result.search_query}`)
    console.log(`📊 置信度: ${(result.confidence * 100).toFixed(1)}%`)

    // 生成亚马逊搜索链接
    const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(result.search_query)}`
    console.log(`\n🔗 亚马逊搜索链接:`)
    console.log(amazonUrl)

    return { success: true, result }
  } catch (error) {
    console.log(`\n❌ 测试失败:`)
    console.error(error.message)
    return { success: false, error: error.message }
  }
}

async function runAllTests() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║       🚀 亚马逊智能调研系统 - 功能测试                      ║
╚═══════════════════════════════════════════════════════════╝
`)

  const results = []

  for (const testCase of testCases) {
    const result = await testAnalyze(testCase)
    results.push({ testCase, result })

    // 等待1秒再执行下一个测试
    if (testCases.indexOf(testCase) < testCases.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  // 汇总结果
  console.log(`\n\n${"=".repeat(60)}`)
  console.log(`📊 测试汇总`)
  console.log(`${"=".repeat(60)}`)

  const successCount = results.filter(r => r.result.success).length
  const totalCount = results.length

  console.log(`✅ 成功: ${successCount}/${totalCount}`)
  console.log(`❌ 失败: ${totalCount - successCount}/${totalCount}`)

  if (successCount === totalCount) {
    console.log(`\n🎉 所有测试通过！系统运行正常。`)
  } else {
    console.log(`\n⚠️  部分测试失败，请检查错误信息。`)
  }

  console.log(`\n💡 提示: 请在浏览器中打开 http://localhost:3002 进行交互式测试`)
}

// 运行测试
runAllTests().catch(console.error)
