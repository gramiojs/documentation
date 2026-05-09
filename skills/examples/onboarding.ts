import { Bot } from "gramio";
import { createOnboarding } from "@gramio/onboarding";

// A short tutorial that walks the user through a couple of features.
// Three advance mechanisms live side-by-side:
//   1. "next" / "exit" / "dismiss" buttons rendered by the plugin
//   2. `advanceOn` predicate — auto-advance when the user actually does
//      the thing the step describes (here: sends a link)
//   3. programmatic ctx.onboarding.welcome.next({ from }) — fire-and-forget
//      from a real business handler
//
// Since @gramio/onboarding 0.2.0, `bot.extend(welcome)` widens
// `ctx.onboarding.welcome` automatically — flow id and Steps union are
// captured from `createOnboarding({ id })` + the `.step(...)` chain.
const welcome = createOnboarding({ id: "welcome" })
    .step("hi", {
        text: "Hi! I'll show you around.",
        buttons: ["next", "exit"],
    })
    .step("links", {
        text: "Send me any link — I'll download it.",
        buttons: ["next", "dismiss"],
        // Auto-advance when the user actually sends a link; the `from` guard
        // in `next({ from })` below makes the call idempotent against a
        // racing button click.
        advanceOn: (ctx) =>
            ctx.is("message") && /https?:\/\//.test(ctx.text ?? ""),
    })
    .step("done", { text: "All set!" })
    .onComplete((ctx) => ctx.send("Welcome aboard! /help is always available."))
    .build();

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(welcome)
    .command("start", (ctx) => {
        // Fire-and-forget — `ctx.onboarding.*` never throws; errors forward
        // to bot.errorHandler with { source: "onboarding", flowId, op }.
        ctx.onboarding.welcome.start();
        return ctx.send("Let's start!");
    })
    .on("message", async (ctx) => {
        // Real business handler — runs whether or not the user is in the
        // onboarding flow. The `from: "links"` guard scopes the advance to
        // the step that expects this action.
        if (!/https?:\/\//.test(ctx.text ?? "")) return;
        await ctx.send(`Downloading ${ctx.text}…`);
        ctx.onboarding.welcome.next({ from: "links" });
    });

bot.start();

export { bot, welcome };
