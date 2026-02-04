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

API может меняться, но пользователи уже активно его используют в своих проектах.

# Использование

```ts twoslash
import { Bot } from "gramio";
import { scenes, Scene } from "@gramio/scenes";
import { z } from "zod";

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
    .ask(
        "age",
        z.coerce
            .number({
                required_error: "Please write your age correctly",
            })
            .min(18, "You must be at least 18 years old")
            .max(100, "You must be less than 100 years old"),
        "How old are you?"
    )
    .step("message", async (context) => {
        await context.send(
            `Рад познакомиться! Теперь я знаю, что тебя зовут ${
                context.scene.state.name
            } и тебе ${context.scene.state.age} лет. ${
                //                     ^?
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

> [!WARNING]
> Будьте внимательны. Первый шаг сцены должен так же включать в себя событие из которого вы вошли в сцену. (например если по нажатию InlineButton - `callback_query`)

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

[Подробнее о хранилищах](/ru/storages)

### step

Это функция — шаг сцены. Он выполняется только когда текущий id шага сцены совпадает с порядком зарегистрированного шага.

```ts
const testScene = new Scene("test")
    // Для одного события
    .step("message", async (context) => {
        if (context.scene.step.firstTime)
            return context.send("Первое сообщение");
        return context.scene.exit();
    })
    // Для конкретных событий
    .step(["message", "callback_query"], async (context) => {
        if (context.scene.step.firstTime)
            return context.send(
                "Второе сообщение после сообщения пользователя"
            );
        if (context.is("callback_query"))
            return context.answer("Вы нажали на кнопку");
        return context.scene.exit();
    })
    // Для всех событий
    .step((context) => {
        console.log(context);
        return context.scene.exit();
    });
```

> [!NOTE]
> Если пользователь создаёт событие, которое не зарегистрировано в шаге, оно будет проигнорировано этим шагом (но зарегистрированные для него обработчики событий будут вызваны).

### ask

> [!WARNING]
> В этом API что-нибудь может измениться.

`ask` - сахар над `step`, который поможет избежать бойлерплейта для простых типовых шагов с проверками.

Под капотом используется [Standard Schema](https://standardschema.dev/), так что вы можете использовать любой валидатор, который реализует этот стандарт. (например [zod](https://zod.dev/))

Первым аргументом принимает ключ, по которому будет сохранено значение. (Типы при этом для следующих шагов выводятся автоматически)
Вторым аргументом принимает схему валидации, которая будет использоваться для валидации значения. ([Standard Schema валидатор](https://standardschema.dev/))
А третьим аргументом принимает текст, который будет отправлен пользователю при первом вызове шага (`firstTime`).

::: code-group

```ts [zod]
import { z } from "zod";

const testScene = new Scene("test")
    .ask(
        "email",
        z
            .string({
                required_error: "Похоже, вы ввели некорректный адрес электроной почты",
            })
            .email("Неправильный формат почты"),
        "Введите свою электронную почту"
    )
    .ask(
        "age",
        z.coerce
            .number({
                required_error: "Похоже, вы ввели некорректный возраст",
            })
            .min(18, "Минимальный возраст — 18 лет")
            .max(100, "Максимальный возраст — 100 лет"),
        "Сколько тебе лет?"
    )
    .step("message", async (context) => {
        await context.send(
            `Электронная почта: ${context.scene.state.email}\nВозраст: ${context.scene.state.age}`
        );
        return context.scene.exit();
    });
```

```ts [sury]
import * as s from "sury";

const testScene = new Scene("test")
    .ask(
        "email",
        s.email(s.string, "Похоже, вы ввели некорректный адрес электроной почты"),
        "Введите свою электронную почту"
    )
    .ask(
        "age",
        s.string.with(
            s.to, 
            s.max(
                s.min(
                    s.number,
                    18, 
                    "Минимальный возраст — 18 лет"
                ),
            100, 
            "Максимальный возраст — 100 лет"
        )),
        "Сколько тебе лет?"
    )
    .step("message", async (context) => {
        await context.send(
            `Электронная почта: ${context.scene.state.email}\nВозраст: ${context.scene.state.age}`
        );
        return context.scene.exit();
    });
```

:::

> [!WARNING]
> Мы работаем с текстом, так что необходимо использовать [`z.coerce`](https://zod.dev/api?id=coercion) или похожие методы у валидаторов, которые преобразуют текст в число для корректного типа.

### on

Этот метод позволяет зарегистрировать обработчик событий для сцены.

```ts
const guessRandomNumberScene = new Scene("guess-random-number")
    .params<{ randomNumber: number }>()
    .on("message", async (context, next) => {
        // Это условие нужно, чтобы обработчик не срабатывал при firstTime так как context будет одинаковым с предыдущим шагом
        if (context.scene.step.firstTime) return next();

        return await Promise.all([context.delete(), next()]);
    })
    .step(["message", "callback_query"], async (context) => {
        if (context.scene.step.firstTime)
            return context.send("Попробуй угадать число от 1 до 10");

        if (!context.is("message"))
            return context.answer("Пожалуйста, отправьте число сообщением");

        const number = Number(context.text);

        if (
            Number.isNaN(number) ||
            number !== context.scene.params.randomNumber
        )
            return; // Обработчик выше удалит отправленное пользователем сообщение

        return Promise.all([
            context.send(
                format(
                    `Поздравляю! Ты угадал число ${bold(
                        context.scene.params.randomNumber
                    )}!`
                )
            ),
            context.scene.exit(),
        ]);
    });
```

Обратите внимание: обработчик применяется только ко всем шагам, объявленным после него (или к следующим .on), а не к предыдущим.

```ts
new Scene("test")
    .on(...) // Вызывается для всех шагов
    .step(...)
    .on(...) // Вызывается только после достижения второго шага
    .step(...)
```

## Контекст сцены

<!-- Контекст сцены содержит в себе все данные . -->

### update

`update` - это функция, которая обновляет данные в сцене и при этом сохраняет их типы.

```ts twoslash
import { Scene } from "@gramio/scenes";

const testScene = new Scene("test")

    .step("message", async (context) => {
        if (context.scene.step.firstTime)
            return context.send("Первое сообщение");

        if (!context.text) return context.delete();

        return context.scene.update({
            message: context.text,
        });
    })
    .step("message", async (context) => {
        return context.send(context.scene.state.message);
        //                                 ^?
    });
```

### state

`state` - это объект, который содержит все данные, которые были собраны в этой сцене.

(смотрите пример выше)

### params

`params` - это объект, который содержит все данные, которые были переданы в сцену при её входе.

```ts twoslash
import { Bot } from "gramio";
import { scenes, Scene } from "@gramio/scenes";

const testScene = new Scene("test")
    // тут мы указываем тип параметров сцены
    .params<{ test: boolean }>()
    .step("message", async (context) => {
        return context.send(context.scene.params.test);
        //                                 ^?
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

`reenter` - это функция, которая позволяет перезайти в сцену в первый шаг потеряв [state](#state).

```ts
const testScene = new Scene("test")
    .on("message", async (context, next) => {
        if (context.text === "/start") return context.scene.reenter();

        return next();
    })
    .step("message", async (context) => {
        if (context.scene.step.firstTime) return context.send("Привет!");

        return context.send("Пока!");
    });
```

### Контекст шага

Тут находится вся информация о текущем шаге сцены.

Он хранится в `context.scene.step`.

#### firstTime

`firstTime` - это флаг, который указывает, является ли текущее выполнение шага первым.

```ts
const testScene = new Scene("test").step("message", async (context) => {
    if (context.scene.step.firstTime) return context.send("Первое сообщение");

    if (context.text !== "следующее")
        return context.send(
            "Последующие сообщения до того как напишут «следующее»"
        );

    return Promise.all([
        context.send("Последнее сообщение"),
        context.scene.exit(),
    ]);
});
```

#### next

`next` - это функция, которая передаёт управление следующему шагу сцены.

```ts
const testScene = new Scene("test").step("message", async (context) => {
    if (context.scene.step.firstTime) return context.send("Первое сообщение");

    return context.scene.step.next();
});
```

#### previous

`previous` - это функция, которая передаёт управление предыдущему шагу сцены.

```ts
const testScene = new Scene("test").step("message", async (context) => {
    if (context.scene.step.firstTime) return context.send("Первое сообщение");

    return context.scene.previous();
});
```

#### go

`go` - это функция, которая передаёт управление конкретному шагу сцены.

```ts
const testScene = new Scene("test").step("message", async (context) => {
    if (context.scene.step.firstTime) return context.send("Первое сообщение");

    return context.scene.go(5);
});
```

#### id

`id` - это идентификатор шага сцены.

```ts
const testScene = new Scene("test").step("message", async (context) => {
    if (context.scene.step.firstTime)
        return context.send(`Шаг ${context.scene.step.id}`);

    return context.scene.exit();
});
```

#### previousId

`previousId` - это идентификатор предыдущего шага сцены.

Сохраняется id последнего шага при вызове [#go](#go), [#previous](#previous), [#next](#next).

```ts
const testScene = new Scene("test")
    .step("message", async (context) => {
        if (context.scene.step.firstTime)
            return context.send(
                `из шага ${context.scene.step.previousId} в шаг ${context.scene.step.id}`
            );

        return context.scene.exit();
    })
    .step("message", async (context) => {
        return context.scene.step.go(1);
    });
```

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

По умолчанию при регистрации плагина `scenes()` используется `inMemoryStorage`. Поэтому если вам нужно использовать `scenesDerives()` для управления сценами, необходимо явно объявить `inMemoryStorage` и явно указать его в опциях как для `scenesDerives()`, так и для `scenes()`.

```ts
import { inMemoryStorage } from "@gramio/storage";

const storage = inMemoryStorage(); // Хранит в памяти процесса и будет стёрто при перезапуске

const bot = new Bot(process.env.TOKEN as string)
    .extend(scenes([testScene], { storage }))
    // ...
    .extend(scenesDerives([testScene], { storage }));
```

## VS Prompt

> Spoiler: рекомендуем использовать `scenes`

`prompt` и `scenes` это два плагина для одной цели: спрашивать и получать ответы от пользователя.

`prompt` более простая версия, которая реализуется благодаря `Promise` и `in-memory` хранилищу.
Это позволяет более просто использовать сценарий **вопрос-ответ**, но имеет свои ограничения, например, данные хранятся в памяти процесса и будут **стёрты при перезапуске**.

`scenes` же решает эту проблему благодаря своему подходу - делению обработчиков на **шаги**. Поэтому в `scenes` можно подключить любое хранилище, например `redis` и не бояться за потерю данных при перезапуске.
