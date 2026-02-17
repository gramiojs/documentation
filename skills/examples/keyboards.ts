import { Bot, InlineKeyboard, Keyboard } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

// Reply keyboard with layout helpers
bot.command("menu", (context) => {
    const keyboard = new Keyboard()
        .text("Profile").text("Settings").row()
        .text("Help").text("About")
        .resized()
        .oneTime()
        .placeholder("Choose an option");

    return context.send("Main menu:", { reply_markup: keyboard });
});

// Inline keyboard with various button types
bot.command("actions", (context) => {
    const inline = new InlineKeyboard()
        .text("Like 👍", "like")
        .text("Dislike 👎", "dislike")
        .row()
        .url("Visit site", "https://gramio.dev")
        .row()
        .switchToChat("Share bot", "Check out this bot!")
        .row()
        .webApp("Open App", "https://example.com/app");

    return context.send("Choose an action:", { reply_markup: inline });
});

// Columns layout — auto-wraps after N buttons per row
bot.command("grid", (context) => {
    const items = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    const keyboard = new InlineKeyboard()
        .columns(3);

    for (const item of items) {
        keyboard.text(item, `select_${item}`);
    }

    return context.send("Grid layout:", { reply_markup: keyboard });
});

// Conditional buttons with .addIf()
bot.command("conditional", (context) => {
    const isAdmin = true;
    const keyboard = new InlineKeyboard()
        .text("Public action", "public")
        .addIf(isAdmin, InlineKeyboard.text("Admin only", "admin"))
        .row()
        .text("Cancel", "cancel");

    return context.send("Actions:", { reply_markup: keyboard });
});

// Request user info buttons
bot.command("request", (context) => {
    const keyboard = new Keyboard()
        .requestContact("Share contact")
        .requestLocation("Share location")
        .row()
        .requestPoll("Create poll", "quiz")
        .resized();

    return context.send("Share something:", { reply_markup: keyboard });
});

bot.start();
