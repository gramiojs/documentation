import { Bot } from "gramio";
import { Scene, scenes, scenesDerives } from "@gramio/scenes";
import { session } from "@gramio/session";
import { inMemoryStorage } from "@gramio/storage";
import { z } from "zod";

// Define a registration scene with steps.
//
// `.ask(key, schema, prompt)` is a built-in "ask one question, validate, store
// in scene state" step. `.step("message", handler)` / `.step("callback_query",
// handler)` is the general-purpose step — the string is the Telegram update
// type, NOT a step label. Steps advance with ctx.scene.step.next() / go(n).
const registration = new Scene("registration")
    .params<{ referral?: string }>()
    .state<{ name: string; age: number }>()
    .onEnter((ctx) => ctx.send("Let's register you."))
    .ask("name", z.string().min(1), "What is your name?")
    .ask(
        "age",
        z.coerce.number().int().min(1).max(150),
        "How old are you?"
    )
    .step("message", async (ctx) => {
        if (ctx.scene.step.firstTime) {
            const { name, age } = ctx.scene.state;
            return ctx.send(`Name: ${name}\nAge: ${age}\n\nIs this correct? (yes/no)`);
        }
        if (ctx.text?.toLowerCase() === "yes") {
            await ctx.send("Registration complete!");
            return ctx.scene.exit();
        }
        return ctx.scene.reenter();
    });

// Shared storage instance for scenes + scenesDerives (required to be the same).
const sceneStorage = inMemoryStorage();

const bot = new Bot(process.env.BOT_TOKEN as string)
    // scenesDerives first: exposes `ctx.scene` so bot-level handlers can
    // call `ctx.scene.enter(...)` / `ctx.scene.exit()`.
    .extend(scenesDerives([registration], { storage: sceneStorage, withCurrentScene: true }))
    .extend(scenes([registration], { storage: sceneStorage }))
    .extend(session({ key: "session", initial: () => ({}) }))
    .command("register", (ctx) => {
        return ctx.scene.enter(registration, {
            referral: ctx.args ?? undefined,
        });
    })
    .command("cancel", (ctx) => ctx.scene.exit());

bot.start();

export { bot, registration };
