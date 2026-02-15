import { describe, expect, it } from "bun:test";
import { Bot, InlineKeyboard } from "gramio";
import { TelegramTestEnvironment, apiError } from "@gramio/test";

// 1. Basic command test
describe("Echo bot", () => {
    it("should reply to /start", async () => {
        const bot = new Bot("test");
        bot.command("start", (ctx) => ctx.send("Welcome!"));

        const env = new TelegramTestEnvironment(bot);
        const user = env.createUser({ first_name: "Alice" });

        await user.sendMessage("/start");

        expect(env.apiCalls[0].method).toBe("sendMessage");
        expect(env.apiCalls[0].params.text).toBe("Welcome!");
    });
});

// 2. Inline button click test
describe("Inline buttons", () => {
    it("should handle callback query", async () => {
        const bot = new Bot("test");
        bot.command("menu", (ctx) =>
            ctx.send("Pick:", {
                reply_markup: new InlineKeyboard()
                    .text("Option A", "opt_a")
                    .text("Option B", "opt_b"),
            })
        );
        bot.callbackQuery("opt_a", (ctx) =>
            ctx.editText("You chose A!")
        );

        const env = new TelegramTestEnvironment(bot);
        const user = env.createUser({ first_name: "Bob" });

        const msg = await user.sendMessage("/menu");
        await user.click("opt_a", msg);

        const editCall = env.apiCalls.find(
            (c) => c.method === "editMessageText"
        );
        expect(editCall?.params.text).toBe("You chose A!");
    });
});

// 3. Group join/leave test
describe("Group events", () => {
    it("should track members", async () => {
        const bot = new Bot("test");
        bot.on("chat_member", (ctx) => {
            // handle member updates
        });

        const env = new TelegramTestEnvironment(bot);
        const user = env.createUser({ first_name: "Charlie" });
        const group = env.createChat({ type: "group", title: "Test Group" });

        await user.join(group);
        expect(group.members.has(user)).toBe(true);

        await user.leave(group);
        expect(group.members.has(user)).toBe(false);
    });
});

// 4. Mocking API responses and simulating errors
describe("Error handling", () => {
    it("should handle blocked user", async () => {
        const bot = new Bot("test");
        bot.command("notify", async (ctx) => {
            try {
                await ctx.send("Notification!");
            } catch (error) {
                // Bot was blocked
            }
        });

        const env = new TelegramTestEnvironment(bot);
        env.onApi(
            "sendMessage",
            apiError(403, "Forbidden: bot was blocked by the user")
        );

        const user = env.createUser({ first_name: "Dave" });
        await user.sendMessage("/notify");

        expect(env.apiCalls[0].response.ok).toBe(false);
    });
});
