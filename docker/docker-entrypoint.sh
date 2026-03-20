#!/bin/sh
set -e

# ---------- 1. Generate /usr/share/nginx/html/env-config.js from APP_* env vars ----------
ENV_JS="/usr/share/nginx/html/env-config.js"

echo "window._env_ = {" > "$ENV_JS"
# Iterate all environment variables with APP_ prefix
env | grep '^APP_' | while IFS='=' read -r key value; do
  echo "  \"${key}\": \"${value}\"," >> "$ENV_JS"
done
echo "};" >> "$ENV_JS"

echo "[entrypoint] Generated $ENV_JS:"
cat "$ENV_JS"

# ---------- 2. Generate nginx.conf from template ----------
envsubst '${BACKEND_SERVER}' < /etc/nginx/templates/nginx.conf.template \
  > /etc/nginx/conf.d/default.conf

echo "[entrypoint] Generated nginx config with BACKEND_SERVER=${BACKEND_SERVER}"

# ---------- 3. Validate and start nginx ----------
nginx -t
exec nginx -g 'daemon off;'
