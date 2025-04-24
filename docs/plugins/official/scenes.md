---
title: Scenes Plugin for GramIO

head:
    - - meta
      - name: "description"
        content: "Create multi-step conversations and user flows with the scenes plugin for Telegram bots in GramIO."

    - - meta
      - name: "keywords"
        content: "Telegram bot, GramIO, scenes plugin, multi-step flows, conversation management, dialog scenes, step-by-step interactions, user journey, stateful conversations, wizard dialog, complex forms, user onboarding, chat navigation, scene transitions, context persistence, TypeScript, Deno, Bun, Node.js"
---

# @gramio/scenes

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/scenes?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/scenes)
[![JSR](https://jsr.io/badges/@gramio/scenes)](https://jsr.io/@gramio/scenes)
[![JSR Score](https://jsr.io/badges/@gramio/scenes/score)](https://jsr.io/@gramio/scenes)

</div>

The API can be changed a little, but we already use it in production environment.

# Usage

```ts twoslash
import { Bot } from "gramio";
import { scenes, Scene } from "@gramio/scenes";

export const greetingScene = new Scene("greeting")
    .params<{ test: boolean }>()
    .step("message", (context) => {
        if (context.scene.step.firstTime)
            return context.send("Hi! What's your name?");

        if (!context.text) return context.send("Please write your name");

        return context.scene.update({
            name: context.text,
        });
    })
    .step("message", (context) => {
        if (context.scene.step.firstTime)
            return context.send("How old are you?");

        const age = Number(context.text);

        if (!age || Number.isNaN(age) || age < 0)
            return context.send("Please write your age correctly");

        return context.scene.update({
            age,
        });
    })
    .step("message", async (context) => {
        await context.send(
            `Nice to meet you! I now know that your name is ${
                context.scene.state.name
            } and you are ${context.scene.state.age} years old. ${
                context.scene.params.test ? "Also you have test param!" : ""
                //                    ^?
            }`
        );

        return context.scene.exit();
    });

const bot = new Bot(process.env.TOKEN as string)
    .extend(scenes([greetingScene]))
    .command("start", async (context) => {
        return context.scene.enter(greetingScene, {
            test: true,
        });
    });
```

### Share state between steps

```ts twoslash
import { Scene } from "@gramio/scenes";

const testScene = new Scene("test")
    .step("message", async (context) => {
        if (context.scene.step.firstTime || context.text !== "1")
            return context.send("1");

        return context.scene.update({
            messageId: context.id,
            some: "hii!" as const,
        });
    })
    .step("message", async (context) => {
        if (context.scene.step.firstTime || context.text !== "2")
            return context.send("2");

        console.log(context.scene.state.messageId);
        //                           ^?
    });
```

## on

This method allows you to register event handlers for a scene.

```ts
const guessRandomNumberScene = new Scene("guess-random-number")
    .params<{ randomNumber: number }>()
    .on("message", async (context, next) => {
        // This check is needed so the handler does not trigger on firstTime because context will be the same as previous step
        if (context.scene.step.firstTime) return next();

        return await Promise.all([context.delete(), next()]);
    })
    .step(["message", "callback_query"], async (context) => {
        if (context.scene.step.firstTime)
            return context.send("Try to guess a number from 1 to 10");

        if (!context.is("message"))
            return context.answer("Please write a message with a number");

        const number = Number(context.text);

        if (
            Number.isNaN(number) ||
            number !== context.scene.params.randomNumber
        )
            return; // The handler above will delete the user's message

        return Promise.all([
            context.send(
                format(
                    `Congratulations! You guessed the number ${bold(
                        context.scene.params.randomNumber
                    )}!`
                )
            ),
            context.scene.exit(),
        ]);
    });
```

Keep in mind that a handler is registered only for all subsequent steps (or .on handlers) after it is declared.

```ts
new Scene("test")
    .on(...) // Called for all steps
    .step(...)
    .on(...) // Called only after the 2nd step is reached
    .step(...)
```

## Storage usage

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

[Read more about storages](/storages/)

## Scene context

<!-- The scene context contains all the data that was passed to the scene on entry. -->

### update

`update` is a function that updates the data in the scene and preserves their types.

```ts twoslash
import { Scene } from "@gramio/scenes";

const testScene = new Scene("test")
    .step("message", async (context) => {
        if (context.scene.step.firstTime) return context.send("First message");

        if (!context.text) return context.delete();

        return context.scene.update({
            message: context.text,
        });
    })
    .step("message", async (context) => {
        return context.send(context.scene.state.message);
    });
```

### state

`state` is an object that contains all the data that has been "collected" in this scene.

(see the example above)

### params

`params` is an object that contains all the data that was passed to the scene on entry.

```ts twoslash
import { Bot } from "gramio";
import { scenes, Scene } from "@gramio/scenes";

const testScene = new Scene("test")
    // here we specify the type of scene parameters
    .params<{ test: boolean }>()
    .step("message", async (context) => {
        return context.send(context.scene.params.test);
    });

const bot = new Bot(process.env.TOKEN as string)
    .extend(scenes([testScene]))
    .command("start", async (context) => {
        return context.scene.enter(testScene, {
            test: true,
        });
    });
```

### reenter

`reenter` is a function that allows you to re-enter the scene at the first step, losing [state](#state).

```ts
const testScene = new Scene("test")
    .on("message", async (context, next) => {
        if (context.text === "/start") return context.scene.reenter();

        return next();
    })
    .step("message", async (context) => {
        if (context.scene.step.firstTime) return context.send("Hi!");

        return context.send("Bye!");
    });
```

### Step context

All information about the current scene step is stored in `context.scene.step`.

#### firstTime

`firstTime` is a flag that indicates whether the current step execution is the first.

```ts
const testScene = new Scene("test").step("message", async (context) => {
    if (context.scene.step.firstTime) return context.send("First message");

    if (context.text !== "next")
        return context.send("Subsequent messages until 'next' is written");

    return Promise.all([context.send("Last message"), context.scene.exit()]);
});
```

#### next

`next` is a function that passes control to the next scene step.

```ts
const testScene = new Scene("test").step("message", async (context) => {
    if (context.scene.step.firstTime) return context.send("First message");

    return context.scene.next();
});
```

#### previous

`previous` is a function that passes control to the previous scene step.

```ts
const testScene = new Scene("test").step("message", async (context) => {
    if (context.scene.step.firstTime) return context.send("First message");

    return context.scene.previous();
});
```

#### go

`go` is a function that passes control to a specific scene step.

```ts
const testScene = new Scene("test").step("message", async (context) => {
    if (context.scene.step.firstTime) return context.send("First message");

    return context.scene.go(5);
});
```

#### id

`id` is the identifier of the scene step.

```ts
const testScene = new Scene("test").step("message", async (context) => {
    if (context.scene.step.firstTime)
        return context.send(`Step ${context.scene.step.id}`);

    return context.scene.exit();
});
```

#### previousId

`previousId` is the identifier of the previous scene step.

The id of the last step is saved when calling [#go](#go), [#previous](#previous), [#next](#next).

```ts
const testScene = new Scene("test")
    .step("message", async (context) => {
        if (context.scene.step.firstTime)
            return context.send(
                `from step ${context.scene.step.previousId} to step ${context.scene.step.id}`
            );

        return context.scene.exit();
    })
    .step("message", async (context) => {
        return context.scene.step.go(1);
    });
```

## Scenes derives

Sometimes you want to control scenes before the plugin executes scene steps but after the scene is fetched from storage.

By default, the `scenes()` function derives what is needed for the next middlewares if the user is not in a scene.
With `scenesDerives()` you can get it earlier and manage scene data.

<!-- TODO: without current scene -->

```ts twoslash
import { Scene } from "@gramio/scenes";

const testScene = new Scene("test").state<{
    simple: string;
    example: number[];
}>();
// ---cut---
import { scenes, scenesDerives, type AnyScene } from "@gramio/scenes";
import { Bot } from "gramio";
import { redisStorage } from "@gramio/storage-redis";

const storage = redisStorage();
const scenesList: AnyScene[] = [testScene];

const bot = new Bot(process.env.TOKEN as string)
    .extend(
        scenesDerives(scenesList, {
            withCurrentScene: true,
            storage,
        })
    )
    .on("message", (context, next) => {
        if (context.text === "/start" && context.scene.current) {
            if (context.scene.current.is(testScene)) {
                console.log(context.scene.current.state);
                //                                   ^?
                return context.scene.current.step.previous();
            } else return context.scene.current.reenter();
        }

        return next();
    })
    .extend(
        scenes(scenesList, {
            storage,
        })
    )
    .command("start", async (context) => {
        return context.scene.enter(testScene, {
            test: true,
        });
    });
```

> [!IMPORTANT]
> The same **storage** and **list of scenes** should be shared across `scenes()` and `scenesDerives()` options.

By default, when registering the `scenes()` plugin, `inMemoryStorage` is used. So if you need to use `scenesDerives()` to manage scenes, you must declare `inMemoryStorage` yourself and explicitly specify it in both `scenesDerives()` and `scenes()` options.

```ts
import { inMemoryStorage } from "@gramio/storage";

const storage = inMemoryStorage(); // Stores in process memory and will be erased on restart

const bot = new Bot(process.env.TOKEN as string)
    .extend(scenes([testScene], { storage }))
    // ...
    .extend(scenesDerives([testScene], { storage }));
```

> [!IMPORTANT]
> Be careful. The first step of the scene should also include the event from which you entered the scene. (For example, if you enter via InlineButton click — `callback_query`)

### step

This function defines a scene step. It is executed only when the current scene step id matches the registered step order.

```ts
const testScene = new Scene("test")
    // For a single event
    .step("message", async (context) => {
        if (context.scene.step.firstTime) return context.send("First message");

        return context.scene.exit();
    })
    // For specific events
    .step(["message", "callback_query"], async (context) => {
        if (context.scene.step.firstTime)
            return context.send("Second message after the user's message");

        if (context.is("callback_query"))
            return context.answer("You pressed the button");

        return context.scene.exit();
    })
    // For all events
    .step((context) => {
        console.log(context);
        return context.scene.exit();
    });
```

> [!NOTE]
> If the user triggers an event that is not registered in the step, it will be ignored by the step (but any event handlers registered for it will still be called).
