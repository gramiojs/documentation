// Production bot with graceful shutdown — Docker-friendly
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (ctx) => ctx.send("Bot is running!"))
    .command("ping", (ctx) => ctx.send("pong"))
    .onStart(({ info }) => console.log(`[bot] @${info.username} started`))
    .onStop(() => console.log("[bot] stopped gracefully"))
    .onError(({ context, kind, error }) => {
        console.error(`[bot error] [${kind}]`, error.message);
    });

// Webhook or long polling based on environment
const useWebhook = !!process.env.WEBHOOK_URL;

if (useWebhook) {
    await bot.start({
        webhook: {
            url: process.env.WEBHOOK_URL!,
            port: Number(process.env.PORT) || 3000,
        },
    });
    console.log(`[bot] webhook mode on port ${process.env.PORT || 3000}`);
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
