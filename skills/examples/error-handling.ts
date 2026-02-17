import { Bot } from "gramio";

// Custom error class
class NoRightsError extends Error {
    permission: string;
    constructor(permission: string) {
        super(`Missing permission: ${permission}`);
        this.permission = permission;
    }
}

const bot = new Bot(process.env.BOT_TOKEN as string)
    // Register custom error type
    .error("NO_RIGHTS", NoRightsError)

    // Global error handler
    .onError(({ context, kind, error }) => {
        if (kind === "NO_RIGHTS") {
            // error is typed as NoRightsError
            console.log("Missing permission:", error.permission);
        }
        if (kind === "TELEGRAM") {
            // Telegram API error with method and params
            console.log("API method:", error.method);
            console.log("API params:", error.params);
        }
    })

    // Scoped error handler — only for message contexts
    .onError("message", ({ context, kind, error }) => {
        if (context.is("message")) {
            return context.send(`Error: ${error.message}`);
        }
    })

    .command("admin", (context) => {
        // Throw custom typed error
        throw new NoRightsError("admin_panel");
    });

// Using suppress for inline error handling (no try/catch)
bot.command("safe_api", async (context) => {
    const result = await context.bot.api.sendMessage({
        chat_id: context.chat.id,
        text: "test",
        suppress: true, // Returns error instead of throwing
    });

    if (result instanceof Error) {
        return context.send(`API call failed: ${result.message}`);
    }
    return context.send(`Sent message ${result.message_id}`);
});

bot.start();
