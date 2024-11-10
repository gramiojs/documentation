# @gramio/scenes

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/scenes?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/scenes)
[![JSR](https://jsr.io/badges/@gramio/scenes)](https://jsr.io/@gramio/scenes)
[![JSR Score](https://jsr.io/badges/@gramio/scenes/score)](https://jsr.io/@gramio/scenes)

</div>

WIP. The API can be changed, but we already use it in production environment.

# Usage

```ts
import { Bot } from "gramio";
import { scenes, Scene } from "@gramio/scenes";

const testScene = new Scene("test")
    .params<{ test: boolean }>()
    .step("message", (context) => {
        if (context.scene.step.firstTime || context.text !== "1")
            return context.send("1");

        if (context.scene.params.test === true) context.send("DEBUG!");

        return context.scene.step.next();
    });

const bot = new Bot(process.env.TOKEN as string)
    .extend(scenes([testScene]))
    .command("start", async (context) => {
        return context.scene.enter(testScene, {
            test: true,
        });
    });
```

### Share state between steps

```ts twoslash
import { Scene } from "@gramio/scenes";

const testScene = new Scene("test")
    .step("message", (context) => {
        if (context.scene.step.firstTime || context.text !== "1")
            return context.send("1");

        // u can fine type issues with this when returns non update session data but just ignore it for now
        return context.scene.update({ messageId: context.id });
    })
    .step("message", (context) => {
        if (context.scene.step.firstTime || context.text !== "2")
            return context.send("2");

        console.log(context.scene.state.messageId);
        //                           ^?
    });
```

### Storage usage

```ts
import { redisStorage } from "@gramio/storage-redis";

const bot = new Bot(process.env.TOKEN as string)
    .extend(
        scenes([testScene], {
            storage: redisStorage(),
        })
    )
    .command("start", async (context) => {
        return context.scene.enter(someScene, {
            test: true,
        });
    });
```
