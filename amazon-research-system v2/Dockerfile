# 多阶段构建 Dockerfile for Next.js
# Stage 1: 依赖安装
FROM node:20-alpine AS deps
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Stage 2: 构建应用
FROM node:20-alpine AS builder
WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 设置环境变量（构建时需要）
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# 构建 Next.js 应用
RUN npm run build

# Stage 3: 生产运行
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 设置文件权限
RUN chown -R nextjs:nodejs /app

# 切换到非 root 用户
USER nextjs

# 暴露端口（Cloud Run 会自动注入 PORT 环境变量）
EXPOSE 8080

# 设置环境变量
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# 启动应用
CMD ["node", "server.js"]
