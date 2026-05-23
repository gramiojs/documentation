import { describe, expect, it } from "bun:test";
import { TelegramTestEnvironment } from "@gramio/test";
import { bot } from "../../skills/examples/deep-links";

describe("examples/deep-links.ts — /start payload routing", () => {
    const env = new TelegramTestEnvironment(bot);
    const user = env.createUser({ first_name: "Alice", id: 7001 });

    it("/start with no payload → bare welcome (cold-open path)", async () => {
        env.clearApiCalls();
        await user.sendCommand("start");
        const sent = env.lastApiCall("sendMessage");
        expect(sent?.params.text).toBe("Welcome!");
    });

    it("/start ref_42 → referral handler picks up the id", async () => {
        env.clearApiCalls();
        await user.sendCommand("start", "ref_42");
        const sent = env.lastApiCall("sendMessage");
        expect(sent?.params.text).toBe("Welcome! You were invited by user 42.");
    });

    it("/start order_987 → order jump", async () => {
        env.clearApiCalls();
        await user.sendCommand("start", "order_987");
        const sent = env.lastApiCall("sendMessage");
        expect(sent?.params.text).toBe("Opening order #987…");
    });

    it("/start login-inline → auth flow (matches inline-mode redirect button)", async () => {
        env.clearApiCalls();
        await user.sendCommand("start", "login-inline");
        const sent = env.lastApiCall("sendMessage");
        expect(sent?.params.text).toBe("Let's get you logged in.");
    });

    it("/start tok_<base64url-json> → token exchange decodes claims", async () => {
        env.clearApiCalls();
        const claims = JSON.stringify({ u: 1, t: "abc" });
        const token = Buffer.from(claims, "utf8").toString("base64url");
        await user.sendCommand("start", `tok_${token}`);
        const sent = env.lastApiCall("sendMessage");
        expect(sent?.params.text).toBe("Linked account for user 1.");
    });

    it("/start tok_<garbage> → graceful error, no crash", async () => {
        env.clearApiCalls();
        await user.sendCommand("start", "tok_not-real-base64url-json");
        const sent = env.lastApiCall("sendMessage");
        expect(sent?.params.text).toBe(
            "That login link looks invalid or expired. Try again."
        );
    });

    it("unknown payload → graceful welcome, never echo raw payload", async () => {
        env.clearApiCalls();
        await user.sendCommand("start", "weird_unknown_thing_xyz");
        const sent = env.lastApiCall("sendMessage");
        expect(sent?.params.text).toBe(
            "Welcome! Couldn't recognise that link, but you're in."
        );
        // Defence: we MUST NOT leak the raw payload back to the user.
        expect(sent?.params.text).not.toContain("weird_unknown_thing_xyz");
    });
});
