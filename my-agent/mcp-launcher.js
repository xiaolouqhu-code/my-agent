#!/usr/bin/env node

import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class MCPLauncher {
  constructor() {
    this.servers = new Map();
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      const configPath = join(__dirname, 'mcp-config.json');
      const configData = readFileSync(configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      console.error('Failed to load MCP configuration:', error.message);
      process.exit(1);
    }
  }

  async startServer(serverName, serverConfig) {
    return new Promise((resolve, reject) => {
      console.log(`Starting MCP server: ${serverName}`);
      
      const serverProcess = spawn('node', [serverConfig.command], {
        cwd: serverConfig.cwd || __dirname,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, ...serverConfig.env }
      });

      serverProcess.stdout.on('data', (data) => {
        console.log(`[${serverName}] ${data.toString().trim()}`);
      });

      serverProcess.stderr.on('data', (data) => {
        const message = data.toString().trim();
        if (message.includes('running on stdio')) {
          console.log(`✅ ${serverName} server started successfully`);
          resolve(serverProcess);
        } else {
          console.error(`[${serverName}] ${message}`);
        }
      });

      serverProcess.on('error', (error) => {
        console.error(`Failed to start ${serverName}:`, error.message);
        reject(error);
      });

      serverProcess.on('exit', (code) => {
        console.log(`${serverName} server exited with code ${code}`);
        this.servers.delete(serverName);
      });

      this.servers.set(serverName, serverProcess);
      
      // 设置超时
      setTimeout(() => {
        if (!this.servers.has(serverName)) {
          reject(new Error(`Timeout starting ${serverName}`));
        }
      }, 10000);
    });
  }

  async startAllServers() {
    console.log('🚀 Starting MCP servers...');
    
    const serverPromises = [];
    
    for (const [serverName, serverConfig] of Object.entries(this.config.mcpServers)) {
      if (serverConfig.enabled !== false) {
        serverPromises.push(
          this.startServer(serverName, serverConfig).catch(error => {
            console.error(`Failed to start ${serverName}:`, error.message);
            return null;
          })
        );
      }
    }

    const results = await Promise.allSettled(serverPromises);
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
    
    console.log(`\n✅ Started ${successCount} MCP servers successfully`);
    
    if (successCount > 0) {
      console.log('\n📋 Available MCP servers:');
      for (const [serverName, serverConfig] of Object.entries(this.config.mcpServers)) {
        if (this.servers.has(serverName)) {
          console.log(`  - ${serverName}: ${serverConfig.description}`);
        }
      }
    }

    return successCount;
  }

  async stopServer(serverName) {
    const serverProcess = this.servers.get(serverName);
    if (serverProcess) {
      console.log(`Stopping ${serverName} server...`);
      serverProcess.kill('SIGTERM');
      
      // 等待进程结束
      return new Promise((resolve) => {
        serverProcess.on('exit', () => {
          console.log(`✅ ${serverName} server stopped`);
          resolve();
        });
        
        // 强制结束超时
        setTimeout(() => {
          if (this.servers.has(serverName)) {
            serverProcess.kill('SIGKILL');
            this.servers.delete(serverName);
            resolve();
          }
        }, 5000);
      });
    }
  }

  async stopAllServers() {
    console.log('🛑 Stopping all MCP servers...');
    
    const stopPromises = Array.from(this.servers.keys()).map(serverName => 
      this.stopServer(serverName)
    );
    
    await Promise.all(stopPromises);
    console.log('✅ All MCP servers stopped');
  }

  async testServerConnection(serverName) {
    console.log(`Testing connection to ${serverName}...`);
    
    // 这里可以添加具体的连接测试逻辑
    // 目前只是检查进程是否还在运行
    const serverProcess = this.servers.get(serverName);
    if (serverProcess && !serverProcess.killed) {
      console.log(`✅ ${serverName} is running`);
      return true;
    } else {
      console.log(`❌ ${serverName} is not running`);
      return false;
    }
  }

  async testAllConnections() {
    console.log('🔍 Testing all server connections...');
    
    const testResults = [];
    for (const serverName of this.servers.keys()) {
      const isRunning = await this.testServerConnection(serverName);
      testResults.push({ serverName, isRunning });
    }
    
    const runningCount = testResults.filter(r => r.isRunning).length;
    console.log(`\n📊 Connection test results: ${runningCount}/${testResults.length} servers running`);
    
    return testResults;
  }

  displayStatus() {
    console.log('\n📊 MCP Server Status:');
    console.log('='.repeat(50));
    
    if (this.servers.size === 0) {
      console.log('No servers are currently running.');
      return;
    }
    
    for (const [serverName, serverProcess] of this.servers.entries()) {
      const status = serverProcess.killed ? '❌ Stopped' : '✅ Running';
      const pid = serverProcess.pid || 'N/A';
      console.log(`${serverName.padEnd(20)} ${status} (PID: ${pid})`);
    }
  }

  setupSignalHandlers() {
    process.on('SIGINT', async () => {
      console.log('\n🛑 Received SIGINT, shutting down gracefully...');
      await this.stopAllServers();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
      await this.stopAllServers();
      process.exit(0);
    });
  }

  async run() {
    this.setupSignalHandlers();
    
    const args = process.argv.slice(2);
    const command = args[0] || 'start';
    
    switch (command) {
      case 'start':
        await this.startAllServers();
        break;
        
      case 'stop':
        await this.stopAllServers();
        break;
        
      case 'restart':
        await this.stopAllServers();
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.startAllServers();
        break;
        
      case 'status':
        this.displayStatus();
        break;
        
      case 'test':
        await this.testAllConnections();
        break;
        
      case 'help':
        this.displayHelp();
        break;
        
      default:
        console.error(`Unknown command: ${command}`);
        this.displayHelp();
        process.exit(1);
    }
    
    // 如果是start命令，保持进程运行
    if (command === 'start' && this.servers.size > 0) {
      console.log('\n🔄 MCP Launcher is running. Press Ctrl+C to stop all servers.');
      
      // 定期检查服务器状态
      setInterval(() => {
        const runningCount = Array.from(this.servers.values())
          .filter(process => !process.killed).length;
        
        if (runningCount === 0) {
          console.log('All servers have stopped. Exiting...');
          process.exit(0);
        }
      }, 5000);
    }
  }

  displayHelp() {
    console.log(`
MCP Launcher - Model Context Protocol Server Manager

Usage: node mcp-launcher.js [command]

Commands:
  start     Start all enabled MCP servers (default)
  stop      Stop all running MCP servers
  restart   Restart all MCP servers
  status    Display status of all servers
  test      Test connections to all servers
  help      Display this help message

Examples:
  node mcp-launcher.js start
  node mcp-launcher.js status
  node mcp-launcher.js test
    `);
  }
}

// 运行启动器
const launcher = new MCPLauncher();
launcher.run().catch(error => {
  console.error('MCP Launcher error:', error.message);
  process.exit(1);
});