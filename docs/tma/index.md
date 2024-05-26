---
title: Telegram Mini Apps (Web app)

head:
    - - meta
      - name: "description"
        content: "Simple guide how to develop Telegram Web app"

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, api, twa, web app, mini app"
---

# Telegram Mini Apps (Web app)

Guide is WIP.

For start, we recommend [`twa.js`](https://docs.telegram-mini-apps.com/).

[Telegram documentation](https://core.telegram.org/bots/webapps)

### Scaffold monorepo

TODO

### Scaffold via [`twa.js`](https://docs.telegram-mini-apps.com/)

::: code-group

```bash [npm]
npm create @tma.js/mini-app@latest ./bot
```

```bash [yarn]
yarn create @tma.js/mini-app@latest ./bot
```

```bash [pnpm]
pnpm create @tma.js/mini-app@latest ./bot
```

```bash [bun]
bun create @tma.js/mini-app@latest ./bot
```

:::

This command will help you scaffold a project with a template that matches you from the list:

-   TypeScript
-   -   [React](https://github.com/Telegram-Mini-Apps/reactjs-template)
-   -   [Solid](https://github.com/Telegram-Mini-Apps/solidjs-template)
-   -   [Next](https://github.com/Telegram-Mini-Apps/nextjs-template)
-   JavaScript
-   -   [React](https://github.com/Telegram-Mini-Apps/reactjs-js-template)
-   -   [Solid](https://github.com/Telegram-Mini-Apps/solidjs-js-template)
