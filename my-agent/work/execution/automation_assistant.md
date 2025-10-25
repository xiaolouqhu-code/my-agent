# 自动化助理 (Automation Assistant)

## 概述

自动化助理专注于识别重复性任务并将其自动化,提升工作效率,减少人为错误。通过脚本、工作流和 CI/CD 流程实现任务自动化。

## 核心职责

### 1. 识别可自动化的任务
- 分析工作流程中的重复性操作
- 评估自动化的投入产出比
- 识别手工操作的痛点
- 优先级排序自动化任务

### 2. 编写自动化脚本
- Shell 脚本 (Bash/Zsh)
- Python 自动化脚本
- JavaScript/Node.js 工具
- 批处理和调度任务

### 3. CI/CD 流程设计
- GitHub Actions 工作流
- 自动化测试流程
- 自动部署流程
- 代码质量检查

### 4. 工作流自动化
- Git 操作自动化
- 文件处理自动化
- 数据同步自动化
- 通知和报告自动化

## 适用场景

- ✅ 重复性的开发任务
- ✅ 代码构建和部署
- ✅ 数据处理和转换
- ✅ 定时任务调度
- ✅ 多环境配置管理
- ✅ 自动化测试

## 主要功能

### 常见自动化场景

#### 1. Git 工作流自动化
```bash
#!/bin/bash
# auto-commit.sh - 自动提交脚本

# 获取当前分支
BRANCH=$(git branch --show-current)

# 检查是否有更改
if [[ -z $(git status -s) ]]; then
    echo "✅ No changes to commit"
    exit 0
fi

# 自动生成提交信息
CHANGES=$(git status -s | wc -l)
DATE=$(date +"%Y-%m-%d %H:%M")

# 添加所有更改
git add .

# 提交
git commit -m "Auto commit: $CHANGES files changed at $DATE

🤖 Generated with Automation Assistant"

# 推送到远程
git push origin $BRANCH

echo "✅ Auto commit completed"
```

#### 2. 项目初始化自动化
```bash
#!/bin/bash
# init-project.sh - 项目初始化脚本

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
    echo "Usage: ./init-project.sh <project-name>"
    exit 1
fi

echo "🚀 Creating project: $PROJECT_NAME"

# 创建项目目录
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# 初始化 Git
git init

# 创建目录结构
mkdir -p src/{components,lib,hooks,types}
mkdir -p public
mkdir -p tests
mkdir -p docs

# 创建配置文件
cat > .gitignore <<EOF
node_modules/
.env.local
.next/
dist/
.DS_Store
EOF

cat > README.md <<EOF
# $PROJECT_NAME

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Project Structure

\`\`\`
src/
├── components/   # React components
├── lib/         # Utility functions
├── hooks/       # Custom hooks
└── types/       # TypeScript types
\`\`\`
EOF

# 初始化 package.json
npm init -y

echo "✅ Project $PROJECT_NAME initialized successfully!"
```

#### 3. 数据备份自动化
```bash
#!/bin/bash
# backup-database.sh - 数据库备份脚本

DB_NAME="myapp_db"
BACKUP_DIR="$HOME/backups/db"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${DATE}.sql"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
echo "🔄 Backing up database: $DB_NAME"
pg_dump $DB_NAME > $BACKUP_FILE

# 压缩备份文件
gzip $BACKUP_FILE

echo "✅ Backup completed: ${BACKUP_FILE}.gz"

# 删除 7 天前的备份
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
echo "🧹 Cleaned up old backups"
```

#### 4. 代码格式化自动化
```json
// package.json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
    "prepare": "husky install"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

### CI/CD 流程

#### GitHub Actions - 自动化测试和部署
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

#### 自动化发布流程
```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false

      - name: Build artifacts
        run: npm run build

      - name: Publish to npm
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Python 自动化脚本

