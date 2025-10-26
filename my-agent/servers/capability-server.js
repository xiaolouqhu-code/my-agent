#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

class CapabilityEnhancerServer {
  constructor() {
    this.server = new Server(
      {
        name: 'capability-enhancer-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.capabilities = new Map();
    this.enhancements = new Map();
    this.setupToolHandlers();
    this.initializeCapabilities();
  }

  initializeCapabilities() {
    // 初始化基础能力
    const baseCapabilities = [
      {
        id: 'strategic_analysis',
        name: '战略分析',
        category: 'strategic',
        description: '提供深度战略分析和决策支持',
        level: 'advanced',
        dependencies: ['data_analysis', 'market_research'],
        tools: ['analyze_market_trends', 'strategic_planning', 'risk_assessment'],
      },
      {
        id: 'operational_management',
        name: '运营管理',
        category: 'operational',
        description: '优化业务流程和运营效率',
        level: 'intermediate',
        dependencies: ['process_optimization'],
        tools: ['workflow_optimization', 'resource_allocation', 'performance_monitoring'],
      },
      {
        id: 'execution_support',
        name: '执行支持',
        category: 'execution',
        description: '提供任务执行和项目管理支持',
        level: 'basic',
        dependencies: [],
        tools: ['task_management', 'project_tracking', 'deadline_monitoring'],
      },
      {
        id: 'technical_integration',
        name: '技术集成',
        category: 'support',
        description: '处理技术集成和系统对接',
        level: 'advanced',
        dependencies: ['api_management', 'data_integration'],
        tools: ['system_integration', 'api_orchestration', 'data_transformation'],
      },
    ];

    baseCapabilities.forEach(cap => {
      this.capabilities.set(cap.id, cap);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'register_capability',
            description: '注册新能力',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: '能力ID',
                },
                name: {
                  type: 'string',
                  description: '能力名称',
                },
                category: {
                  type: 'string',
                  enum: ['strategic', 'operational', 'execution', 'support'],
                  description: '能力类别',
                },
                description: {
                  type: 'string',
                  description: '能力描述',
                },
                level: {
                  type: 'string',
                  enum: ['basic', 'intermediate', 'advanced', 'expert'],
                  description: '能力等级',
                },
                dependencies: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '依赖的能力ID列表',
                },
                tools: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '相关工具列表',
                },
              },
              required: ['id', 'name', 'category', 'description', 'level'],
            },
          },
          {
            name: 'enhance_capability',
            description: '增强现有能力',
            inputSchema: {
              type: 'object',
              properties: {
                capabilityId: {
                  type: 'string',
                  description: '要增强的能力ID',
                },
                enhancementType: {
                  type: 'string',
                  enum: ['performance', 'accuracy', 'scope', 'integration'],
                  description: '增强类型',
                },
                enhancementData: {
                  type: 'object',
                  description: '增强数据',
                },
                description: {
                  type: 'string',
                  description: '增强描述',
                },
              },
              required: ['capabilityId', 'enhancementType', 'enhancementData'],
            },
          },
          {
            name: 'get_capability',
            description: '获取能力信息',
            inputSchema: {
              type: 'object',
              properties: {
                capabilityId: {
                  type: 'string',
                  description: '能力ID',
                },
              },
              required: ['capabilityId'],
            },
          },
          {
            name: 'list_capabilities',
            description: '列出所有能力',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  description: '按类别筛选',
                },
                level: {
                  type: 'string',
                  description: '按等级筛选',
                },
              },
            },
          },
          {
            name: 'assess_capability_readiness',
            description: '评估能力就绪状态',
            inputSchema: {
              type: 'object',
              properties: {
                capabilityId: {
                  type: 'string',
                  description: '能力ID',
                },
                context: {
                  type: 'object',
                  description: '评估上下文',
                },
              },
              required: ['capabilityId'],
            },
          },
          {
            name: 'recommend_capabilities',
            description: '推荐相关能力',
            inputSchema: {
              type: 'object',
              properties: {
                currentCapabilities: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '当前能力列表',
                },
                targetScenario: {
                  type: 'string',
                  description: '目标场景',
                },
                priority: {
                  type: 'string',
                  enum: ['performance', 'coverage', 'integration'],
                  description: '推荐优先级',
                },
              },
              required: ['currentCapabilities', 'targetScenario'],
            },
          },
          {
            name: 'create_capability_matrix',
            description: '创建能力矩阵',
            inputSchema: {
              type: 'object',
              properties: {
                agentType: {
                  type: 'string',
                  description: '助理类型',
                },
                requirements: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '需求列表',
                },
              },
              required: ['agentType', 'requirements'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'register_capability':
          return await this.registerCapability(request.params.arguments);
        case 'enhance_capability':
          return await this.enhanceCapability(request.params.arguments);
        case 'get_capability':
          return await this.getCapability(request.params.arguments);
        case 'list_capabilities':
          return await this.listCapabilities(request.params.arguments);
        case 'assess_capability_readiness':
          return await this.assessCapabilityReadiness(request.params.arguments);
        case 'recommend_capabilities':
          return await this.recommendCapabilities(request.params.arguments);
        case 'create_capability_matrix':
          return await this.createCapabilityMatrix(request.params.arguments);
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });
  }

  async registerCapability({ id, name, category, description, level, dependencies = [], tools = [] }) {
    try {
      const capability = {
        id,
        name,
        category,
        description,
        level,
        dependencies,
        tools,
        registeredAt: new Date().toISOString(),
        status: 'active',
        enhancements: [],
      };

      this.capabilities.set(id, capability);

      return {
        content: [
          {
            type: 'text',
            text: `Capability registered: ${id}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error registering capability: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async enhanceCapability({ capabilityId, enhancementType, enhancementData, description }) {
    try {
      const capability = this.capabilities.get(capabilityId);
      if (!capability) {
        throw new Error(`Capability not found: ${capabilityId}`);
      }

      const enhancementId = `${capabilityId}-${Date.now()}`;
      const enhancement = {
        id: enhancementId,
        capabilityId,
        type: enhancementType,
        data: enhancementData,
        description,
        appliedAt: new Date().toISOString(),
        status: 'active',
      };

      capability.enhancements.push(enhancement);
      this.enhancements.set(enhancementId, enhancement);

      // 应用增强逻辑
      switch (enhancementType) {
        case 'performance':
          capability.level = this.upgradeLevel(capability.level);
          break;
        case 'scope':
          if (enhancementData.newTools) {
            capability.tools.push(...enhancementData.newTools);
          }
          break;
        case 'integration':
          if (enhancementData.newDependencies) {
            capability.dependencies.push(...enhancementData.newDependencies);
          }
          break;
      }

      return {
        content: [
          {
            type: 'text',
            text: `Capability enhanced: ${capabilityId} with ${enhancementType}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error enhancing capability: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  upgradeLevel(currentLevel) {
    const levels = ['basic', 'intermediate', 'advanced', 'expert'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : currentLevel;
  }

  async getCapability({ capabilityId }) {
    try {
      const capability = this.capabilities.get(capabilityId);
      if (!capability) {
        throw new Error(`Capability not found: ${capabilityId}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(capability, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting capability: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async listCapabilities({ category, level } = {}) {
    try {
      let filteredCapabilities = Array.from(this.capabilities.values());

      if (category) {
        filteredCapabilities = filteredCapabilities.filter(cap => cap.category === category);
      }
      if (level) {
        filteredCapabilities = filteredCapabilities.filter(cap => cap.level === level);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(filteredCapabilities, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing capabilities: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async assessCapabilityReadiness({ capabilityId, context = {} }) {
    try {
      const capability = this.capabilities.get(capabilityId);
      if (!capability) {
        throw new Error(`Capability not found: ${capabilityId}`);
      }

      const assessment = {
        capabilityId,
        readinessScore: 0,
        status: 'not_ready',
        missingDependencies: [],
        recommendations: [],
        assessedAt: new Date().toISOString(),
      };

      // 检查依赖
      let dependenciesMet = 0;
      for (const depId of capability.dependencies) {
        if (this.capabilities.has(depId)) {
          dependenciesMet++;
        } else {
          assessment.missingDependencies.push(depId);
        }
      }

      // 计算就绪分数
      const dependencyScore = capability.dependencies.length > 0 
        ? (dependenciesMet / capability.dependencies.length) * 50 
        : 50;
      
      const enhancementScore = capability.enhancements.length * 10;
      const levelScore = { basic: 10, intermediate: 20, advanced: 30, expert: 40 }[capability.level] || 10;

      assessment.readinessScore = Math.min(100, dependencyScore + enhancementScore + levelScore);

      if (assessment.readinessScore >= 80) {
        assessment.status = 'ready';
      } else if (assessment.readinessScore >= 60) {
        assessment.status = 'partially_ready';
      }

      // 生成建议
      if (assessment.missingDependencies.length > 0) {
        assessment.recommendations.push('Install missing dependencies');
      }
      if (capability.enhancements.length === 0) {
        assessment.recommendations.push('Consider adding enhancements');
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(assessment, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error assessing capability readiness: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async recommendCapabilities({ currentCapabilities, targetScenario, priority = 'coverage' }) {
    try {
      const recommendations = [];
      const allCapabilities = Array.from(this.capabilities.values());

      // 基于场景的推荐逻辑
      const scenarioMapping = {
        'investment_analysis': ['strategic_analysis', 'data_analysis', 'risk_assessment'],
        'project_management': ['operational_management', 'execution_support', 'task_management'],
        'technical_integration': ['technical_integration', 'api_management', 'system_integration'],
        'business_optimization': ['strategic_analysis', 'operational_management', 'performance_monitoring'],
      };

      const recommendedIds = scenarioMapping[targetScenario] || [];
      
      for (const capId of recommendedIds) {
        if (!currentCapabilities.includes(capId) && this.capabilities.has(capId)) {
          const capability = this.capabilities.get(capId);
          recommendations.push({
            capability,
            reason: `Recommended for ${targetScenario}`,
            priority: this.calculatePriority(capability, currentCapabilities, priority),
          });
        }
      }

      // 按优先级排序
      recommendations.sort((a, b) => b.priority - a.priority);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(recommendations, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error recommending capabilities: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  calculatePriority(capability, currentCapabilities, priorityType) {
    let score = 0;
    
    // 基础分数
    const levelScores = { basic: 1, intermediate: 2, advanced: 3, expert: 4 };
    score += levelScores[capability.level] || 1;

    // 依赖满足度
    const dependenciesMet = capability.dependencies.filter(dep => 
      currentCapabilities.includes(dep)
    ).length;
    score += dependenciesMet * 2;

    // 增强数量
    score += capability.enhancements.length;

    return score;
  }

  async createCapabilityMatrix({ agentType, requirements }) {
    try {
      const matrix = {
        agentType,
        requirements,
        recommendedCapabilities: [],
        capabilityGaps: [],
        implementationPlan: [],
        createdAt: new Date().toISOString(),
      };

      // 基于助理类型和需求生成能力矩阵
      const typeCapabilities = {
        'investment_advisor': ['strategic_analysis', 'data_analysis', 'risk_assessment'],
        'project_manager': ['operational_management', 'execution_support', 'task_management'],
        'technical_integrator': ['technical_integration', 'api_management', 'system_integration'],
        'business_analyst': ['strategic_analysis', 'operational_management', 'data_analysis'],
      };

      const baseCapabilities = typeCapabilities[agentType] || [];
      
      for (const capId of baseCapabilities) {
        if (this.capabilities.has(capId)) {
          matrix.recommendedCapabilities.push(this.capabilities.get(capId));
        } else {
          matrix.capabilityGaps.push(capId);
        }
      }

      // 生成实施计划
      matrix.implementationPlan = this.generateImplementationPlan(matrix.recommendedCapabilities, requirements);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(matrix, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating capability matrix: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  generateImplementationPlan(capabilities, requirements) {
    const plan = [];
    
    // 按依赖关系排序
    const sortedCapabilities = this.topologicalSort(capabilities);
    
    sortedCapabilities.forEach((capability, index) => {
      plan.push({
        phase: index + 1,
        capability: capability.id,
        estimatedTime: this.estimateImplementationTime(capability),
        dependencies: capability.dependencies,
        deliverables: this.generateDeliverables(capability, requirements),
      });
    });

    return plan;
  }

  topologicalSort(capabilities) {
    // 简化的拓扑排序
    return capabilities.sort((a, b) => a.dependencies.length - b.dependencies.length);
  }

  estimateImplementationTime(capability) {
    const timeMapping = {
      basic: '1-2 weeks',
      intermediate: '2-4 weeks',
      advanced: '4-6 weeks',
      expert: '6-8 weeks',
    };
    return timeMapping[capability.level] || '2-4 weeks';
  }

  generateDeliverables(capability, requirements) {
    return [
      `${capability.name} implementation`,
      `Integration with existing systems`,
      `Testing and validation`,
      `Documentation and training`,
    ];
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Capability Enhancer Server running on stdio');
  }
}

const server = new CapabilityEnhancerServer();
server.run().catch(console.error);