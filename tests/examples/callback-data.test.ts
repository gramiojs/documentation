import { describe, expect, it } from "bun:test";
import { TelegramTestEnvironment } from "@gramio/test";
import { bot, selectItem } from "../../skills/examples/callback-data";
import { asInlineKeyboard } from "../helpers";

describe("examples/callback-data.ts", () => {
    const env = new TelegramTestEnvironment(bot);
    const user = env.createUser({ first_name: "Alice" });

    it("/shop sends a message with packed callback buttons", async () => {
        env.clearApiCalls();
        const msg = await user.sendCommand("shop");
        const sent = env.lastApiCall("sendMessage");
        expect(sent?.params.text).toBe("Shop:");
        const markup = asInlineKeyboard(sent?.params.reply_markup);
        const first = markup.inline_keyboard[0][0] as { callback_data: string };
        expect(first.callback_data).toBe(selectItem.pack({ id: 1, action: "buy" }));
        expect(msg).toBeDefined();
    });

    it("buy callback answers with notification text", async () => {
        env.clearApiCalls();
        const msg = await user.sendCommand("shop");
        await user.click(selectItem.pack({ id: 1, action: "buy" }), msg);
        const answer = env.lastApiCall("answerCallbackQuery");
        expect(answer?.params.text).toBe("Buying item #1!");
        expect(answer?.params.show_alert).toBeFalsy();
    });

    it("info callback answers with show_alert=true", async () => {
        env.clearApiCalls();
        const msg = await user.sendCommand("shop");
        await user.click(selectItem.pack({ id: 2, action: "info" }), msg);
        const answer = env.lastApiCall("answerCallbackQuery");
        expect(answer?.params.text).toBe("Item #2: Premium widget");
        expect(answer?.params.show_alert).toBe(true);
    });

    it("regex callback delete_42 captures the id", async () => {
        env.clearApiCalls();
        const msg = await user.sendCommand("shop");
        await user.click("delete_42", msg);
        const answer = env.lastApiCall("answerCallbackQuery");
        expect(answer?.params.text).toBe("Deleting item 42");
    });

    it("plain-string callback cancel answers with 'Cancelled!'", async () => {
        env.clearApiCalls();
        const msg = await user.sendCommand("shop");
        await user.click("cancel", msg);
        const answer = env.lastApiCall("answerCallbackQuery");
        expect(answer?.params.text).toBe("Cancelled!");
    });
});
