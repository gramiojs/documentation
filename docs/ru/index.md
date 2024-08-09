---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

title: GramIO - Telegram Bot API фреймворк для TypeScript/JavaScript

head:
    - - meta
      - name: "description"
        content: GramIO это TypeScript/JavaScript фреймворк для создания Телеграм ботов. Чтобы начать, вы можете ввести в консоль «npx create gramio bot-dir» и запустить своего бота с помощью «npm run dev». Это всё что вам нужно чтобы начать работать с GramIO.
    - - meta
      - name: "keywords"
        content: Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, How to build a bot, create

hero:
    name: "GramIO"
    text: |
        Создавай своих
        <span class="text-telegram"><span class="i-logos:telegram inline-block text-3xl md:text-5xl"></span> Телеграм</span> ботов с удобством!
    image:
        dark: /logo.svg
        light: /logo-light.svg
    actions:
        - theme: brand
          text: Давайте начнём
          link: /ru/get-started
        # - theme: alt
        #   text: API Examples
        #   link: /api-examples
features:
    - title: Alpha
      details: Данный проект находится в стадии разработки (хотя его уже можно использовать)
    - icon: 🔥
      title: Быстрый старт проекта
      details: Вместе с <strong>npm create gramio</strong> вы можете начать свой проект в различных конфигурациях без траты времени на нудную настройку
    - icon: ✨
      title: Легко расширяется
      details: Благодаря нашей системе плагинов и хуков
    - icon: ⚙️
      title: Используется кодо-генерация
      details: Многие части библиотеки кодо-генерируются, что позволяет обновляться быстрее
    - icon: 🛡️
      title: Строгая типизация
      details: Написана на TypeScript с любовью ❤️
    - icon: 🌐
      title: Работает в разных рантаймах
      details: <a href="https://nodejs.org/">Node.js</a>, <a href="https://bun.sh/">Bun</a> или <a href="https://deno.com/">Deno</a> – на ваш выбор
---

## Начало

Эта команда поможет вам создать ваш проект с GramIO (и ORM, Linters и Plugins) наилегчайшим путём.

::: code-group

```bash [npm]
npm create gramio ./bot
```

```bash [yarn]
yarn create gramio ./bot
```

```bash [pnpm]
pnpm create gramio ./bot
```

```bash [bun]
bun create gramio ./bot
```

```bash [deno]
TODO://
```

:::

Чтобы узнать больше, посмотрите на главу «[Давайте начнём](/get-started)».
