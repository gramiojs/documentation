import { describe, expect, it } from "bun:test";
import { TelegramTestEnvironment } from "@gramio/test";
import { bot, nav, orderPick } from "../../skills/examples/wizard-scene";
import { flatInline } from "../helpers";

describe("examples/wizard-scene.ts", () => {
    const env = new TelegramTestEnvironment(bot);

    it("full order flow: menu → order → pick site → send address → done", async () => {
        const user = env.createUser({ first_name: "Alice", id: 1001 });
        env.clearApiCalls();

        // /start sends the main menu
        const menu = await user.sendCommand("start");
        const menuCall = env.lastApiCall("sendMessage");
        expect(menuCall?.params.text).toBe("Menu");
        const menuBtns = flatInline(menuCall?.params.reply_markup) as Array<Record<string, string>>;
        expect(menuBtns.some((b) => b.callback_data === nav.pack({ to: "order" }))).toBe(true);

        // Click "order" — enters orderScene, onEnter sends site picker
        env.clearApiCalls();
        await user.click(nav.pack({ to: "order" }), menu);
        const picker = env.lastApiCall("sendMessage");
        expect(String(picker?.params.text)).toContain("Pick a site:");
        const siteBtns = flatInline(picker?.params.reply_markup) as Array<Record<string, string>>;
        expect(siteBtns.map((b) => b.callback_data)).toEqual(
            expect.arrayContaining([
                orderPick.pack({ site: "example.com" }),
                orderPick.pack({ site: "test.org" }),
            ])
        );

        // Pick a site — editText + answer, then advance to message step
        env.clearApiCalls();
        await user.click(orderPick.pack({ site: "example.com" }), menu);
        const edit = env.lastApiCall("editMessageText");
        expect(String(edit?.params.text)).toContain("Site: example.com");
        expect(String(edit?.params.text)).toContain("send the address");

        // Send the address — scene collects, confirms, exits
        env.clearApiCalls();
        await user.sendMessage("221B Baker Street");
        const confirm = env.lastApiCall("sendMessage");
        expect(String(confirm?.params.text)).toContain("Ordered example.com");
        expect(String(confirm?.params.text)).toContain("221B Baker Street");
    });

    it("global nav exits an in-progress scene", async () => {
        const user2 = env.createUser({ first_name: "Bob", id: 1002 });
        env.clearApiCalls();
        const menu = await user2.sendCommand("start");

        // Enter order scene
        await user2.click(nav.pack({ to: "order" }), menu);

        // Before completing, press "home" — should exit scene and edit to home
        env.clearApiCalls();
        await user2.click(nav.pack({ to: "home" }), menu);
        const edit = env.lastApiCall("editMessageText");
        expect(edit?.params.text).toBe("Home screen");

        // Subsequent message should NOT be treated as address step
        env.clearApiCalls();
        await user2.sendMessage("some random message");
        const after = env.lastApiCall("sendMessage");
        expect(after === undefined || !String(after.params.text).includes("Ordered")).toBe(true);
    });
});
