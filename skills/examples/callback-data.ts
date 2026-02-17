import { Bot, CallbackData, InlineKeyboard } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

// Type-safe callback data with schema
const selectItem = new CallbackData("item")
    .number("id")
    .string("action");

bot.command("shop", (context) => {
    const keyboard = new InlineKeyboard()
        .text("Buy Item #1", selectItem.pack({ id: 1, action: "buy" }))
        .text("Info Item #1", selectItem.pack({ id: 1, action: "info" }))
        .row()
        .text("Buy Item #2", selectItem.pack({ id: 2, action: "buy" }))
        .text("Info Item #2", selectItem.pack({ id: 2, action: "info" }));

    return context.send("Shop:", { reply_markup: keyboard });
});

// Handle with type-safe deserialized data
bot.callbackQuery(selectItem, (context) => {
    // context.queryData is typed: { id: number, action: string }
    const { id, action } = context.queryData;

    if (action === "buy") {
        return context.answer(`Buying item #${id}!`);
    }
    return context.answer(`Item #${id}: Premium widget`, { show_alert: true });
});

// Simple string callback
bot.callbackQuery("cancel", (context) => {
    return context.answer("Cancelled!");
});

// RegExp callback
bot.callbackQuery(/^delete_(\d+)$/, (context) => {
    return context.answer(`Deleting item ${context.data}`);
});

bot.start();
