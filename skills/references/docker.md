---
name: docker
description: Dockerizing GramIO bots — Dockerfile for Node.js and Bun, multi-stage builds, Docker Compose with env_file and volumes, build/run commands.
---

# Docker

## Node.js Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

CMD ["npm", "start"]
```

## Bun Dockerfile

```dockerfile
FROM oven/bun:latest

WORKDIR /app
COPY package*.json ./
RUN bun install
COPY . .

CMD ["bun", "run", "start"]
```

## Multi-Stage Build (Production)

Reduces final image size by excluding dev dependencies and source files:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --production

CMD ["node", "dist/index.js"]
```

## Docker Compose

```yaml
version: "3.8"

services:
  bot:
    build: .
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - ./data:/app/data
```

## Environment Variables

Create a `.env` file (never commit it):

```
BOT_TOKEN=your_bot_token_here
```

## Build & Run Commands

```bash
# Build image
docker build -t my-gramio-bot .

# Run container
docker run -d --name gramio-bot --env-file .env my-gramio-bot

# Docker Compose
docker-compose up -d

# View logs
docker logs -f gramio-bot
```

## Error Logging

Ensure errors reach Docker's logging system:

```typescript
bot.onError(({ error }) => {
    console.error(`[bot error] ${error.message}`);
});
```

<!--
Source: https://gramio.dev/guides/docker
-->
