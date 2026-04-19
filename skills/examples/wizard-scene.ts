/**
 * Callback-driven wizard scene.
 *
 * Demonstrates:
 * - mixing callback_query and message steps in one scene
 * - rendering UI in onEnter and in the same callback handler (not waiting for next update)
 * - global scene exit from a top-level nav handler via scenesDerives + shared storage
 * - derived context (auth) flowing into the scene via scene.extend(plugin)
 */
import { Bot, CallbackData, InlineKeyboard, Plugin, format, bold, link } from "gramio";
import { scenes, scenesDerives, Scene } from "@gramio/scenes";
import { session } from "@gramio/session";
import { inMemoryStorage } from "@gramio/storage";

// --- types ----------------------------------------------------------------

interface AuthResult {
    userId: number;
    isAdmin: boolean;
}

// --- shared callback schemas ---------------------------------------------

const nav = new CallbackData("nav").enum("to", ["home", "order", "history"]);
const orderPick = new CallbackData("op").string("site");

// --- auth plugin (derive) ------------------------------------------------

const authPlugin = new Plugin("auth").derive(["message", "callback_query"], async (ctx) => {
    const from = ctx.from;
    const auth: AuthResult = {
        userId: from?.id ?? 0,
        isAdmin: from?.id === 123456789, // placeholder
    };
    return { auth };
});

// --- the wizard scene ----------------------------------------------------

const orderScene = new Scene("order")
    .extend(authPlugin) // ctx.auth is typed in all steps
    .state<{ site?: string; address?: string }>()
    .onEnter(async (ctx) => {
        // Classic "first render" — runs ONCE on scene entry.
        // Send the picker UI; the user's click will land in step 0 (the
        // .step("callback_query", …) below) on the next update.
        const kb = new InlineKeyboard()
            .text("example.com", orderPick.pack({ site: "example.com" }))
            .row()
            .text("test.org", orderPick.pack({ site: "test.org" }));
        return ctx.send(format`${bold`Pick a site:`}`, { reply_markup: kb });
    })
    .step("callback_query", async (ctx, next) => {
        const result = orderPick.safeUnpack(ctx.data!);
        // Not our button — pass through to bot-level handlers so global
        // nav (e.g. "home") can still react while the user is mid-scene.
        if (!result.success) return next();

        await ctx.editText(format`Site: ${bold(result.data.site)}\n\nNow send the address:`);
        await ctx.answer();
        // `scene.update()` auto-advances to the next step by default (equivalent
        // to `{ step: currentId + 1 }`). The next step is .step("message", …),
        // and since we're currently in a callback_query, its handler won't fire
        // synchronously — the prompt above is already visible to the user, and
        // the next message they send lands in step 1 with firstTime=true.
        await ctx.scene.update({ site: result.data.site });
    })
    .step("message", async (ctx) => {
        if (!ctx.text) return ctx.send("Please send a text address.");
        ctx.scene.update({ address: ctx.text });
        const { site, address } = ctx.scene.state;
        await ctx.send(format`Ordered ${bold(site!)} → ${link(address!, "https://example.com")}`);
        return ctx.scene.exit();
    });

// --- assembly ------------------------------------------------------------

const sceneStorage = inMemoryStorage();
const scenesList = [orderScene];

const bot = new Bot(process.env.BOT_TOKEN!)
    // MUST come before .extend(scenes(...)) so scene.exit() works globally
    .extend(scenesDerives(scenesList, { withCurrentScene: true, storage: sceneStorage }))
    .extend(scenes(scenesList, { storage: sceneStorage }))
    .extend(session({ key: "session", initial: () => ({}) }))
    .command("start", (ctx) => {
        const kb = new InlineKeyboard()
            .text("📧 order", nav.pack({ to: "order" }))
            .row()
            .text("📜 history", nav.pack({ to: "history" }))
            .row()
            .text("🏠 home", nav.pack({ to: "home" }));
        return ctx.send("Menu", { reply_markup: kb });
    })
    .callbackQuery(nav, async (ctx) => {
        // CRITICAL: if the user was mid-scene, exit first so they don't get stuck.
        if (ctx.scene.current) await ctx.scene.exit();
        await ctx.answer();

        switch (ctx.queryData.to) {
            case "home":    return ctx.editText("Home screen");
            case "history": return ctx.editText("History (empty)");
            case "order":   return ctx.scene.enter(orderScene);
        }
    });

bot.start();

export { bot, nav, orderPick, orderScene };
