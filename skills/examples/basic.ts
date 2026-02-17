import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (context) =>
        context.send("Hello! I'm powered by GramIO.")
    )
    .command("help", (context) =>
        context.send("Available commands:\n/start - Start the bot\n/help - Show help")
    )
    .onStart(({ info, plugins, updatesFrom }) => {
        console.log(`Bot @${info.username} started via ${updatesFrom}`);
        console.log("Loaded plugins:", plugins);
    })
    .onError(({ context, kind, error }) => {
        console.error(`[${kind}]`, error);
    });

bot.start();
