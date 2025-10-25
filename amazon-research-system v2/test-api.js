#!/usr/bin/env node

/**
 * 快速测试 OpenRouter API 配置
 * 
 * 使用方法:
 * node test-api.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 正在检查 API 配置...\n');

// 检查 .env.local 文件
const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ 错误: .env.local 文件不存在');
  console.log('📝 请确保已创建 .env.local 文件');
  process.exit(1);
}

// 读取环境变量
const envContent = fs.readFileSync(envPath, 'utf-8');
const hasApiKey = envContent.includes('OPENROUTER_API_KEY=');
const hasBaseUrl = envContent.includes('OPENROUTER_BASE_URL=');

console.log('✅ .env.local 文件存在');
console.log(`${hasApiKey ? '✅' : '❌'} OPENROUTER_API_KEY 配置${hasApiKey ? '正确' : '缺失'}`);
console.log(`${hasBaseUrl ? '✅' : '❌'} OPENROUTER_BASE_URL 配置${hasBaseUrl ? '正确' : '缺失'}`);

// 提取 API Key
const apiKeyMatch = envContent.match(/OPENROUTER_API_KEY=(.+)/);
if (apiKeyMatch) {
  const key = apiKeyMatch[1].trim();
  console.log(`\n🔑 API Key: ${key.substring(0, 20)}...${key.substring(key.length - 10)}`);
  console.log(`📏 Key 长度: ${key.length} 字符`);
}

// 检查 API 路由文件
const routePath = path.join(__dirname, 'app/api/analyze/route.ts');

if (!fs.existsSync(routePath)) {
  console.error('\n❌ 错误: app/api/analyze/route.ts 文件不存在');
  process.exit(1);
}

const routeContent = fs.readFileSync(routePath, 'utf-8');
const hasImport = routeContent.includes('import { createOpenAI }');
const hasConfig = routeContent.includes('const openrouter = createOpenAI');
const hasUsage = routeContent.includes('openrouter("openai/gpt-4o-mini")');

console.log('\n📄 检查 API 路由文件:');
console.log(`${hasImport ? '✅' : '❌'} 导入 createOpenAI ${hasImport ? '正确' : '缺失'}`);
console.log(`${hasConfig ? '✅' : '❌'} 配置 openrouter ${hasConfig ? '正确' : '缺失'}`);
console.log(`${hasUsage ? '✅' : '❌'} 使用 openrouter() ${hasUsage ? '正确' : '缺失'}`);

// 检查依赖包
const packagePath = path.join(__dirname, 'package.json');
const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

console.log('\n📦 检查依赖包:');
console.log(`${packageContent.dependencies.ai ? '✅' : '❌'} ai 包`);

// 检查 node_modules
const aiSdkPath = path.join(__dirname, 'node_modules/@ai-sdk/openai');
const hasAiSdk = fs.existsSync(aiSdkPath);
console.log(`${hasAiSdk ? '✅' : '❌'} @ai-sdk/openai 包 ${hasAiSdk ? '已安装' : '未安装'}`);

if (!hasAiSdk) {
  console.log('\n💡 提示: 运行以下命令安装依赖:');
  console.log('   npm install @ai-sdk/openai --legacy-peer-deps');
}

// 总结
console.log('\n' + '='.repeat(50));

if (hasApiKey && hasBaseUrl && hasImport && hasConfig && hasUsage && hasAiSdk) {
  console.log('🎉 配置检查完成！所有配置正确！');
  console.log('\n✨ 系统已准备就绪，可以开始使用了！');
  console.log('\n🚀 启动开发服务器:');
  console.log('   npm run dev');
  console.log('\n🌐 访问地址:');
  console.log('   http://localhost:3000');
} else {
  console.log('⚠️  配置检查完成，但存在一些问题');
  console.log('\n📚 请查阅以下文档解决问题:');
  console.log('   - README.md');
  console.log('   - API_CONFIG.md');
  console.log('   - INTEGRATION_SUMMARY.md');
}

console.log('='.repeat(50) + '\n');


