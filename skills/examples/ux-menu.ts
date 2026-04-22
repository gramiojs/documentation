/**
 * UX patterns — hero /start, nested menus, toggle buttons, destructive confirm.
 *
 * Every screen lives in ONE edited message. Users click, message rewrites in
 * place. No commands beyond /start, no message spam.
 *
 * See also:
 *   - skills/references/ux-patterns.md   (design rationale)
 *   - skills/references/keyboards.md     (keyboard API)
 *   - skills/references/formatting.md    (format`` rules)
 */
import {
    Bot,
    CallbackData,
    InlineKeyboard,
    blockquote,
    bold,
    format,
    italic,
    type CallbackQueryShorthandContext,
} from "gramio";
import { session } from "@gramio/session";

// --- state ----------------------------------------------------------------

interface Settings {
    notifications: boolean;
    quietHours: boolean;
}

const initialSettings = (): Settings => ({
    notifications: true,
    quietHours: false,
});

// --- callback schemas -----------------------------------------------------

const nav = new CallbackData("nav").enum("to", [
    "home",
    "settings",
    "stats",
    "help",
    "account.confirmDelete",
    "account.doDelete",
]);

// Toggles share a schema keyed by field name — one handler handles all toggles.
const toggle = new CallbackData("toggle").enum("key", [
    "notifications",
    "quietHours",
]);

// --- bot ------------------------------------------------------------------

const bot = new Bot(process.env.BOT_TOKEN!).extend(
    session({ key: "session", initial: initialSettings })
);

type NavCtx = CallbackQueryShorthandContext<typeof bot, typeof nav>;
type ToggleCtx = CallbackQueryShorthandContext<typeof bot, typeof toggle>;
type SettingsHost = NavCtx | ToggleCtx;

// --- screens --------------------------------------------------------------

// Hero /start — bold title, blockquote description, italic hint. The text
// sells the bot in one screen; the primary actions live right under it.
function heroText() {
    return format`${bold`🤖 GramIO Demo Bot`}

${blockquote`Button-first bot — every screen fits in one edited message. Tap a tile below to navigate; the message rewrites in place.`}

${italic`Tip: nothing here types commands — it all clicks.`}`;
}

function mainKeyboard() {
    return new InlineKeyboard()
        .text("⚙️ Settings", nav.pack({ to: "settings" }))
        .text("📊 Stats", nav.pack({ to: "stats" }))
        .row()
        .text("❓ Help", nav.pack({ to: "help" }));
}

function renderHome(ctx: NavCtx) {
    return ctx.editText(heroText(), { reply_markup: mainKeyboard() });
}

// Toggle buttons: the label IS the state. `✅` = on, `⬜` = off. One tap
// flips the field in session and re-renders this same screen — no "saved!"
// toast, the visible label change IS the feedback.
function toggleLabel(on: boolean, label: string) {
    return `${on ? "✅" : "⬜"} ${label}`;
}

function settingsKeyboard(s: Settings) {
    return (
        new InlineKeyboard()
            .text(
                toggleLabel(s.notifications, "Notifications"),
                toggle.pack({ key: "notifications" })
            )
            .row()
            .text(
                toggleLabel(s.quietHours, "Quiet hours"),
                toggle.pack({ key: "quietHours" })
            )
            .row()
            // Destructive action — styled red, kept away from safe buttons.
            .text("🗑 Delete account", nav.pack({ to: "account.confirmDelete" }), {
                style: "danger",
            })
            .row()
            .text("◀ Back", nav.pack({ to: "home" }))
    );
}

function renderSettings(ctx: SettingsHost) {
    const text = format`${bold`⚙️ Settings`} ${italic`· home › settings`}

${blockquote`Toggle a row to flip the value. The screen rewrites in place — no new messages spammed into the chat.`}`;
    return ctx.editText(text, { reply_markup: settingsKeyboard(ctx.session) });
}

function renderStats(ctx: NavCtx) {
    // Empty-state: friendly copy instead of a blank screen. A real bot would
    // swap the blockquote + CTA for real rows once data exists.
    const text = format`${bold`📊 Stats`} ${italic`· home › stats`}

${blockquote`You don't have any activity yet — this is where a real bot would show a populated view. Blank screens are an anti-pattern; always say what's missing and offer a next step.`}`;
    const kb = new InlineKeyboard().text("◀ Back", nav.pack({ to: "home" }));
    return ctx.editText(text, { reply_markup: kb });
}

function renderHelp(ctx: NavCtx) {
    const text = format`${bold`❓ Help`} ${italic`· home › help`}

${blockquote`This bot is a demo of UX patterns: hero /start, nested menus, toggles, destructive confirmation. Open the code to see how each screen is composed.`}`;
    const kb = new InlineKeyboard().text("◀ Back", nav.pack({ to: "home" }));
    return ctx.editText(text, { reply_markup: kb });
}

// Destructive confirm — the red tile in settings navigates here first, it
// never deletes on the first click. Two clear buttons, one safe default.
function renderConfirmDelete(ctx: NavCtx) {
    const text = format`${bold`⚠️ Delete your account?`}

${blockquote`All data will be erased. This cannot be undone.`}`;
    const kb = new InlineKeyboard()
        .text("❌ Cancel", nav.pack({ to: "settings" }))
        .text("💥 Yes, delete", nav.pack({ to: "account.doDelete" }), {
            style: "danger",
        });
    return ctx.editText(text, { reply_markup: kb });
}

function renderDeleted(ctx: NavCtx) {
    // Reset in-memory session — a real bot would also fire the DB delete here.
    ctx.session.notifications = true;
    ctx.session.quietHours = false;
    const text = format`${bold`✅ Account deleted`}

${italic`You can start over any time with /start.`}`;
    const kb = new InlineKeyboard().text("🏠 Back to /start", nav.pack({ to: "home" }));
    return ctx.editText(text, { reply_markup: kb });
}

// --- wiring ---------------------------------------------------------------

bot.command("start", (ctx) =>
    ctx.send(heroText(), { reply_markup: mainKeyboard() })
)
    // ONE router for all nav buttons. ctx.answer() first so the client's
    // spinner stops immediately — never leave a callback unanswered.
    .callbackQuery(nav, async (ctx) => {
        await ctx.answer();
        switch (ctx.queryData.to) {
            case "home":
                return renderHome(ctx);
            case "settings":
                return renderSettings(ctx);
            case "stats":
                return renderStats(ctx);
            case "help":
                return renderHelp(ctx);
            case "account.confirmDelete":
                return renderConfirmDelete(ctx);
            case "account.doDelete":
                return renderDeleted(ctx);
        }
    })
    // Toggle handler — flips the field, answers with a short toast, rerenders.
    .callbackQuery(toggle, async (ctx) => {
        const key = ctx.queryData.key;
        ctx.session[key] = !ctx.session[key];
        await ctx.answer(
            `${key === "notifications" ? "Notifications" : "Quiet hours"}: ${
                ctx.session[key] ? "ON" : "OFF"
            }`
        );
        return renderSettings(ctx);
    });

bot.start();

export { bot, nav, toggle };
