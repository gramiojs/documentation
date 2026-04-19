// Production bot with graceful shutdown — Docker-friendly
import { Bot, webhookHandler } from "gramio";
import { Elysia } from "elysia";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (ctx) => ctx.send("Bot is running!"))
    .command("ping", (ctx) => ctx.send("pong"))
    .onStart(({ info }) => console.log(`[bot] @${info.username} started`))
    .onStop(() => console.log("[bot] stopped gracefully"))
    .onError(({ kind, error }) => {
        console.error(`[bot error] [${kind}]`, error.message);
    });

// Webhook or long polling based on environment
const useWebhook = !!process.env.WEBHOOK_URL;
const port = Number(process.env.PORT) || 3000;

if (useWebhook) {
    // `webhook` only carries Telegram setWebhook params (url, certificate, …).
    // Port is handled by the HTTP framework you choose — here, Elysia.
    new Elysia()
        .post("/webhook", webhookHandler(bot, "elysia"))
        .listen(port);

    await bot.start({
        webhook: { url: process.env.WEBHOOK_URL! },
    });
    console.log(`[bot] webhook mode on port ${port}`);
} else {
    await bot.start({
        longPolling: { timeout: 30 },
        dropPendingUpdates: true,
    });
    console.log("[bot] long polling mode");
}

// Graceful shutdown for Docker (SIGTERM) and Ctrl+C (SIGINT)
const shutdown = async (signal: string) => {
    console.log(`[bot] received ${signal}, shutting down...`);
    await bot.stop(5000);
    process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
