import { describe, expect, it } from "bun:test";
import { TelegramTestEnvironment } from "@gramio/test";
import { bot, nav, toggle } from "../../skills/examples/ux-menu";
import { flatInline } from "../helpers";

type FlatBtn = Record<string, unknown>;

describe("examples/ux-menu.ts", () => {
    const env = new TelegramTestEnvironment(bot);

    it("/start sends the hero with Settings / Stats / Help buttons", async () => {
        const user = env.createUser({ first_name: "Alice", id: 7001 });
        env.clearApiCalls();
        await user.sendCommand("start");
        const sent = env.lastApiCall("sendMessage");
        expect(String(sent?.params.text)).toContain("GramIO Demo Bot");
        const flat = flatInline(sent?.params.reply_markup) as FlatBtn[];
        const datas = flat.map((b) => b.callback_data);
        expect(datas).toContain(nav.pack({ to: "settings" }));
        expect(datas).toContain(nav.pack({ to: "stats" }));
        expect(datas).toContain(nav.pack({ to: "help" }));
    });

    it("Settings → edits the message in place (no extra sendMessage)", async () => {
        const user = env.createUser({ first_name: "Bob", id: 7002 });
        env.clearApiCalls();
        const menu = await user.sendCommand("start");
        await user.click(nav.pack({ to: "settings" }), menu);
        const edit = env.lastApiCall("editMessageText");
        expect(String(edit?.params.text)).toContain("Settings");
        // Only the initial hero was sent — navigation must edit, not send.
        expect(env.filterApiCalls("sendMessage").length).toBe(1);
    });

    it("Toggle flips notifications and shows ✅/⬜ in the re-rendered keyboard", async () => {
        const user = env.createUser({ first_name: "Carol", id: 7003 });
        env.clearApiCalls();
        const menu = await user.sendCommand("start");
        await user.click(nav.pack({ to: "settings" }), menu);

        const flatBefore = flatInline(
            env.lastApiCall("editMessageText")?.params.reply_markup
        ) as FlatBtn[];
        const notifBtnBefore = flatBefore.find(
            (b) => b.callback_data === toggle.pack({ key: "notifications" })
        );
        expect(String(notifBtnBefore?.text)).toMatch(/^✅ /);

        env.clearApiCalls();
        await user.click(toggle.pack({ key: "notifications" }), menu);

        const answer = env.lastApiCall("answerCallbackQuery");
        expect(answer?.params.text).toBe("Notifications: OFF");

        const flatAfter = flatInline(
            env.lastApiCall("editMessageText")?.params.reply_markup
        ) as FlatBtn[];
        const notifBtnAfter = flatAfter.find(
            (b) => b.callback_data === toggle.pack({ key: "notifications" })
        );
        expect(String(notifBtnAfter?.text)).toMatch(/^⬜ /);
    });

    it("Delete goes through a confirm step before actually deleting", async () => {
        const user = env.createUser({ first_name: "Dana", id: 7004 });
        env.clearApiCalls();
        const menu = await user.sendCommand("start");
        await user.click(nav.pack({ to: "settings" }), menu);
        await user.click(nav.pack({ to: "account.confirmDelete" }), menu);

        const confirm = env.lastApiCall("editMessageText");
        expect(String(confirm?.params.text)).toContain("Delete your account?");
        const flat = flatInline(confirm?.params.reply_markup) as FlatBtn[];
        expect(flat.map((b) => b.callback_data)).toEqual(
            expect.arrayContaining([
                nav.pack({ to: "settings" }),
                nav.pack({ to: "account.doDelete" }),
            ])
        );

        await user.click(nav.pack({ to: "account.doDelete" }), menu);
        const done = env.lastApiCall("editMessageText");
        expect(String(done?.params.text)).toContain("Account deleted");
    });

    it("every nav callback is answered (spinner always stops)", async () => {
        const user = env.createUser({ first_name: "Eve", id: 7005 });
        env.clearApiCalls();
        const menu = await user.sendCommand("start");
        await user.click(nav.pack({ to: "help" }), menu);
        expect(env.lastApiCall("answerCallbackQuery")).toBeDefined();
    });
});
