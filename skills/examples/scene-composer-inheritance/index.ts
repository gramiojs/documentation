import { Bot } from "gramio";
import { scenes, scenesDerives } from "@gramio/scenes";
import { inMemoryStorage } from "@gramio/storage";
import { baseComposer, stats } from "./base.js";
import { demoScene } from "./scene.js";

// Assembly file. Extends baseComposer on the Bot so the derive runs on the
// real ctx; extends scenes([demoScene]) so scene routing works. The scene's
// own .extend(baseComposer) is a no-op at runtime here (dedup) — it exists
// purely to pull the derived types into step handler contexts.
const sceneStorage = inMemoryStorage();
const scenesList = [demoScene];

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(baseComposer)
    .extend(scenesDerives(scenesList, { withCurrentScene: true, storage: sceneStorage }))
    .extend(scenes(scenesList, { storage: sceneStorage }))
    .command("start", (ctx) => ctx.scene.enter(demoScene))
    .command("ping", (ctx) => ctx.send(ctx.t("pong")));

bot.start();

export { bot, demoScene, baseComposer, stats };
