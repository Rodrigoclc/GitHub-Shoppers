#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:?APP_DIR is required}"
ENV_FILE="${ENV_FILE:?ENV_FILE is required}"
APP_PORT="${APP_PORT:-8082}"
FRONTEND_PORT="${FRONTEND_PORT:-8083}"
CONTAINER_NAME="${CONTAINER_NAME:-github-shoppers-api}"
IMAGE_NAME="${IMAGE_NAME:-github-shoppers-api:prod}"
FRONTEND_CONTAINER="${FRONTEND_CONTAINER:-github-shoppers-web}"
FRONTEND_IMAGE="${FRONTEND_IMAGE:-github-shoppers-web:prod}"
API_URL="${API_URL:-https://api.github-shoppers.orodrigodev.com.br}"

cd "$APP_DIR/backend"
test -f "$ENV_FILE"

docker build --pull -t "$IMAGE_NAME" .

docker run --rm \
  --network host \
  --env-file "$ENV_FILE" \
  "$IMAGE_NAME" \
  node dist/database/migrate.js

docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  --network host \
  --env-file "$ENV_FILE" \
  "$IMAGE_NAME" >/dev/null

for attempt in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:${APP_PORT}/api/health" >/dev/null; then
    break
  fi
  sleep 2
done

if ! curl -fsS "http://127.0.0.1:${APP_PORT}/api/health" >/dev/null; then
  echo 'GitHub Shoppers API did not become ready.' >&2
  docker logs --tail 100 "$CONTAINER_NAME" >&2 || true
  exit 1
fi

docker build --pull --build-arg "VITE_API_URL=${API_URL}/api" -t "$FRONTEND_IMAGE" "$APP_DIR/frontend"
docker rm -f "$FRONTEND_CONTAINER" >/dev/null 2>&1 || true
docker run -d \
  --name "$FRONTEND_CONTAINER" \
  --restart unless-stopped \
  --network host \
  "$FRONTEND_IMAGE" >/dev/null

for attempt in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:${FRONTEND_PORT}/" >/dev/null; then
    printf 'github_shoppers_frontend_health=ok\n'
    exit 0
  fi
  sleep 2
done

echo 'GitHub Shoppers frontend did not become ready.' >&2
docker logs --tail 100 "$FRONTEND_CONTAINER" >&2 || true
exit 1
