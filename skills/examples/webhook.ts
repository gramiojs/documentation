import { Bot, webhookHandler } from "gramio";

// --- Webhook with an HTTP framework (preferred) ---
// Use `webhookHandler(bot, "framework-name")` to mount the bot on your server,
// then call bot.start({ webhook: { url } }) to register the URL with Telegram.

import { Elysia } from "elysia";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (context) => context.send("Hello from webhook!"));

new Elysia()
    .post("/webhook", webhookHandler(bot, "elysia"))
    .listen(3000);

await bot.start({
    webhook: { url: "https://example.com/webhook" },
});

// --- Pre-configured webhook (URL already set via setWebhook) ---

const preConfigured = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (context) => context.send("Hello!"));

await preConfigured.start({
    webhook: true, // Uses existing Telegram webhook config
});
