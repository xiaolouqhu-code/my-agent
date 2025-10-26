#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

class SimpleMCPLauncher {
  constructor() {
    this.configPath = './simple-mcp-config.json';
    this.servers = new Map();
    this.loadConfig();
  }

  loadConfig() {
    try {
      const configData = fs.readFileSync(this.configPath, 'utf8');
      this.config = JSON.parse(configData);
      console.log('✅ 配置文件加载成功');
    } catch (error) {
      console.error('❌ 配置文件加载失败:', error.message);
      process.exit(1);
    }
  }

  async startServer(serverName, serverConfig) {
    return new Promise((resolve) => {
      console.log(`🚀 启动 ${serverName} 服务器...`);
      
      const child = spawn(serverConfig.command, serverConfig.args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: process.cwd()
      });

      let startupOutput = '';
      let hasStarted = false;

      const startupTimeout = setTimeout(() => {
        if (!hasStarted) {
          console.log(`✅ ${serverName} 服务器启动成功 (超时检测)`);
          this.servers.set(serverName, { process: child, status: 'running' });
          hasStarted = true;
          resolve(true);
        }
      }, 3000);

      child.stdout.on('data', (data) => {
        startupOutput += data.toString();
        if (!hasStarted && (startupOutput.includes('running on stdio') || startupOutput.includes('Server running'))) {
          clearTimeout(startupTimeout);
          console.log(`✅ ${serverName} 服务器启动成功`);
          this.servers.set(serverName, { process: child, status: 'running' });
          hasStarted = true;
          resolve(true);
        }
      });

      child.stderr.on('data', (data) => {
        const errorOutput = data.toString();
        if (!hasStarted && errorOutput.includes('Error')) {
          clearTimeout(startupTimeout);
          console.log(`❌ ${serverName} 服务器启动失败: ${errorOutput}`);
          hasStarted = true;
          resolve(false);
        }
      });

      child.on('exit', (code) => {
        if (this.servers.has(serverName)) {
          this.servers.delete(serverName);
          console.log(`⚠️  ${serverName} 服务器已退出 (代码: ${code})`);
        }
      });
    });
  }

  async startAll() {
    console.log('🎯 启动所有MCP服务器...\n');
    
    const results = [];
    for (const [serverName, serverConfig] of Object.entries(this.config.mcpServers)) {
      const success = await this.startServer(serverName, serverConfig);
      results.push({ name: serverName, success });
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`\n✅ 成功启动 ${successCount}/${results.length} 个MCP服务器`);
    
    if (successCount > 0) {
      console.log('\n📋 运行中的服务器:');
      results.filter(r => r.success).forEach(r => {
        console.log(`  - ${r.name}`);
      });
      
      console.log('\n💡 提示: 按 Ctrl+C 停止所有服务器');
      
      // 保持进程运行
      process.on('SIGINT', () => {
        console.log('\n🛑 正在停止所有服务器...');
        this.stopAll();
        process.exit(0);
      });
    }
  }

  stopAll() {
    console.log('🛑 停止所有MCP服务器...');
    
    for (const [serverName, serverInfo] of this.servers) {
      try {
        serverInfo.process.kill('SIGTERM');
        console.log(`✅ ${serverName} 服务器已停止`);
      } catch (error) {
        console.log(`⚠️  停止 ${serverName} 服务器时出错: ${error.message}`);
      }
    }
    
    this.servers.clear();
    console.log('✅ 所有服务器已停止');
  }

  status() {
    console.log('📊 MCP服务器状态:');
    console.log('==================');
    
    if (this.servers.size === 0) {
      console.log('没有运行中的服务器');
    } else {
      for (const [serverName, serverInfo] of this.servers) {
        console.log(`✅ ${serverName}: ${serverInfo.status}`);
      }
    }
  }

  async test() {
    console.log('🧪 测试MCP服务器连接...\n');
    
    for (const [serverName, serverConfig] of Object.entries(this.config.mcpServers)) {
      console.log(`🔍 测试 ${serverName}...`);
      
      const child = spawn(serverConfig.command, serverConfig.args, {
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      let output = '';
      child.stdout.on('data', (data) => output += data.toString());
      child.stderr.on('data', (data) => output += data.toString());
      
      await new Promise(resolve => {
        setTimeout(() => {
          child.kill();
          if (output.includes('running on stdio') || output.includes('Server running')) {
            console.log(`✅ ${serverName} 连接正常`);
          } else {
            console.log(`❌ ${serverName} 连接失败`);
          }
          resolve();
        }, 2000);
      });
    }
  }
}

// 命令行处理
const launcher = new SimpleMCPLauncher();
const command = process.argv[2] || 'start';

switch (command) {
  case 'start':
    launcher.startAll();
    break;
  case 'stop':
    launcher.stopAll();
    break;
  case 'status':
    launcher.status();
    break;
  case 'test':
    launcher.test();
    break;
  default:
    console.log('用法: node simple-mcp-launcher.js [start|stop|status|test]');
}