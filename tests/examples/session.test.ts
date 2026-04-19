import { describe, expect, it } from "bun:test";
import { TelegramTestEnvironment } from "@gramio/test";
import { bot } from "../../skills/examples/session";

describe("examples/session.ts", () => {
    const env = new TelegramTestEnvironment(bot);
    const user = env.createUser({ first_name: "Alice", id: 3001 });

    it("/count increments per user", async () => {
        env.clearApiCalls();
        await user.sendCommand("count");
        expect(env.lastApiCall("sendMessage")?.params.text).toBe("Count: 1");

        env.clearApiCalls();
        await user.sendCommand("count");
        expect(env.lastApiCall("sendMessage")?.params.text).toBe("Count: 2");

        env.clearApiCalls();
        await user.sendCommand("count");
        expect(env.lastApiCall("sendMessage")?.params.text).toBe("Count: 3");
    });

    it("/settings shows defaults and /toggle flips notifications", async () => {
        const fresh = env.createUser({ first_name: "Zoe", id: 3099 });

        await fresh.sendCommand("settings");
        expect(String(env.lastApiCall("sendMessage")?.params.text))
            .toContain("Language: en");
        expect(String(env.lastApiCall("sendMessage")?.params.text))
            .toContain("Notifications: true");

        env.clearApiCalls();
        await fresh.sendCommand("toggle");
        expect(env.lastApiCall("sendMessage")?.params.text).toBe("Notifications: OFF");

        env.clearApiCalls();
        await fresh.sendCommand("toggle");
        expect(env.lastApiCall("sendMessage")?.params.text).toBe("Notifications: ON");
    });

    it("sessions are isolated between users", async () => {
        const alice = env.createUser({ first_name: "Alice", id: 3010 });
        const bob = env.createUser({ first_name: "Bob", id: 3011 });

        env.clearApiCalls();
        await alice.sendCommand("count");
        await alice.sendCommand("count");
        await bob.sendCommand("count");

        const calls = env.filterApiCalls("sendMessage").map((c) => c.params.text);
        expect(calls).toEqual(["Count: 1", "Count: 2", "Count: 1"]);
    });
});
