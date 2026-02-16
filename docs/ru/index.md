---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

title: GramIO - Мощный Telegram Bot API фреймворк для создания ботов Telegram на TypeScript/JavaScript

head:
    - - meta
      - name: "description"
        content: GramIO - фреймворк на TypeScript/JavaScript для создания ботов Telegram, работающий на Node.js, Bun и Deno. Создайте бота с помощью «npx create gramio mybot» и запустите бота с помощью «npm run dev».

    - - meta
      - name: "keywords"
        content: телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, Grammy, Telegraf, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, как создать бота, создание бота, создание бота в Telegram, создание бота в Telegram на TypeScript, создание бота в Telegram на JavaScript, создание бота в Telegram на Node.JS, создание бота в Telegram на Nodejs, создание бота в Telegram на Deno, создание бота в Telegram на Bun

hero:
    name: "GramIO"
    text: |
        Создавайте своих 
        <span class="text-telegram"><span class="i-logos:telegram inline-block text-3xl md:text-5xl"></span> Telegram</span> ботов с комфортом!

    image:
        dark: /logo.svg
        light: /logo-light.svg
    actions:
        - theme: brand
          text: Начать
          link: /ru/get-started
        # - theme: alt
        #   text: Примеры API
        #   link: /api-examples
features:
    # - title: Alpha
    #   details: Проект находится в разработке (но уже может использоваться)
    - icon: 🔥
      title: Быстрый старт проекта
      details: С помощью <strong>npm create gramio</strong> вы можете быстро начать проект в различных конфигурациях, не тратя время на скучную настройку
    - icon: ✨
      title: Расширяемость
      details: Наша система <a href="/ru/plugins/overview">плагинов</a> и <a href="/ru/hooks/overview">хуков</a> просто потрясающая
    - icon: ⚙️
      title: Кодо-генерация
      details: Многие части генерируются автоматически
    - icon: 🛡️
      title: Типо-безопасность
      details: Написано на TypeScript с любовью ❤️
    - icon: 🌐
      title: Мультиплатформенность
      details: Работает на <a href="https://nodejs.org/">Node.js</a>, <a href="https://bun.sh/">Bun</a> и <a href="https://deno.com/">Deno</a>
    - icon: 🪄
      title: И многое другое
      # details: Works on <a href="https://nodejs.org/">Node.js</a>, <a href="https://bun.sh/">Bun</a> and <a href="https://deno.com/">Deno</a>
---

## Последние обновления

**[Bot API 9.4, система Views, OpenTelemetry и `streamMessage`](/ru/changelogs/2026-02-15)** — 8–15 февраля 2026

GramIO догоняет Bot API 9.4, представляет новую систему шаблонов Views, запускает плагины OpenTelemetry и Sentry, добавляет хук `onApiCall` и вводит `streamMessage`.

[Все обновления →](/ru/changelogs/)

## Начало работы

Эта команда поможет вам создать проект с GramIO (включая ORM, линтеры и плагины) самым простым способом.

::: code-group

```bash [npm]
npm create gramio@latest ./bot
```

```bash [yarn]
yarn create gramio@latest ./bot
```

```bash [pnpm]
pnpm create gramio@latest ./bot
```

```bash [bun]
bun create gramio@latest ./bot
```

```bash [deno]
TODO:// Deno поддерживается, но не в генераторе проектов
```

:::

Для получения дополнительной информации см. раздел «[Начало работы](/ru/get-started)».

### GramIO в действии

Пример, использующий некоторые интересные функции.

```ts twoslash
// @filename: utils.ts
export function findOrRegisterUser() {
    return {} as { id: number; name: string; balance: number };
}

// @filename: index.ts
// ---cut---
// @errors: 2339
import { Bot, format, bold, code } from "gramio";
import { findOrRegisterUser } from "./utils";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .derive("message", async () => {
        const user = await findOrRegisterUser();

        return {
            user,
        };
    })
    .on("message", (context) => {
        context.user;
        //        ^?
        //
        //
        //
        //
        //
        //
        //

        return context.send(format`
        Привет, ${bold(context.user.name)}! 
        Ваш баланс: ${code(context.user.balance)}`);
    })
    .on("callback_query", (context) => {
        //
        //
        context.user;
    });
```
