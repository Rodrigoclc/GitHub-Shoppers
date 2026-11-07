# GitHub Shoppers deployment contract

This repository publishes immutable application artifacts. The central infrastructure repository owns the host, reverse proxy, PostgreSQL, runtime configuration, image pull, migration, startup, and health verification. The server must not clone this repository or build application images.

## Images

The publishing workflow builds and pushes two `linux/amd64` images to GHCR on `main` and `feat/immutable-deploy`:

- `ghcr.io/rodrigoclc/github-shoppers-api:sha-<full-git-commit>` from `backend/Dockerfile`
- `ghcr.io/rodrigoclc/github-shoppers-web:sha-<full-git-commit>` from `frontend/Dockerfile`

The workflow emits an artifact named `image-digests-<full-git-commit>` containing both image digests. Deployments must use the digest or the exact `sha-<full-git-commit>` tag; `latest` and server-side source builds are not part of the contract.

The web image is built with:

```text
VITE_API_URL=https://api-github-shoppers.orodrigodev.com.br/api
```

## Runtime contract

| Service | Container port | Health check |
| --- | ---: | --- |
| API | `8082` | `GET /api/health`, HTTP `200` |
| Web | `8083` | `GET /`, HTTP `200` |

The API migration is a one-shot operation run before starting the API service, using the API image itself:

```text
node dist/database/migrate.js
```

The API image includes the compiled migration runner and SQL migrations. A successful migration must be required before application startup.

## Database and configuration ownership

Central infrastructure provisions PostgreSQL database `github_shoppers` and role `github_shoppers_app`. The application runtime configuration names are:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USERNAME
DB_PASSWORD
JWT_SECRET
PORT
NODE_ENV
GITHUB_API_URL
FRONTEND_URL
```

Values and secrets are supplied by central infrastructure; this repository documents names only. The machine-readable source of this contract is [`deployment-contract.json`](../deployment-contract.json).
