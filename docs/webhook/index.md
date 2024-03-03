# Webhook

## Supported frameworks

-   [Elysia](https://elysiajs.com/)
-   [Fastify](https://fastify.dev/)
-   [Hono](https://hono.dev/)
-   [Express](https://expressjs.com/)

## Example

```ts
import { Bot } from "gramio";
import Fastify from "fastify";

const bot = new Bot(process.env.TOKEN!);
const fastify = Fastify();

fastify.post("/tg-webhook", webhookHandler(bot, "fastify"));

fastify.listen({ port: 3445, host: "::" });

bot.on("message", (context) => {
    return context.send("Fastify!");
});

bot.start({
    webhook: {
        url: "https://example.com:3445/telegram-webhook",
    },
});
```
