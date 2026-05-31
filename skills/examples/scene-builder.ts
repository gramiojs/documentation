/**
 * Builder-step scene API (@gramio/scenes v0.7+).
 *
 * Demonstrates the recommended "scene-as-composer" step form:
 * - `.step(name, c => c.enter(...).on(...))` — each step is its own sub-composer
 * - `.message(text)` sugar for `.enter(ctx => ctx.send(text))`
 * - per-step `.on` / `.hears` / `.fallback` lifecycle handlers
 * - state auto-inferred from `ctx.scene.update({...})` (no `.state<T>()` needed)
 */
import { Bot } from "gramio";
import { scenes, Scene } from "@gramio/scenes";

const checkout = new Scene("checkout")
    .step("ask-name", (c) =>
        c
            .message("What's your name?") // sugar for .enter(ctx => ctx.send(...))
            .on("message", (ctx) => ctx.scene.update({ name: ctx.text })),
    )
    .step("confirm", (c) =>
        c
            .enter((ctx) => ctx.send(`${ctx.scene.state.name}, confirm? (yes/no)`))
            .hears("yes", (ctx) => ctx.scene.exit())
            .fallback((ctx) => ctx.send("Please answer yes or no")),
    );

const bot = new Bot(process.env.BOT_TOKEN!)
    .extend(scenes([checkout]))
    .command("checkout", (ctx) => ctx.scene.enter(checkout));

bot.start();

export { bot, checkout };
