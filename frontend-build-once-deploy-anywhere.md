# 前端一次构建，多处部署 —— 完整实现方案

> **核心思路**：同一个 Docker 镜像，通过容器启动时注入环境变量，分别完成 Nginx 反向代理配置和前端业务变量注入，实现真正的 "Build once, deploy anywhere"。

---

## 整体架构

```
环境变量（docker run -e）
  │
  ├── BACKEND_SERVER / GATEWAY / MINIO ...
  │       └──→ envsubst → nginx.conf       → Nginx 反向代理（前端不感知）
  │
  └── APP_SENTRY_DSN / APP_FEATURE_* ...
          └──→ entrypoint.sh → env-config.js → window._env_ → 前端业务代码
```

---

## 项目结构

```
project/
├── src/
│   └── config/
│       └── env.ts                 # 前端环境变量统一访问入口
├── nginx/
│   └── nginx.conf.template        # Nginx 配置模板
├── docker/
│   └── docker-entrypoint.sh       # 容器启动脚本
├── .env.development               # 本地开发变量
├── vite.config.ts                 # 本地代理配置
├── index.html                     # 最先加载 env-config.js
└── Dockerfile
```

---

## 变量分工与命名对应

```
.env.development（本地）    docker run -e（容器）       业务代码
──────────────────────      ────────────────────         ──────────────────
VITE_APP_SENTRY_DSN    →   APP_SENTRY_DSN           →   ENV.sentryDsn
VITE_APP_OSS_BUCKET    →   APP_OSS_BUCKET            →   ENV.ossBucket
VITE_APP_FEATURE_*     →   APP_FEATURE_*             →   ENV.featureXxx

（无需前端感知）             BACKEND_SERVER           →   nginx proxy_pass /api/
（无需前端感知）             GATEWAY                  →   nginx proxy_pass /gateway/
（无需前端感知）             MINIO / MINIO_DOMAIN     →   nginx proxy_pass /minio/
```

---

## 完整实现

### 1. `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <!-- ⚠️ 必须最先加载，不加 defer/async，确保 bundle 执行前 window._env_ 已就绪 -->
    <script src="/env-config.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

---

### 2. `nginx/nginx.conf.template`

```nginx
server {
    listen 80;
    server_name localhost;

    # ✅ env-config.js 禁止缓存，容器重启后立即生效
    location = /env-config.js {
        root /usr/share/nginx/html;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        add_header Pragma "no-cache";
    }

    # 前端静态资源
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理（${BACKEND_SERVER} 运行时替换）
    location /api/ {
        proxy_pass http://${BACKEND_SERVER}/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 网关
    location /gateway/ {
        proxy_pass http://${GATEWAY}/;
        proxy_set_header Host $host;
    }

    # MinIO 文件服务
    location /minio/ {
        proxy_pass http://${MINIO}/;
        proxy_set_header Host ${MINIO_DOMAIN};
    }
}
```

> `$host`、`$remote_addr` 是 Nginx 内置变量，`${BACKEND_SERVER}` 是我们要替换的，通过显式列举变量名，两者互不干扰。

---

### 3. `docker/docker-entrypoint.sh`

```bash
#!/bin/sh
set -e

# ────────────────────────────────────────────
# Step 1: 生成 env-config.js（前端业务变量）
# ────────────────────────────────────────────
ENV_JS=/usr/share/nginx/html/env-config.js

echo "⚙️  Generating env-config.js ..."

cat <<EOF > "$ENV_JS"
// Auto-generated at container startup — DO NOT EDIT
window._env_ = {
EOF

# 只遍历 APP_ 前缀变量，避免系统变量泄露
env | grep "^APP_" | while IFS='=' read -r key value; do
  escaped=$(printf '%s' "$value" | sed 's/\\/\\\\/g; s/"/\\"/g')
  echo "  \"${key}\": \"${escaped}\"," >> "$ENV_JS"
done

echo "};" >> "$ENV_JS"

echo "✅  env-config.js:"
cat "$ENV_JS"

# ────────────────────────────────────────────
# Step 2: 生成 nginx.conf（代理地址替换）
# ────────────────────────────────────────────
echo "⚙️  Applying nginx config ..."

envsubst '${BACKEND_SERVER} ${GATEWAY} ${MINIO} ${MINIO_DOMAIN}' \
  < /etc/nginx/conf.d/default.conf.template \
  > /etc/nginx/conf.d/default.conf.tmp

# 用临时文件覆盖，避免边读边写导致文件清空
mv /etc/nginx/conf.d/default.conf.tmp \
   /etc/nginx/conf.d/default.conf

echo "✅  nginx config:"
cat /etc/nginx/conf.d/default.conf

# 校验配置语法，错误时立即报错
nginx -t

exec nginx -g "daemon off;"
```

