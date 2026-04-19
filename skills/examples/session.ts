import { Bot } from "gramio";
import { session } from "@gramio/session";

// Register ONE session per bot. The plugin dedupes by its internal name,
// so a second `.extend(session(...))` is silently ignored — put all fields
// under a single session object instead.
//
// Session values must be objects (the proxy-based $clear + auto-persist
// rely on object reference semantics). Wrap primitives like counters in
// `{ value: 0 }`.
const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(
        session({
            key: "session",
            initial: () => ({
                counter: 0,
                settings: { language: "en", notifications: true },
            }),
        })
    )
    .command("count", (context) => {
        context.session.counter++;
        return context.send(`Count: ${context.session.counter}`);
    })
    .command("settings", (context) => {
        const { language, notifications } = context.session.settings;
        return context.send(
            `Language: ${language}\nNotifications: ${notifications}`
        );
    })
    .command("toggle", (context) => {
        context.session.settings.notifications = !context.session.settings.notifications;
        return context.send(
            `Notifications: ${context.session.settings.notifications ? "ON" : "OFF"}`
        );
    });

// --- With Redis storage for persistence ---
// Uncomment and run a Redis server to enable the persistent variant:
//
// import { redisStorage } from "@gramio/storage-redis";
// import { Redis } from "ioredis";
//
// const persistent = new Bot(process.env.BOT_TOKEN as string).extend(
//     session({
//         key: "session",
//         initial: () => ({ visits: 0 }),
//         storage: redisStorage(new Redis()),
//     })
// );

bot.start();

export { bot };
