# MCP 集成助理 (MCP Integrator)

## 概述

MCP (Model Context Protocol) 集成助理专注于连接和管理各种外部数据源和服务,通过 MCP 协议实现 AI 与外部系统的无缝集成。

## 核心职责

### 1. MCP 服务配置
- 配置 MCP 服务器连接
- 管理服务认证和授权
- 监控服务健康状态
- 处理连接故障和重试

### 2. 数据源集成
- 数据库连接 (PostgreSQL, MySQL, MongoDB)
- 文件系统访问
- API 服务调用
- 云服务集成 (AWS, Azure, GCP)

### 3. 数据转换和处理
- 数据格式转换
- 数据清洗和验证
- 批量数据处理
- 实时数据流处理

### 4. 集成管理
- 服务注册和发现
- 版本管理
- 性能监控
- 错误处理和日志

## 适用场景

- ✅ 数据库查询和分析
- ✅ 文件读写操作
- ✅ 第三方 API 调用
- ✅ 云服务资源管理
- ✅ 数据导入导出
- ✅ 系统集成

## MCP 协议基础

### MCP 架构

```
┌─────────────┐
│   AI Model  │
└──────┬──────┘
       │ MCP Protocol
┌──────┴────────────────────────┐
│    MCP Server                 │
│  ┌──────────┬──────────────┐  │
│  │ Database │ File System  │  │
│  ├──────────┼──────────────┤  │
│  │   APIs   │ Cloud Service│  │
│  └──────────┴──────────────┘  │
└───────────────────────────────┘
```

### MCP 配置示例

```json
// mcp-config.json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@localhost:5432/mydb"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"],
      "env": {
        "ALLOWED_DIRECTORIES": "/Users/me/Documents,/Users/me/Projects"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

## 数据源集成

### 数据库集成

#### PostgreSQL 集成
```javascript
// mcp-postgres.js
const { MCPServer } = require('@modelcontextprotocol/server');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING
});

const server = new MCPServer({
  name: 'postgres-server',
  version: '1.0.0'
});

// 注册查询工具
server.addTool({
  name: 'query_database',
  description: 'Execute SQL query on PostgreSQL database',
  parameters: {
    query: {
      type: 'string',
      description: 'SQL query to execute'
    }
  },
  handler: async ({ query }) => {
    try {
      const result = await pool.query(query);
      return {
        rows: result.rows,
        rowCount: result.rowCount
      };
    } catch (error) {
      return { error: error.message };
    }
  }
});

// 注册资源
server.addResource({
  uri: 'postgres://tables',
  name: 'Database Tables',
  description: 'List all tables in the database',
  handler: async () => {
    const result = await pool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `);
    return result.rows;
  }
});

server.start();
```

#### MongoDB 集成
```javascript
// mcp-mongodb.js
const { MCPServer } = require('@modelcontextprotocol/server');
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

const server = new MCPServer({
  name: 'mongodb-server',
  version: '1.0.0'
});

server.addTool({
  name: 'find_documents',
  description: 'Find documents in MongoDB collection',
  parameters: {
    collection: { type: 'string' },
    filter: { type: 'object' },
    limit: { type: 'number', default: 10 }
  },
  handler: async ({ collection, filter, limit }) => {
    const db = client.db();
    const docs = await db.collection(collection)
      .find(filter)
      .limit(limit)
      .toArray();
    return docs;
  }
});
```

### 文件系统集成

```javascript
// mcp-filesystem.js
const { MCPServer } = require('@modelcontextprotocol/server');
const fs = require('fs').promises;
const path = require('path');

const server = new MCPServer({
  name: 'filesystem-server',
  version: '1.0.0'
});

// 读取文件
server.addTool({
  name: 'read_file',
  description: 'Read content from a file',
  parameters: {
    filepath: { type: 'string' }
  },
  handler: async ({ filepath }) => {
    const allowedDirs = process.env.ALLOWED_DIRECTORIES.split(',');
    const resolvedPath = path.resolve(filepath);

    // 安全检查
    const isAllowed = allowedDirs.some(dir =>
      resolvedPath.startsWith(path.resolve(dir))
    );

    if (!isAllowed) {
      throw new Error('Access denied: Path not in allowed directories');
    }

    const content = await fs.readFile(resolvedPath, 'utf-8');
    return { content };
  }
});

// 写入文件
server.addTool({
  name: 'write_file',
  description: 'Write content to a file',
  parameters: {
    filepath: { type: 'string' },
    content: { type: 'string' }
  },
  handler: async ({ filepath, content }) => {
    // 安全检查 (同上)
    await fs.writeFile(filepath, content, 'utf-8');
    return { success: true };
  }
});

// 列出目录
server.addTool({
  name: 'list_directory',
  description: 'List files in a directory',
  parameters: {
    directory: { type: 'string' }
  },
  handler: async ({ directory }) => {
    const files = await fs.readdir(directory);
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const stats = await fs.stat(path.join(directory, file));
        return {
          name: file,
          isDirectory: stats.isDirectory(),
          size: stats.size,
          modified: stats.mtime
        };
      })
    );
    return fileStats;
  }
});
```

### API 服务集成

```javascript
// mcp-rest-api.js
const { MCPServer } = require('@modelcontextprotocol/server');
const axios = require('axios');

const server = new MCPServer({
  name: 'rest-api-server',
  version: '1.0.0'
});

server.addTool({
  name: 'call_api',
  description: 'Make HTTP request to external API',
  parameters: {
    url: { type: 'string' },
    method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE'] },
    headers: { type: 'object' },
    data: { type: 'object' }
  },
  handler: async ({ url, method = 'GET', headers = {}, data }) => {
    try {
      const response = await axios({
        url,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        data
      });

      return {
        status: response.status,
        data: response.data
      };
    } catch (error) {
      return {
        error: error.message,
        status: error.response?.status
      };
    }
  }
});
```

## 云服务集成

### AWS S3 集成

```javascript
// mcp-aws-s3.js
const { MCPServer } = require('@modelcontextprotocol/server');
const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const server = new MCPServer({
  name: 's3-server',
  version: '1.0.0'
});

// 上传文件
server.addTool({
  name: 'upload_to_s3',
  description: 'Upload file to S3 bucket',
  parameters: {
    bucket: { type: 'string' },
    key: { type: 'string' },
    content: { type: 'string' }
  },
  handler: async ({ bucket, key, content }) => {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: content
    });

    await s3Client.send(command);
    return { success: true, url: `s3://${bucket}/${key}` };
  }
});