---

### 4. `Dockerfile`

```dockerfile
# ---- Stage 1: Build（只需一次）----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Stage 2: Runtime ----
FROM nginx:1.25-alpine

# 前端静态产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 存为 .template，entrypoint 运行时生成真正的 default.conf
COPY nginx/nginx.conf.template /etc/nginx/conf.d/default.conf.template

COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
```

---

### 5. 前端环境变量访问入口 `src/config/env.ts`

```typescript
interface AppEnv {
  APP_SENTRY_DSN: string;
  APP_OSS_BUCKET: string;
  APP_FEATURE_NEW_DASHBOARD: string;
  // 按需扩展...
}

declare global {
  interface Window {
    _env_: Partial<AppEnv>;
  }
}

/**
 * 优先级：window._env_（Docker Runtime）> import.meta.env（本地开发 fallback）
 */
function getEnv<K extends keyof AppEnv>(key: K, fallback = ""): string {
  const runtimeVal = window._env_?.[key];
  if (runtimeVal !== undefined && runtimeVal !== "") return runtimeVal;

  // 本地开发：VITE_APP_SENTRY_DSN → APP_SENTRY_DSN，去掉 VITE_ 前缀对应
  const viteKey = `VITE_${key}`;
  const buildVal = (import.meta.env as Record<string, string>)[viteKey];
  if (buildVal !== undefined && buildVal !== "") return buildVal;

  return fallback;
}

// ✅ 业务代码只引用此对象，不直接读 window._env_ 或 import.meta.env
export const ENV = {
  sentryDsn:           getEnv("APP_SENTRY_DSN"),
  ossBucket:           getEnv("APP_OSS_BUCKET"),
  featureNewDashboard: getEnv("APP_FEATURE_NEW_DASHBOARD") === "true", // ⚠️ 显式转 boolean
} as const;
```

---

### 6. 本地开发配置

**`.env.development`**

```bash
VITE_APP_SENTRY_DSN=https://xxx@sentry.io/dev
VITE_APP_FEATURE_NEW_DASHBOARD=true
VITE_APP_OSS_BUCKET=dev-bucket
```

**`vite.config.ts`**（对应 Nginx 的 proxy_pass）

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api':     { target: 'http://10.0.0.1:8080', changeOrigin: true },
      '/gateway': { target: 'http://10.0.0.1:9000', changeOrigin: true },
      '/minio':   { target: 'http://10.0.0.2:9000', changeOrigin: true },
    }
  }
})
```

---

### 7. 业务代码使用

```typescript
import { ENV } from "@/config/env";

// API 地址不需要环境变量，统一走 /api/ 由 Nginx 代理
const httpClient = axios.create({ baseURL: "/api" });

// 业务变量直接用 ENV
const client = new SentryClient({ dsn: ENV.sentryDsn });

if (ENV.featureNewDashboard) {
  // Feature Flag 控制
}
```

---

## 部署命令

```bash
# 构建一次
docker build -t my-frontend:1.0.0 .

# ────── 测试环境 ──────
docker run -d -p 80:80 \
  -e BACKEND_SERVER=10.0.0.1:8080 \
  -e GATEWAY=10.0.0.1:9000 \
  -e MINIO=10.0.0.2:9000 \
  -e MINIO_DOMAIN=test-files.example.com \
  -e APP_SENTRY_DSN=https://xxx@sentry.io/test \
  -e APP_FEATURE_NEW_DASHBOARD=false \
  my-frontend:1.0.0

# ────── 生产环境（同一个镜像）──────
docker run -d -p 80:80 \
  -e BACKEND_SERVER=10.1.0.1:8080 \
  -e GATEWAY=10.1.0.1:9000 \
  -e MINIO=10.1.0.2:9000 \
  -e MINIO_DOMAIN=files.example.com \
  -e APP_SENTRY_DSN=https://yyy@sentry.io/prod \
  -e APP_FEATURE_NEW_DASHBOARD=true \
  my-frontend:1.0.0
```

---

## 关键原则

| 原则 | 说明 |
|------|------|
| **业务代码只引用 `ENV`** | 不直接写 `window._env_` 或 `import.meta.env` |
| **API 路径不放环境变量** | 统一用 `/api/`，本地 Vite proxy，生产 Nginx proxy_pass |
| **boolean 必须显式转换** | `=== "true"`，Shell 写入全是字符串，`"false"` 是 truthy |
| **Secret 不进前端** | 数据库密码、内部 Token 只放 Nginx 配置，不放 `APP_` 变量 |
| **envsubst 显式列举变量** | 防止替换 Nginx 内置变量 `$host`、`$uri` 等 |
| **用 .template 文件** | 原始模板只读，entrypoint 生成最终配置，避免覆盖问题 |
