import { describe, expect, it } from "bun:test";
import { TelegramTestEnvironment } from "@gramio/test";
import { bot } from "../../skills/examples/keyboards";
import { asInlineKeyboard, asReplyKeyboard, flatInline } from "../helpers";

describe("examples/keyboards.ts", () => {
    const env = new TelegramTestEnvironment(bot);
    const user = env.createUser({ first_name: "Alice" });

    it("/menu sends a reply keyboard", async () => {
        env.clearApiCalls();
        await user.sendCommand("menu");
        const call = env.lastApiCall("sendMessage");
        expect(call?.params.text).toBe("Main menu:");
        const markup = asReplyKeyboard(call?.params.reply_markup);
        expect(markup.keyboard.length).toBeGreaterThan(0);
        expect(markup.resize_keyboard).toBe(true);
        expect(markup.one_time_keyboard).toBe(true);
        expect(markup.input_field_placeholder).toBe("Choose an option");
    });

    it("/actions sends an inline keyboard with url + callback buttons", async () => {
        env.clearApiCalls();
        await user.sendCommand("actions");
        const call = env.lastApiCall("sendMessage");
        const flat = flatInline(call?.params.reply_markup) as Array<Record<string, unknown>>;
        expect(flat.some((b) => b.callback_data === "like")).toBe(true);
        expect(flat.some((b) => b.url === "https://gramio.dev")).toBe(true);
    });

    it("/grid lays out 9 buttons in 3 columns", async () => {
        env.clearApiCalls();
        await user.sendCommand("grid");
        const call = env.lastApiCall("sendMessage");
        const markup = asInlineKeyboard(call?.params.reply_markup);
        expect(markup.inline_keyboard.length).toBe(3);
        expect(markup.inline_keyboard[0].length).toBe(3);
    });

    it("/conditional includes the admin button when isAdmin is true", async () => {
        env.clearApiCalls();
        await user.sendCommand("conditional");
        const call = env.lastApiCall("sendMessage");
        const flat = flatInline(call?.params.reply_markup) as Array<Record<string, unknown>>;
        expect(flat.some((b) => b.callback_data === "admin")).toBe(true);
    });
});
