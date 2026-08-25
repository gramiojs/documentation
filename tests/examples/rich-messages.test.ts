import { describe, expect, it } from "bun:test";
import { TelegramTestEnvironment } from "@gramio/test";
import { bot } from "../../skills/examples/rich-messages.ts";

describe("rich messages skill example", () => {
    it("sends the 10.3 blocks and handles a stopped draft", async () => {
        const env = new TelegramTestEnvironment(bot);
        const user = env.createUser();

        await user.sendCommand("report");

        const richCall = env.lastApiCall("sendRichMessage");
        const markdown =
            (richCall?.params.rich_message as { markdown?: string } | undefined)
                ?.markdown;

        expect(markdown).toContain("<table compact>");
        expect(markdown).toContain(
            '<tg-document src="https://example.com/report.pdf"></tg-document>',
        );
        expect(markdown).toContain("<figcaption>Full report</figcaption>");
        expect(markdown).toContain('<tg-button type="disabled">Soon</tg-button>');

        await user.stopMessageGeneration(77);
        expect(env.lastApiCall("sendMessage")?.params.text).toBe(
            "Generation stopped for draft 77.",
        );
    });
});
