import { describe, expect, it } from "bun:test";
import { TelegramTestEnvironment } from "@gramio/test";
import { bot, nav } from "../../skills/examples/callback-routing";
import { flatInline } from "../helpers";

describe("examples/callback-routing.ts", () => {
    const env = new TelegramTestEnvironment(bot);
    const user = env.createUser({ first_name: "Alice", id: 999 });

    it("/start sends the menu with three nav buttons", async () => {
        env.clearApiCalls();
        await user.sendCommand("start");
        const sent = env.lastApiCall("sendMessage");
        expect(sent?.params.text).toBe("Menu");
        const flat = flatInline(sent?.params.reply_markup) as Array<Record<string, unknown>>;
        expect(flat.map((b) => b.callback_data)).toEqual(
            expect.arrayContaining([
                nav.pack({ to: "history" }),
                nav.pack({ to: "settings" }),
                nav.pack({ to: "admin" }),
            ])
        );
    });

    it("history nav edits the message to '📜 History (empty)'", async () => {
        env.clearApiCalls();
        const menu = await user.sendCommand("start");
        await user.click(nav.pack({ to: "history" }), menu);
        const edit = env.lastApiCall("editMessageText");
        expect(edit?.params.text).toBe("📜 History (empty)");
    });

    it("admin nav for non-admin user answers 'Forbidden' with alert", async () => {
        env.clearApiCalls();
        const menu = await user.sendCommand("start");
        await user.click(nav.pack({ to: "admin" }), menu);
        const answer = env.lastApiCall("answerCallbackQuery");
        expect(answer?.params.text).toBe("Forbidden");
        expect(answer?.params.show_alert).toBe(true);
        expect(env.lastApiCall("editMessageText")).toBeUndefined();
    });

    it("settings nav edits the message to '🛠 Settings'", async () => {
        env.clearApiCalls();
        const menu = await user.sendCommand("start");
        await user.click(nav.pack({ to: "settings" }), menu);
        const edit = env.lastApiCall("editMessageText");
        expect(edit?.params.text).toBe("🛠 Settings");
    });
});
