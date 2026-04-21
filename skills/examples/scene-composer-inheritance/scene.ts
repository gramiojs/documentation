import { Scene } from "@gramio/scenes";
import { baseComposer } from "./base.js";

// Scene.extend(baseComposer) is the canonical way to surface bot-level
// derives (ctx.t here) inside every step + onEnter. Because baseComposer is
// named and the bot extends it too (see ./index.ts), GramIO's dedup prevents
// the derive from running twice per update.
//
// This file imports ./base.ts — NOT ./index.ts — which is why we split the
// composer off. If it imported the outer composer from ./index.ts, and
// ./index.ts imported this scene to pass into `scenes([...])`, we'd have a
// circular dep and the composer type would silently collapse to `any`.
export const demoScene = new Scene("demo")
    .extend(baseComposer)
    .onEnter((ctx) => ctx.send(ctx.t("welcome")))
    .step("message", async (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send(ctx.t("prompt"));
        return ctx.scene.step.next();
    })
    .step("message", async (ctx) => {
        await ctx.send(ctx.t("done"));
        return ctx.scene.exit();
    });
