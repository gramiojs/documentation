---
title: Setting up webhooks in GramIO - Guide to using webhooks

head:
    - - meta
      - name: "description"
        content: "Learn how to set up and use webhooks in GramIO for your Telegram bot. This guide covers webhook configuration, HTTPS setup, Nginx configuration, and security considerations."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, webhook, HTTPS, SSL certificates, Nginx setup, Express integration, server configuration, webhook vs polling, bot updates, webhook security, setWebhook, serverless webhooks, self-signed certificates"
---

# Setting Up Webhooks in GramIO

Webhooks allow your Telegram bot to receive updates via HTTPS callbacks rather than long polling. This guide will help you set up webhooks for your GramIO bot.

## Prerequisites

- A publicly accessible server with a domain name
- SSL certificate (Telegram requires HTTPS)
- Node.js and GramIO installed

## Basic Webhook Setup

Here's how to set up a basic webhook with GramIO:

```typescript
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

// Start the bot with webhook
bot.start({
  webhook: {
    domain: "https://your-domain.com",
    path: "/webhook-path", // Telegram will send updates to this endpoint
    port: 3000 // Port to listen on
  }
});

// Your bot handlers
bot.command("start", (ctx) => ctx.send("Hello from webhook bot!"));
```

## Obtaining an SSL Certificate

For production, obtain an SSL certificate from a trusted Certificate Authority like Let's Encrypt:

```bash
# Using Certbot (Let's Encrypt)
sudo certbot certonly --standalone -d your-domain.com
```

## Nginx Configuration

If you're using Nginx as a reverse proxy, configure it to forward webhook requests:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    location /webhook-path {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Self-Signed Certificates

For development or testing, you can use self-signed certificates:

```typescript
import { Bot } from "gramio";
import fs from "fs";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.start({
  webhook: {
    domain: "https://your-domain.com",
    path: "/webhook-path",
    port: 3000,
    certificate: {
      source: fs.readFileSync("./path/to/cert.pem")
    }
  }
});
```

## Checking Webhook Status

To verify your webhook is set correctly:

```typescript
// Check webhook info
const info = await bot.api.getWebhookInfo();
console.log(info);
```

## Integrating with an Existing Express Server

If you already have an Express server:

```typescript
import express from "express";
import { Bot } from "gramio";

const app = express();
const bot = new Bot(process.env.BOT_TOKEN as string);

// Your Express middleware
app.use(express.json());

// Register webhook handler
app.use("/webhook-path", (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

// Start Express server
app.listen(3000, () => {
  console.log("Express server started");
  
  // Set webhook
  bot.api.setWebhook({
    url: "https://your-domain.com/webhook-path"
  });
});

// Your bot handlers
bot.command("start", (ctx) => ctx.send("Hello from webhook bot!"));
```

## Webhook vs. Long Polling

Advantages of webhooks:
- More efficient as your server only processes updates when they happen
- Lower latency for processing updates
- Better for production environments with stable connections

Consider using webhooks in production and long polling during development.

## Security Considerations

- Always use HTTPS with valid certificates
- Use a random, secret path for your webhook endpoint
- Consider IP restrictions if Telegram's IP range is stable for your use case
- Validate incoming updates to ensure they're from Telegram

## Conclusion

Webhooks provide an efficient way to receive updates for your Telegram bot. With proper configuration, they offer better performance and scalability compared to long polling, making them ideal for production environments. 