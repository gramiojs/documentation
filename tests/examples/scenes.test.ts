import { describe, expect, it } from "bun:test";
import { TelegramTestEnvironment } from "@gramio/test";
import { bot } from "../../skills/examples/scenes";

describe("examples/scenes.ts (registration wizard)", () => {
    const env = new TelegramTestEnvironment(bot);
    const user = env.createUser({ first_name: "Alice", id: 2001 });

    it("/register → name prompt → age prompt → confirm prompt → yes → done", async () => {
        env.clearApiCalls();
        await user.sendCommand("register");
        // onEnter + first .ask prompt
        const calls = env.filterApiCalls("sendMessage");
        const texts = calls.map((c) => String(c.params.text));
        expect(texts).toEqual(
            expect.arrayContaining([
                "Let's register you.",
                "What is your name?",
            ])
        );

        env.clearApiCalls();
        await user.sendMessage("Alice");
        const agePrompt = env.lastApiCall("sendMessage");
        expect(String(agePrompt?.params.text)).toBe("How old are you?");

        env.clearApiCalls();
        await user.sendMessage("30");
        const confirm = env.lastApiCall("sendMessage");
        expect(String(confirm?.params.text)).toContain("Name: Alice");
        expect(String(confirm?.params.text)).toContain("Age: 30");

        env.clearApiCalls();
        await user.sendMessage("yes");
        const done = env.lastApiCall("sendMessage");
        expect(String(done?.params.text)).toBe("Registration complete!");
    });

    it("/cancel exits the scene", async () => {
        const user2 = env.createUser({ first_name: "Bob", id: 2002 });
        await user2.sendCommand("register");

        env.clearApiCalls();
        await user2.sendCommand("cancel");
        // After cancel, sending a random message should NOT be consumed by the scene
        await user2.sendMessage("random");
        const texts = env.filterApiCalls("sendMessage").map((c) => String(c.params.text));
        expect(texts).not.toContain("What is your name?");
    });
});