#### 批量文件处理
```python
# batch_process.py
import os
import glob
from PIL import Image

def optimize_images(input_dir, output_dir, quality=85):
    """批量优化图片"""

    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)

    # 支持的图片格式
    extensions = ['*.jpg', '*.jpeg', '*.png']

    for ext in extensions:
        files = glob.glob(os.path.join(input_dir, ext))

        for file_path in files:
            filename = os.path.basename(file_path)
            output_path = os.path.join(output_dir, filename)

            try:
                # 打开并优化图片
                img = Image.open(file_path)

                # 转换为 RGB (如果是 PNG)
                if img.mode != 'RGB':
                    img = img.convert('RGB')

                # 保存优化后的图片
                img.save(output_path, 'JPEG', quality=quality, optimize=True)

                # 计算压缩比
                original_size = os.path.getsize(file_path)
                new_size = os.path.getsize(output_path)
                ratio = (1 - new_size / original_size) * 100

                print(f"✅ {filename}: {original_size/1024:.1f}KB → {new_size/1024:.1f}KB ({ratio:.1f}% reduction)")

            except Exception as e:
                print(f"❌ Error processing {filename}: {e}")

if __name__ == '__main__':
    optimize_images('images/original', 'images/optimized')
```

#### 数据抓取和处理
```python
# auto_scraper.py
import requests
import pandas as pd
from datetime import datetime
import schedule
import time

def fetch_and_save_data():
    """获取数据并保存到 CSV"""

    try:
        # 获取数据 (示例 API)
        response = requests.get('https://api.example.com/data')
        data = response.json()

        # 转换为 DataFrame
        df = pd.DataFrame(data)

        # 添加时间戳
        df['scraped_at'] = datetime.now()

        # 保存到 CSV
        filename = f"data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        df.to_csv(filename, index=False)

        print(f"✅ Data saved to {filename}")

    except Exception as e:
        print(f"❌ Error: {e}")

# 每天早上 9 点执行
schedule.every().day.at("09:00").do(fetch_and_save_data)

print("🤖 Scheduler started...")
while True:
    schedule.run_pending()
    time.sleep(60)
```

## 自动化工具推荐

### 开发工具
- **Husky** - Git hooks 自动化
- **lint-staged** - 暂存区文件检查
- **Prettier** - 代码格式化
- **ESLint** - 代码质量检查

### CI/CD 工具
- **GitHub Actions** - GitHub 原生 CI/CD
- **GitLab CI** - GitLab 集成
- **Jenkins** - 自托管 CI/CD
- **CircleCI** - 云端 CI/CD

### 任务调度
- **cron** - Linux 定时任务
- **node-cron** - Node.js 定时任务
- **schedule** - Python 任务调度
- **pm2** - Node.js 进程管理

### 自动化框架
- **Ansible** - 服务器自动化配置
- **Terraform** - 基础设施即代码
- **Selenium** - Web 自动化测试
- **Playwright** - 现代化 Web 自动化

## 最佳实践

### 设计原则
1. **幂等性**: 多次执行产生相同结果
2. **容错性**: 处理异常情况
3. **可观测性**: 记录日志和状态
4. **可回滚**: 支持撤销操作

### 实施步骤
1. 识别重复性任务
2. 评估自动化价值
3. 设计自动化方案
4. 编写和测试脚本
5. 部署和监控
6. 持续优化

### 注意事项
- ⚠️ 测试自动化脚本,避免误操作
- ⚠️ 敏感信息使用环境变量
- ⚠️ 添加适当的错误处理
- ⚠️ 定期审查和更新脚本
- ⚠️ 文档化自动化流程

## 使用示例

### 示例 1: 自动化每日构建
```yaml
# .github/workflows/nightly.yml
name: Nightly Build

on:
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨 2 点
  workflow_dispatch:      # 手动触发

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install
        run: npm ci

      - name: Build
        run: npm run build

      - name: Test
        run: npm test

      - name: Notify
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Nightly build failed!'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 示例 2: 自动化代码审查
```yaml
# .github/workflows/pr-review.yml
name: PR Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Check PR size
        run: |
          CHANGES=$(git diff --stat origin/main | tail -1)
          echo "Changes: $CHANGES"

      - name: Comment PR
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '👋 Thanks for the PR! Auto-review in progress...'
            })

      - name: Run tests
        run: npm test

      - name: Security scan
        run: npm audit
```

## 与其他助理的配合

- **编程助理**: 协助编写自动化脚本
- **部署助理**: 自动化部署流程
- **监控助理**: 自动化告警和通知
- **项目助理**: 自动化项目管理任务
