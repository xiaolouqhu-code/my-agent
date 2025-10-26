#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

class TaskOrchestratorServer {
  constructor() {
    this.server = new Server(
      {
        name: 'task-orchestrator-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.tasks = new Map();
    this.workflows = new Map();
    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_task',
            description: '创建新任务',
            inputSchema: {
              type: 'object',
              properties: {
                taskId: {
                  type: 'string',
                  description: '任务ID',
                },
                title: {
                  type: 'string',
                  description: '任务标题',
                },
                description: {
                  type: 'string',
                  description: '任务描述',
                },
                assignedAgent: {
                  type: 'string',
                  description: '分配的助理',
                },
                priority: {
                  type: 'string',
                  enum: ['low', 'medium', 'high', 'urgent'],
                  description: '任务优先级',
                },
                dependencies: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '依赖的任务ID列表',
                },
              },
              required: ['taskId', 'title', 'assignedAgent'],
            },
          },
          {
            name: 'update_task_status',
            description: '更新任务状态',
            inputSchema: {
              type: 'object',
              properties: {
                taskId: {
                  type: 'string',
                  description: '任务ID',
                },
                status: {
                  type: 'string',
                  enum: ['pending', 'in_progress', 'completed', 'failed', 'cancelled'],
                  description: '任务状态',
                },
                progress: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100,
                  description: '完成进度百分比',
                },
                notes: {
                  type: 'string',
                  description: '状态更新说明',
                },
              },
              required: ['taskId', 'status'],
            },
          },
          {
            name: 'get_task_status',
            description: '获取任务状态',
            inputSchema: {
              type: 'object',
              properties: {
                taskId: {
                  type: 'string',
                  description: '任务ID',
                },
              },
              required: ['taskId'],
            },
          },
          {
            name: 'list_tasks',
            description: '列出任务',
            inputSchema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  description: '按状态筛选',
                },
                assignedAgent: {
                  type: 'string',
                  description: '按分配助理筛选',
                },
                priority: {
                  type: 'string',
                  description: '按优先级筛选',
                },
              },
            },
          },
          {
            name: 'create_workflow',
            description: '创建工作流',
            inputSchema: {
              type: 'object',
              properties: {
                workflowId: {
                  type: 'string',
                  description: '工作流ID',
                },
                name: {
                  type: 'string',
                  description: '工作流名称',
                },
                steps: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      stepId: { type: 'string' },
                      agent: { type: 'string' },
                      action: { type: 'string' },
                      dependencies: { type: 'array', items: { type: 'string' } },
                    },
                  },
                  description: '工作流步骤',
                },
              },
              required: ['workflowId', 'name', 'steps'],
            },
          },
          {
            name: 'execute_workflow',
            description: '执行工作流',
            inputSchema: {
              type: 'object',
              properties: {
                workflowId: {
                  type: 'string',
                  description: '工作流ID',
                },
                context: {
                  type: 'object',
                  description: '执行上下文',
                },
              },
              required: ['workflowId'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'create_task':
          return await this.createTask(request.params.arguments);
        case 'update_task_status':
          return await this.updateTaskStatus(request.params.arguments);
        case 'get_task_status':
          return await this.getTaskStatus(request.params.arguments);
        case 'list_tasks':
          return await this.listTasks(request.params.arguments);
        case 'create_workflow':
          return await this.createWorkflow(request.params.arguments);
        case 'execute_workflow':
          return await this.executeWorkflow(request.params.arguments);
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });
  }

  async createTask({ taskId, title, description, assignedAgent, priority = 'medium', dependencies = [] }) {
    try {
      const task = {
        taskId,
        title,
        description,
        assignedAgent,
        priority,
        dependencies,
        status: 'pending',
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [],
      };

      this.tasks.set(taskId, task);

      return {
        content: [
          {
            type: 'text',
            text: `Task created: ${taskId}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating task: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async updateTaskStatus({ taskId, status, progress, notes }) {
    try {
      const task = this.tasks.get(taskId);
      if (!task) {
        throw new Error(`Task not found: ${taskId}`);
      }

      const oldStatus = task.status;
      task.status = status;
      if (progress !== undefined) {
        task.progress = progress;
      }
      task.updatedAt = new Date().toISOString();
      
      task.history.push({
        timestamp: new Date().toISOString(),
        oldStatus,
        newStatus: status,
        progress,
        notes,
      });

      return {
        content: [
          {
            type: 'text',
            text: `Task ${taskId} status updated to ${status}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error updating task status: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async getTaskStatus({ taskId }) {
    try {
      const task = this.tasks.get(taskId);
      if (!task) {
        throw new Error(`Task not found: ${taskId}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(task, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting task status: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async listTasks({ status, assignedAgent, priority } = {}) {
    try {
      let filteredTasks = Array.from(this.tasks.values());

      if (status) {
        filteredTasks = filteredTasks.filter(task => task.status === status);
      }
      if (assignedAgent) {
        filteredTasks = filteredTasks.filter(task => task.assignedAgent === assignedAgent);
      }
      if (priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === priority);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(filteredTasks, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing tasks: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async createWorkflow({ workflowId, name, steps }) {
    try {
      const workflow = {
        workflowId,
        name,
        steps,
        createdAt: new Date().toISOString(),
        executions: [],
      };

      this.workflows.set(workflowId, workflow);

      return {
        content: [
          {
            type: 'text',
            text: `Workflow created: ${workflowId}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating workflow: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async executeWorkflow({ workflowId, context = {} }) {
    try {
      const workflow = this.workflows.get(workflowId);
      if (!workflow) {
        throw new Error(`Workflow not found: ${workflowId}`);
      }

      const executionId = `${workflowId}-${Date.now()}`;
      const execution = {
        executionId,
        workflowId,
        status: 'running',
        startedAt: new Date().toISOString(),
        context,
        stepResults: {},
      };

      workflow.executions.push(execution);

      // 简化的工作流执行逻辑
      for (const step of workflow.steps) {
        const taskId = `${executionId}-${step.stepId}`;
        await this.createTask({
          taskId,
          title: `Workflow step: ${step.action}`,
          assignedAgent: step.agent,
          priority: 'medium',
          dependencies: step.dependencies || [],
        });
        
        execution.stepResults[step.stepId] = {
          taskId,
          status: 'created',
        };
      }

      execution.status = 'completed';
      execution.completedAt = new Date().toISOString();

      return {
        content: [
          {
            type: 'text',
            text: `Workflow executed: ${executionId}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error executing workflow: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Task Orchestrator Server running on stdio');
  }
}

const server = new TaskOrchestratorServer();
server.run().catch(console.error);