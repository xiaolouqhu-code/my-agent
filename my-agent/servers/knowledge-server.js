#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';

class AgentKnowledgeServer {
  constructor() {
    this.server = new Server(
      {
        name: 'agent-knowledge-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_agent_capabilities',
            description: '获取指定助理的能力配置',
            inputSchema: {
              type: 'object',
              properties: {
                agentType: {
                  type: 'string',
                  description: '助理类型 (strategic/operation/execution/support)',
                },
                agentName: {
                  type: 'string', 
                  description: '助理名称',
                },
              },
              required: ['agentType', 'agentName'],
            },
          },
          {
            name: 'update_agent_knowledge',
            description: '更新助理的知识库',
            inputSchema: {
              type: 'object',
              properties: {
                agentType: {
                  type: 'string',
                  description: '助理类型',
                },
                agentName: {
                  type: 'string',
                  description: '助理名称',
                },
                knowledge: {
                  type: 'object',
                  description: '知识内容',
                },
              },
              required: ['agentType', 'agentName', 'knowledge'],
            },
          },
          {
            name: 'search_knowledge',
            description: '搜索知识库内容',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: '搜索查询',
                },
                agentType: {
                  type: 'string',
                  description: '限制搜索的助理类型（可选）',
                },
              },
              required: ['query'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'get_agent_capabilities':
          return await this.getAgentCapabilities(request.params.arguments);
        case 'update_agent_knowledge':
          return await this.updateAgentKnowledge(request.params.arguments);
        case 'search_knowledge':
          return await this.searchKnowledge(request.params.arguments);
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });
  }

  async getAgentCapabilities({ agentType, agentName }) {
    try {
      const agentPath = path.join(process.cwd(), agentType, `${agentName}.md`);
      const content = await fs.readFile(agentPath, 'utf-8');
      
      // 解析 Markdown 文件提取能力信息
      const capabilities = this.parseCapabilities(content);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              agentType,
              agentName,
              capabilities,
              lastUpdated: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting agent capabilities: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async updateAgentKnowledge({ agentType, agentName, knowledge }) {
    try {
      const knowledgePath = path.join(process.cwd(), 'knowledge', agentType);
      await fs.mkdir(knowledgePath, { recursive: true });
      
      const knowledgeFile = path.join(knowledgePath, `${agentName}.json`);
      const existingKnowledge = await this.loadExistingKnowledge(knowledgeFile);
      
      const updatedKnowledge = {
        ...existingKnowledge,
        ...knowledge,
        lastUpdated: new Date().toISOString(),
      };
      
      await fs.writeFile(knowledgeFile, JSON.stringify(updatedKnowledge, null, 2));
      
      return {
        content: [
          {
            type: 'text',
            text: `Knowledge updated for ${agentType}/${agentName}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error updating knowledge: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async searchKnowledge({ query, agentType }) {
    try {
      const searchResults = [];
      const knowledgeDir = path.join(process.cwd(), 'knowledge');
      
      const searchDirs = agentType 
        ? [path.join(knowledgeDir, agentType)]
        : await this.getAllKnowledgeDirs(knowledgeDir);
      
      for (const dir of searchDirs) {
        try {
          const files = await fs.readdir(dir);
          for (const file of files) {
            if (file.endsWith('.json')) {
              const content = await fs.readFile(path.join(dir, file), 'utf-8');
              if (content.toLowerCase().includes(query.toLowerCase())) {
                searchResults.push({
                  file: file,
                  type: path.basename(dir),
                  content: JSON.parse(content),
                });
              }
            }
          }
        } catch (error) {
          // 目录不存在或无法访问，跳过
        }
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(searchResults, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error searching knowledge: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  parseCapabilities(content) {
    // 简单的能力解析逻辑
    const capabilities = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.includes('✅')) {
        const capability = line.replace(/.*✅\s*/, '').trim();
        if (capability) {
          capabilities.push(capability);
        }
      }
    }
    
    return capabilities;
  }

  async loadExistingKnowledge(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      return {};
    }
  }

  async getAllKnowledgeDirs(knowledgeDir) {
    try {
      const entries = await fs.readdir(knowledgeDir, { withFileTypes: true });
      return entries
        .filter(entry => entry.isDirectory())
        .map(entry => path.join(knowledgeDir, entry.name));
    } catch (error) {
      return [];
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Agent Knowledge Server running on stdio');
  }
}

const server = new AgentKnowledgeServer();
server.run().catch(console.error);