import { describe, expect, it } from "bun:test";
import { TelegramTestEnvironment } from "@gramio/test";
import { bot, stats } from "../../skills/examples/scene-composer-inheritance/index";

describe("examples/scene-composer-inheritance", () => {
    const env = new TelegramTestEnvironment(bot);

    it("flows ctx.t from baseComposer into onEnter + scene steps", async () => {
        const user = env.createUser({ first_name: "Alice", id: 3001 });
        const before = stats.deriveRuns;

        env.clearApiCalls();
        await user.sendCommand("start");
        const startTexts = env.filterApiCalls("sendMessage").map((c) => String(c.params.text));
        expect(startTexts).toEqual(expect.arrayContaining(["WELCOME", "PROMPT"]));

        env.clearApiCalls();
        await user.sendMessage("advance");
        const doneTexts = env.filterApiCalls("sendMessage").map((c) => String(c.params.text));
        expect(doneTexts).toContain("DONE");

        // Dedup: baseComposer is extended on both bot AND scene, yet the
        // derive runs exactly once per update. (@gramio/scenes 0.7.0 briefly
        // ran an onEnter-consumed derive twice on the entry update; 0.7.1 fixed
        // it — see fix(runtime): run onEnter-consumed derives exactly once.)
        // So /start (entry) and the follow-up "advance" message → 2 total.
        expect(stats.deriveRuns - before).toBe(2);
    });

    it("ctx.t is also visible at bot level", async () => {
        const user = env.createUser({ first_name: "Bob", id: 3002 });
        env.clearApiCalls();
        await user.sendCommand("ping");
        const last = env.lastApiCall("sendMessage");
        expect(String(last?.params.text)).toBe("PONG");
    });
});
