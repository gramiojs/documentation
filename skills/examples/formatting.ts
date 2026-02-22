import {
	blockquote,
	bold,
	code,
	expandableBlockquote,
	format,
	italic,
	join,
	link,
	mention,
	pre,
	spoiler,
	strikethrough,
	underline,
} from "@gramio/format";
import { Bot } from "gramio";

// IMPORTANT: Never set parse_mode when using @gramio/format.
// format`` produces MessageEntity arrays, not HTML/MarkdownV2 strings.
// GramIO automatically passes entities — parse_mode will break the message.

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("format", (context) => {
	return context.send(
		// No parse_mode here or anywhere else when using format``
		format`Welcome to ${bold("GramIO")}!

${italic("This")} is a ${underline("formatted")} message with ${strikethrough("old text")} and ${spoiler("hidden content")}.

Here's some ${code("inline code")} and a code block:
${pre("const bot = new Bot(token);", "typescript")}

${link("Visit GramIO", "https://gramio.dev")}

${blockquote("This is a blockquote\nWith multiple lines")}

${expandableBlockquote("This is expandable\nClick to expand this long content")}
`,
	);
});

// ✅ Composing format templates as variables
// format`` returns a Formattable object, NOT a plain string.
// Always wrap styled content in format`` to preserve entities when reusing.
const header = format`${bold`GramIO Bot`} — ${italic`Telegram framework`}`;
const footer = format`${link("Docs", "https://gramio.dev")} | ${link("GitHub", "https://github.com/gramiojs/gramio")}`;

bot.command("about", (context) => {
	// Embedding Formattable variables in format`` correctly re-offsets all entities
	return context.send(
		format`${header}

Built with TypeScript. Type /help for commands.

${footer}`,
	);
});

// ❌ WRONG — never do this:
// const broken = `${bold`text`} something`; // bold is stripped to plain text
// const broken2 = `${header} extra`;         // all entities in header are lost
//
// ✅ Always use format``:
// const correct = format`${bold`text`} something`;
// const correct2 = format`${header} extra`;

// ✅ Join helper for formatting arrays
// NEVER use native .join() with entity functions — it calls .toString() on
// each Formattable, destroying ALL entity data (bold, italic, etc. are lost).
bot.command("list", (context) => {
	const items = ["TypeScript", "Bun", "Node.js", "Deno"];

	// ❌ WRONG: items.map((x) => bold(x)).join("\n") — entities are destroyed
	// ✅ Correct: use the join helper
	return context.send(
		format`Supported runtimes:
${join(items, (item) => bold(item), "\n")}`,
	);
});

// Mention a user without username
bot.on("message", (context) => {
	if (context.from) {
		return context.send(
			format`Hello, ${mention(context.from.firstName, context.from.payload)}!`,
		);
	}
});

bot.start();
