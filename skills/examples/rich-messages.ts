import { Bot, bold, format } from "gramio";
import {
    button,
    buttonRow,
    document,
    heading,
    paragraph,
    quote,
    rich,
    table,
} from "gramio/rich";

export const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("report", (ctx) =>
    ctx.send(
        rich([
            heading(1, "Release report"),
            paragraph(format`Status: ${bold`ready`}`),
            quote("Expandable details", {
                expandable: true,
                credit: "Build bot",
            }),
            document({
                url: "https://example.com/report.pdf",
                caption: "Full report",
            }),
            table(
                [["Package", "Version"], ["gramio", "0.14.0"]],
                { compact: true, align: ["left", "right"] },
            ),
            buttonRow([
                button("Open docs", {
                    type: "url",
                    url: "https://gramio.dev/guides/rich-messages",
                }),
                button("Soon", { type: "disabled" }),
            ]),
        ]),
    ),
);

bot.on("stopped_message_generation", (ctx) =>
    ctx.send(`Generation stopped for draft ${ctx.draftId}.`),
);
