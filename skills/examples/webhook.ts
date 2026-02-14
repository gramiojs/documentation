import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (context) => context.send("Hello from webhook!"));

// Start with webhook
bot.start({
    webhook: {
        url: "https://example.com/webhook",
        path: "/webhook",
        port: 3000,
    },
});

// --- Alternative: Use with existing web framework ---

// Elysia
import { Elysia } from "elysia";

const elysiaBot = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (context) => context.send("Hello!"));

new Elysia()
    .post("/webhook", ({ body }) => {
        elysiaBot.handleUpdate(body);
    })
    .listen(3000);

// --- Pre-configured webhook (already set via setWebhook) ---

const preConfigured = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (context) => context.send("Hello!"));

preConfigured.start({
    webhook: true, // Uses existing webhook config
});
