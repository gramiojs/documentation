import { describe, expect, it } from "bun:test";
import { TelegramTestEnvironment } from "@gramio/test";
import { bot } from "../../skills/examples/scene-builder";

describe("examples/scene-builder.ts", () => {
    const env = new TelegramTestEnvironment(bot);

    it("builder steps: /checkout → ask name → confirm → exit", async () => {
        const user = env.createUser({ first_name: "Alice", id: 2001 });
        env.clearApiCalls();

        // /checkout enters the scene; the "ask-name" step's .message fires on entry
        await user.sendCommand("checkout");
        expect(String(env.lastApiCall("sendMessage")?.params.text)).toBe(
            "What's your name?",
        );

        // Sending the name advances to the "confirm" step, whose .enter renders
        env.clearApiCalls();
        await user.sendMessage("Alice");
        expect(String(env.lastApiCall("sendMessage")?.params.text)).toContain(
            "Alice, confirm?",
        );

        // "yes" matches .hears and exits the scene
        env.clearApiCalls();
        await user.sendMessage("yes");

        // After exit, a further message is no longer handled by the scene
        env.clearApiCalls();
        await user.sendMessage("anything");
        const after = env.lastApiCall("sendMessage");
        expect(
            after === undefined ||
                !String(after.params.text).includes("Please answer"),
        ).toBe(true);
    });

    it("fallback fires on an unmatched answer at the confirm step", async () => {
        const user = env.createUser({ first_name: "Bob", id: 2002 });
        env.clearApiCalls();

        await user.sendCommand("checkout");
        await user.sendMessage("Bob"); // advance to confirm

        env.clearApiCalls();
        await user.sendMessage("maybe"); // not "yes" → fallback
        expect(String(env.lastApiCall("sendMessage")?.params.text)).toContain(
            "Please answer yes or no",
        );
    });
});
