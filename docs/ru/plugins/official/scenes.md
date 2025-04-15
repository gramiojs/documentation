---
title: Плагин сцен @gramio/scenes - Создание многошаговых диалогов

head:
    - - meta
      - name: "description"
        content: "Плагин сцен позволяет создавать многошаговые диалоги и сложные сценарии взаимодействия с пользователем в Telegram ботах на GramIO."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, плагин сцен, многошаговые диалоги, конечный автомат, машина состояний, пошаговые формы, сценарии бота, wizard, scenes, шаги сцены, сценарные шаги, контекст сцены, хранение состояния, шаг сцены, поделиться состоянием, дерево диалога"
---

# @gramio/scenes

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/scenes?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/scenes)
[![JSR](https://jsr.io/badges/@gramio/scenes)](https://jsr.io/@gramio/scenes)
[![JSR Score](https://jsr.io/badges/@gramio/scenes/score)](https://jsr.io/@gramio/scenes)

</div>

API может немного измениться, но мы уже активно используем его на боевых проектах.

# Использование

```ts twoslash
import { Bot } from "gramio";
import { scenes, Scene } from "@gramio/scenes";

export const greetingScene = new Scene("greeting")
    .params<{ test: boolean }>()
    .step("message", (context) => {
        if (context.scene.step.firstTime)
            return context.send("Привет! Как тебя зовут?");

        if (!context.text) return context.send("Пожалуйста, напиши своё имя");

        return context.scene.update({
            name: context.text,
        });
    })
    .step("message", (context) => {
        if (context.scene.step.firstTime)
            return context.send("Сколько тебе лет?");

        const age = Number(context.text);

        if (!age || Number.isNaN(age) || age < 0)
            return context.send("Пожалуйста, укажи возраст корректно");

        return context.scene.update({
            age,
        });
    })
    .step("message", async (context) => {
        await context.send(
            `Рад познакомиться! Теперь я знаю, что тебя зовут ${
                context.scene.state.name
            } и тебе ${context.scene.state.age} лет. ${
                context.scene.params.test
                    ? "Также у тебя есть параметр test!"
                    : ""
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

### Общее состояние между шагами

```ts twoslash
import { Scene } from "@gramio/scenes";

const testScene = new Scene("test")
    .step("message", async (context) => {
        if (context.scene.step.firstTime || context.text !== "1")
            return context.send("1");

        return context.scene.update({
            messageId: context.id,
            some: "привет!" as const,
        });
    })
    .step("message", async (context) => {
        if (context.scene.step.firstTime || context.text !== "2")
            return context.send("2");

        console.log(context.scene.state.messageId);
    });
```

## Использование хранилища

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

[Подробнее о хранилищах](/ru/storages/)

## scenesDerives

Иногда нужно управлять сценами до выполнения шагов сцены плагином, но после получения сцены из хранилища.

По умолчанию функция `scenes()` передаёт необходимые данные последующим обработчикам, если пользователь не находится в сцене.
С помощью `scenesDerives()` вы можете получить эти данные раньше и управлять ими.

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
> Одно и то же **хранилище** и **список сцен** нужно использовать и в `scenes()`, и в опциях `scenesDerives()`.

<!-- TODO: Translate any new or changed sections from docs/plugins/official/scenes.md if missed above. -->
