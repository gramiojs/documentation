import { describe, expect, it } from "bun:test";
import { TelegramTestEnvironment } from "@gramio/test";
import { bot } from "../../skills/examples/basic";

describe("examples/basic.ts", () => {
    const env = new TelegramTestEnvironment(bot);
    const user = env.createUser({ first_name: "Alice" });

    it("/start replies with greeting", async () => {
        env.clearApiCalls();
        await user.sendCommand("start");
        const sent = env.lastApiCall("sendMessage");
        expect(sent?.params.text).toBe("Hello! I'm powered by GramIO.");
    });

    it("/help lists available commands", async () => {
        env.clearApiCalls();
        await user.sendCommand("help");
        const sent = env.lastApiCall("sendMessage");
        expect(sent?.params.text).toContain("/start");
        expect(sent?.params.text).toContain("/help");
    });
});