// 列出文件
server.addTool({
  name: 'list_s3_objects',
  description: 'List objects in S3 bucket',
  parameters: {
    bucket: { type: 'string' },
    prefix: { type: 'string' }
  },
  handler: async ({ bucket, prefix = '' }) => {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix
    });

    const response = await s3Client.send(command);
    return response.Contents || [];
  }
});
```

## 数据处理

### CSV 数据处理

```javascript
// mcp-csv.js
const { MCPServer } = require('@modelcontextprotocol/server');
const fs = require('fs').promises;
const csv = require('csv-parser');
const { createReadStream, createWriteStream } = require('fs');

const server = new MCPServer({
  name: 'csv-server',
  version: '1.0.0'
});

server.addTool({
  name: 'read_csv',
  description: 'Read and parse CSV file',
  parameters: {
    filepath: { type: 'string' },
    options: { type: 'object' }
  },
  handler: async ({ filepath, options = {} }) => {
    return new Promise((resolve, reject) => {
      const results = [];

      createReadStream(filepath)
        .pipe(csv(options))
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }
});

server.addTool({
  name: 'write_csv',
  description: 'Write data to CSV file',
  parameters: {
    filepath: { type: 'string' },
    data: { type: 'array' },
    headers: { type: 'array' }
  },
  handler: async ({ filepath, data, headers }) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(h => JSON.stringify(row[h] || '')).join(',')
      )
    ].join('\n');

    await fs.writeFile(filepath, csvContent);
    return { success: true, rows: data.length };
  }
});
```

## 安全和权限

### 认证机制

```javascript
// mcp-auth.js
const { MCPServer } = require('@modelcontextprotocol/server');
const jwt = require('jsonwebtoken');

const server = new MCPServer({
  name: 'secure-server',
  version: '1.0.0'
});

// 认证中间件
server.use(async (context, next) => {
  const token = context.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    context.user = decoded;
    await next();
  } catch (error) {
    throw new Error('Invalid token');
  }
});

// 权限检查
const requirePermission = (permission) => {
  return async (context, next) => {
    if (!context.user.permissions.includes(permission)) {
      throw new Error(`Permission denied: ${permission}`);
    }
    await next();
  };
};

server.addTool({
  name: 'delete_data',
  description: 'Delete sensitive data',
  middleware: [requirePermission('admin')],
  handler: async ({ id }) => {
    // 执行删除操作
  }
});
```

## 监控和日志

### 性能监控

```javascript
// mcp-monitoring.js
const { MCPServer } = require('@modelcontextprotocol/server');

const server = new MCPServer({
  name: 'monitored-server',
  version: '1.0.0'
});

// 性能监控中间件
server.use(async (context, next) => {
  const start = Date.now();

  try {
    await next();
    const duration = Date.now() - start;

    // 记录性能指标
    console.log({
      tool: context.tool,
      duration,
      status: 'success'
    });

    // 慢查询告警
    if (duration > 5000) {
      console.warn(`Slow operation detected: ${context.tool} took ${duration}ms`);
    }
  } catch (error) {
    const duration = Date.now() - start;

    console.error({
      tool: context.tool,
      duration,
      status: 'error',
      error: error.message
    });

    throw error;
  }
});
```

## 最佳实践

### MCP 服务设计原则
1. **单一职责**: 每个 MCP 服务专注一个数据源或功能
2. **安全第一**: 实施认证、授权和数据验证
3. **错误处理**: 优雅处理错误,提供清晰的错误信息
4. **性能优化**: 缓存、批处理、异步操作
5. **可监控**: 记录日志和性能指标

### 配置管理
- 使用环境变量存储敏感信息
- 提供默认配置和验证
- 支持多环境配置
- 文档化所有配置项

### 数据安全
- 验证所有输入数据
- 限制访问路径和权限
- 加密敏感数据传输
- 定期审计访问日志

## 工具推荐

### MCP 开发
- **@modelcontextprotocol/server** - MCP 服务器库
- **@modelcontextprotocol/client** - MCP 客户端库
- **typescript** - 类型安全开发

### 数据库驱动
- **pg** - PostgreSQL
- **mysql2** - MySQL
- **mongodb** - MongoDB
- **redis** - Redis

### 云服务 SDK
- **@aws-sdk** - AWS 服务
- **@azure/storage-blob** - Azure Storage
- **@google-cloud** - Google Cloud Platform

## 与其他助理的配合

- **数据分析助理**: 提供数据查询能力
- **数据库助理**: 专注数据库操作
- **部署助理**: 云服务资源管理
- **监控助理**: 性能监控和告警
