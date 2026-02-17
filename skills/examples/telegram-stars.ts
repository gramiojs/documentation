import { Bot, InlineKeyboard } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

// Create an invoice for digital goods
bot.command("buy", async (context) => {
    await context.bot.api.sendInvoice({
        chat_id: context.chat.id,
        title: "Premium Subscription",
        description: "1 month of premium features",
        payload: "sub_premium_1month",
        currency: "XTR",
        prices: [{ label: "1 Month Premium", amount: 500 }], // 500 Stars
    });
});

// Inline keyboard with pay button
bot.command("shop", (context) => {
    const keyboard = new InlineKeyboard().pay("Buy for 100 ⭐");

    return context.bot.api.sendInvoice({
        chat_id: context.chat.id,
        title: "VIP Badge",
        description: "Stand out with a VIP badge",
        payload: "badge_vip",
        currency: "XTR",
        prices: [{ label: "VIP Badge", amount: 100 }],
        reply_markup: keyboard,
    });
});

// Handle pre-checkout query (must answer within 10 seconds)
bot.on("pre_checkout_query", (context) => {
    // Validate the purchase — check inventory, user eligibility, etc.
    return context.answer(true);

    // To reject:
    // return context.answer(false, { error_message: "Item out of stock" });
});

// Handle successful payment
bot.on("message", (context) => {
    if (context.successful_payment) {
        const payment = context.successful_payment;
        return context.send(
            `Payment received! Amount: ${payment.total_amount} Stars\nPayload: ${payment.invoice_payload}`
        );
    }
});

// Create a shareable payment link
bot.command("paylink", async (context) => {
    const link = await context.bot.api.createInvoiceLink({
        title: "Donation",
        description: "Support the bot",
        payload: "donation",
        currency: "XTR",
        prices: [{ label: "Donation", amount: 50 }],
    });
    return context.send(`Payment link: ${link}`);
});

// Refund a payment
bot.command("refund", async (context) => {
    await context.bot.api.refundStarPayment({
        user_id: context.from!.id,
        telegram_payment_charge_id: "charge_id_here",
    });
    return context.send("Refund processed!");
});

bot.start();
