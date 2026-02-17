import { Bot } from "gramio";
import {
    format,
    bold,
    italic,
    underline,
    strikethrough,
    spoiler,
    code,
    pre,
    link,
    mention,
    blockquote,
    expandableBlockquote,
    join,
} from "@gramio/format";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("format", (context) => {
    return context.send(
        format`Welcome to ${bold("GramIO")}!

${italic("This")} is a ${underline("formatted")} message with ${strikethrough("old text")} and ${spoiler("hidden content")}.

Here's some ${code("inline code")} and a code block:
${pre("const bot = new Bot(token);", "typescript")}

${link("Visit GramIO", "https://gramio.dev")}

${blockquote("This is a blockquote\nWith multiple lines")}

${expandableBlockquote("This is expandable\nClick to expand this long content")}
`
    );
});

// Join helper for formatting arrays
bot.command("list", (context) => {
    const items = ["TypeScript", "Bun", "Node.js", "Deno"];

    return context.send(
        format`Supported runtimes:
${join(items, (item) => bold(item), "\n")}`
    );
});

// Mention a user without username
bot.on("message", (context) => {
    if (context.from) {
        return context.send(
            format`Hello, ${mention(context.from.first_name, context.from)}!`
        );
    }
});

bot.start();
