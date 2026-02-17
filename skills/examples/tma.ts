// Telegram Mini App — Elysia server with init-data auth guard + bot webhook
import { Bot } from "gramio";
import {
    validateAndParseInitData,
    signInitData,
    getBotTokenSecretKey,
} from "@gramio/init-data";
import { Elysia, t } from "elysia";

const botToken = process.env.BOT_TOKEN as string;
const secretKey = getBotTokenSecretKey(botToken);

// Auth guard — validates x-init-data header, injects user into context
const authPlugin = new Elysia({ name: "auth" })
    .guard({
        headers: t.Object({
            "x-init-data": t.String({
                examples: [
                    signInitData(
                        { user: { id: 1, first_name: "Test", username: "test" } },
                        secretKey
                    ),
                ],
            }),
        }),
        response: { 401: t.Literal("UNAUTHORIZED") },
    })
    .resolve(({ headers, error }) => {
        const result = validateAndParseInitData(headers["x-init-data"], secretKey);
        if (!result || !result.user) return error("Unauthorized", "UNAUTHORIZED");
        return { tgId: result.user.id, user: result.user };
    })
    .as("plugin");

// Bot instance
const bot = new Bot(botToken)
    .command("start", (ctx) => ctx.send("Open the Mini App!", {
        reply_markup: { inline_keyboard: [[{ text: "Open App", web_app: { url: "https://mini-app.local" } }]] },
    }));

// Elysia server — public + authenticated TMA routes + bot webhook
const app = new Elysia()
    .get("/health", () => "ok")
    .use(authPlugin)
    .get("/user/profile", ({ user }) => ({ id: user.id, name: user.first_name }))
    .get("/user/balance", ({ tgId }) => ({ tgId, balance: 100 }))
    .post("/webhook", async ({ body }) => {
        await bot.handleUpdate(body as any);
        return "ok";
    })
    .listen(3000);

console.log(`Server running at ${app.server?.url}`);
