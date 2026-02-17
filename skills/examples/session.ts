import { Bot } from "gramio";
import { sessionPlugin } from "@gramio/session";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(
        sessionPlugin({
            key: "counter",
            initial: () => 0,
        })
    )
    .extend(
        sessionPlugin({
            key: "settings",
            initial: () => ({
                language: "en",
                notifications: true,
            }),
        })
    )
    .command("count", (context) => {
        context.counter++;
        return context.send(`Count: ${context.counter}`);
    })
    .command("settings", (context) => {
        return context.send(
            `Language: ${context.settings.language}\nNotifications: ${context.settings.notifications}`
        );
    })
    .command("toggle", (context) => {
        context.settings.notifications = !context.settings.notifications;
        return context.send(
            `Notifications: ${context.settings.notifications ? "ON" : "OFF"}`
        );
    });

// --- With Redis storage for persistence ---

import { redisStorage } from "@gramio/storage-redis";
import { Redis } from "ioredis";

const redis = new Redis();

const persistentBot = new Bot(process.env.BOT_TOKEN as string)
    .extend(
        sessionPlugin({
            key: "data",
            initial: () => ({ visits: 0 }),
            storage: redisStorage(redis),
        })
    );

bot.start();
