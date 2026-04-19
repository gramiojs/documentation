/**
 * Centralized callback routing across multiple feature views.
 *
 * Demonstrates the correct way to share a navigation CallbackData across
 * multiple "views" WITHOUT hitting the "first-registered wins" silent conflict
 * that happens when two plugins both register `.callbackQuery(nav, …)`.
 */
import { Bot, CallbackData, InlineKeyboard, type CallbackQueryShorthandContext } from "gramio";

// --- shared schema -------------------------------------------------------

// One schema, multiple destinations. Every view packs buttons with this.
const nav = new CallbackData("nav").enum("to", ["home", "history", "admin", "settings"]);

const bot = new Bot(process.env.BOT_TOKEN!);

// CallbackQueryShorthandContext is exactly what `.callbackQuery(nav, handler)`
// passes to its handler — `typeof bot` carries derives/decorates, `typeof nav`
// narrows ctx.queryData to the enum.
type NavCtx = CallbackQueryShorthandContext<typeof bot, typeof nav>;

// --- views expose RENDERERS, not handlers --------------------------------

// Rule: views do NOT call bot.callbackQuery(nav, …) on their own — the
// centralized router below owns routing. Each view exposes a small
// render*(ctx) function that the router invokes.

function renderHome(ctx: NavCtx) {
    const kb = new InlineKeyboard()
        .text("History", nav.pack({ to: "history" }))
        .text("Settings", nav.pack({ to: "settings" }));
    return ctx.editText("🏠 Home", { reply_markup: kb });
}

function renderHistory(ctx: NavCtx) {
    const kb = new InlineKeyboard().text("◀ Home", nav.pack({ to: "home" }));
    return ctx.editText("📜 History (empty)", { reply_markup: kb });
}

function renderAdmin(ctx: NavCtx) {
    if (!ctx.from || ctx.from.id !== 123456789) {
        return ctx.answer({ text: "Forbidden", show_alert: true });
    }
    const kb = new InlineKeyboard().text("◀ Home", nav.pack({ to: "home" }));
    return ctx.editText("⚙️ Admin", { reply_markup: kb });
}

function renderSettings(ctx: NavCtx) {
    const kb = new InlineKeyboard().text("◀ Home", nav.pack({ to: "home" }));
    return ctx.editText("🛠 Settings", { reply_markup: kb });
}

// --- centralized router ---------------------------------------------------

bot.command("start", (ctx) => {
    const kb = new InlineKeyboard()
        .text("History", nav.pack({ to: "history" }))
        .text("Settings", nav.pack({ to: "settings" }))
        .row()
        .text("Admin", nav.pack({ to: "admin" }));
    return ctx.send("Menu", { reply_markup: kb });
})
    // ONE place handles all nav clicks. Fan-out happens via switch().
    .callbackQuery(nav, async (ctx) => {
        await ctx.answer();
        switch (ctx.queryData.to) {
            case "home":     return renderHome(ctx);
            case "history":  return renderHistory(ctx);
            case "admin":    return renderAdmin(ctx);
            case "settings": return renderSettings(ctx);
        }
    });

bot.start();

// ---
// Why this pattern?
//
// If instead each view did:
//
//   const menuPlugin  = new Plugin("menu").callbackQuery(nav, …);
//   const adminPlugin = new Plugin("admin").callbackQuery(nav, …);
//   bot.extend(menuPlugin).extend(adminPlugin);
//
// Only the FIRST-registered handler would ever fire. The second plugin's
// handler is dead code — no runtime error, no warning. Debugging this is
// painful: buttons "just don't do anything".
//
// See:
//   - skills/plugins/views.md         ("Plain render functions" section)
//   - skills/references/middleware-routing.md
