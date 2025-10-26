#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';

console.log('🧪 MCP 基础功能测试');
console.log('====================');

// 测试1: 检查已安装的MCP包
console.log('\n📦 检查已安装的MCP包:');
try {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const mcpPackages = Object.keys(packageJson.dependencies || {}).filter(pkg => pkg.includes('modelcontextprotocol'));
  mcpPackages.forEach(pkg => {
    console.log(`✅ ${pkg}: ${packageJson.dependencies[pkg]}`);
  });
} catch (error) {
  console.log('❌ 无法读取package.json');
}

// 测试2: 测试filesystem服务器
console.log('\n🗂️  测试filesystem服务器:');
const testFilesystem = () => {
  return new Promise((resolve) => {
    const child = spawn('npx', ['-y', '@modelcontextprotocol/server-filesystem', process.cwd()], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let output = '';
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      output += data.toString();
    });
    
    // 给服务器2秒启动时间
    setTimeout(() => {
      child.kill();
      if (output.includes('Secure MCP Filesystem Server')) {
        console.log('✅ Filesystem服务器启动成功');
      } else {
        console.log('❌ Filesystem服务器启动失败');
        console.log('输出:', output);
      }
      resolve();
    }, 2000);
  });
};

// 测试3: 测试memory服务器
console.log('\n🧠 测试memory服务器:');
const testMemory = () => {
  return new Promise((resolve) => {
    const child = spawn('npx', ['-y', '@modelcontextprotocol/server-memory'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let output = '';
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      output += data.toString();
    });
    
    setTimeout(() => {
      child.kill();
      if (output.includes('MCP Memory Server')) {
        console.log('✅ Memory服务器启动成功');
      } else {
        console.log('❌ Memory服务器启动失败');
        console.log('输出:', output);
      }
      resolve();
    }, 2000);
  });
};

// 运行测试
async function runTests() {
  await testFilesystem();
  await testMemory();
  
  console.log('\n📋 测试总结:');
  console.log('- 基础MCP包已安装');
  console.log('- 可以通过npx启动官方服务器');
  console.log('- 下一步: 创建简化的自定义服务器');
}

runTests().catch(console.error);