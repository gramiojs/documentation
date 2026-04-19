import { describe, expect, it } from "bun:test";
import { TelegramTestEnvironment } from "@gramio/test";
import { bot, NoRightsError } from "../../skills/examples/error-handling";

describe("examples/error-handling.ts", () => {
    const env = new TelegramTestEnvironment(bot);
    const user = env.createUser({ first_name: "Alice", id: 5001 });

    it("custom error class carries permission metadata", () => {
        const err = new NoRightsError("admin_panel");
        expect(err.permission).toBe("admin_panel");
        expect(err.message).toContain("admin_panel");
    });

    it("/admin throws NoRightsError → scoped message onError replies with error text", async () => {
        env.clearApiCalls();
        await user.sendCommand("admin");
        const replies = env.filterApiCalls("sendMessage");
        expect(replies.some((c) => String(c.params.text).includes("admin_panel"))).toBe(true);
    });
});
