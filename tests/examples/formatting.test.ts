import { describe, expect, it } from "bun:test";
import { TelegramTestEnvironment } from "@gramio/test";
import { FormattableString } from "gramio";
import { bot } from "../../skills/examples/formatting";

function entitiesOf(text: unknown): Array<{ type: string }> {
    if (text instanceof FormattableString) return text.entities;
    return [];
}

describe("examples/formatting.ts", () => {
    const env = new TelegramTestEnvironment(bot);
    const user = env.createUser({ first_name: "Alice", id: 4001 });

    it("/format emits a FormattableString with entities (not parse_mode)", async () => {
        env.clearApiCalls();
        await user.sendCommand("format");
        const call = env.lastApiCall("sendMessage");
        // GramIO passes entities through, never parse_mode
        expect(call?.params.parse_mode).toBeUndefined();
        const text = call?.params.text;
        expect(text).toBeInstanceOf(FormattableString);
        const types = new Set(entitiesOf(text).map((e) => e.type));
        expect(types.has("bold")).toBe(true);
        expect(types.has("italic")).toBe(true);
        expect(types.has("code")).toBe(true);
        expect(types.has("text_link")).toBe(true);
    });

    it("/about composes header + footer via format`` without losing entities", async () => {
        env.clearApiCalls();
        await user.sendCommand("about");
        const call = env.lastApiCall("sendMessage");
        const entities = entitiesOf(call?.params.text);
        expect(entities.some((e) => e.type === "bold")).toBe(true);
        expect(entities.filter((e) => e.type === "text_link").length).toBeGreaterThanOrEqual(2);
    });

    it("/list uses join helper to preserve bold per item", async () => {
        env.clearApiCalls();
        await user.sendCommand("list");
        const call = env.lastApiCall("sendMessage");
        const entities = entitiesOf(call?.params.text);
        const boldCount = entities.filter((e) => e.type === "bold").length;
        expect(boldCount).toBe(4);
    });
});
