---
title: Using Docker with GramIO - Containerization guide

head:
    - - meta
      - name: "description"
        content: "Learn how to use Docker with GramIO to containerize your Telegram bots. This guide covers Dockerfile setup, Docker Compose, environment configuration, and production tips."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, Docker, containerization, Dockerfile, Docker Compose, container, CI/CD, deployment, production docker setup, environment variables, multi-stage build, container optimization"
---

# Using Docker with GramIO

Containerizing your GramIO bot with Docker provides benefits such as environment consistency, simplified deployment, and improved scalability. This guide will help you set up Docker for your GramIO project.

## Basic Dockerfile Setup

Create a `Dockerfile` in your project root:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# If using TypeScript, build the project
RUN npm run build

# Start the bot
CMD ["npm", "start"]
```

## Using Docker Compose

For better configuration management, create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  bot:
    build: .
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      # For persistent data if needed
      - ./data:/app/data
```

## Setting Up Environment Variables

Create a `.env` file for your configuration:

```
BOT_TOKEN=your_bot_token_here
# Other configuration variables
```

## Building and Running

Build and run your container:

```bash
# Build the image
docker build -t my-gramio-bot .

# Run the container
docker run -d --name gramio-bot --env-file .env my-gramio-bot

# Using Docker Compose
docker-compose up -d
```

## Using Bun Instead of Node.js

If you prefer using Bun, adjust your Dockerfile:

```dockerfile
FROM oven/bun:latest

WORKDIR /app

COPY package*.json ./
RUN bun install

COPY . .

CMD ["bun", "run", "start"]
```

## Production Tips

### Multi-stage Builds

For production, consider using multi-stage builds to reduce image size:

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

### CI/CD Integration

Integrate Docker builds into your CI/CD pipeline for automated deployments. Most CI services support Docker natively, making this process straightforward.

### Monitoring and Logs

Configure proper logging by using Docker's logging drivers or by integrating with logging services. For GramIO bots, consider adding log output that can be captured by Docker's logging system:

```typescript
// In your GramIO bot code
bot.onError(({ error }) => {
  console.error(`Error occurred: ${error.message}`);
});
```

## Conclusion

Using Docker with GramIO provides a reliable and consistent environment for running your Telegram bots. The containerized approach makes it easier to deploy and scale your bot across different environments. 