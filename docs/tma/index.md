---
title: Telegram Mini Apps (Web app)

head:
    - - meta
      - name: "description"
        content: "Simple guide how to develop Telegram Web app"

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, api, twa, web app, mini app, mkcert"
---

# Telegram Mini Apps (Web app)

Guide is WIP.

For start, we recommend [`Telegram apps (tma.js)`](https://docs.telegram-mini-apps.com/).

[Telegram documentation](https://core.telegram.org/bots/webapps) | [Figma UI Kit](https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-Library?type=design&node-id=26%3A1081&mode=design&t=Sck9CgzgyKz3iIFt-1) | [Telegram Developers Community](https://t.me/devs)

## Scaffold monorepo

With [create-gramio](https://github.com/gramiojs/create-gramio) you can easily start developing Telegram mini app in monorepo. You can start a project with [tma.js](https://docs.telegram-mini-apps.com/), [Elysiajs](https://elysiajs.com/) and GramIO in a minute!

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

:::

and choose the type of project you need!

For example, this is what a monorepo created using [create-gramio](https://github.com/gramiojs/create-gramio) looks like

```bash [tree]
├── apps
│   ├── bot
│   ├── mini-app
│   └── server
└── packages
    └── db
```

### Scaffold via [`Telegram apps (tma.js)`](https://docs.telegram-mini-apps.com/)

::: code-group

```bash [npm]
npm create @telegram-apps/mini-app@latest ./bot
```

```bash [yarn]
yarn create @telegram-apps/mini-app@latest ./bot
```

```bash [pnpm]
pnpm create @telegram-apps/mini-app@latest ./bot
```

```bash [bun]
bun create @telegram-apps/mini-app@latest ./bot
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

> [!WARNING]
> At the moment, `create-gramio`'s monorepo support may not be ideal (not the most convenient out of the box). because it's difficult to support these two creation options at the same time.

## HTTPS on localhost

BotFather only accepts **http://** links and getting into the **test environment** can be problematic, so let's figure out how to work with **https://** and **localhost**.

1. First you need to install [mkcert](https://github.com/FiloSottile/mkcert):

::: code-group

```bash [Windows]
choco install mkcert
# or with Scoop
scoop bucket add extras
scoop install mkcert
```

```bash [macOS]
brew install mkcert
brew install nss # if you use Firefox
```

```bash [Linux]
sudo apt install libnss3-tools
brew install mkcert
```

:::

2. Then you need to create a local certificate for the custom hostname and instal it:

```bash
mkcert mini-app.local
mkcert --install
```

3. Add the custom hostname to your hosts file:

::: code-group

```powershell [Windows (Open terminal as an administrator)]
echo "127.0.0.1 mini-app.local" >> C:\Windows\System32\drivers\etc\hosts
```

```bash [macOS | Linux]
sudo echo "127.0.0.1 mini-app.local" >> /etc/hosts
```

:::

4. Configure it in `vite.config.ts`

```ts
import fs from "node:fs";
import { defineConfig } from "vite";

export default defineConfig({
    server: {
        port: 443,
        host: "0.0.0.0",
        hmr: {
            host: "mini-app.local",
            port: 443,
        },
        https: {
            key: fs.readFileSync("./mini-app.local-key.pem"),
            cert: fs.readFileSync("./mini-app.local.pem"),
        },
    },
});
```

🔥 Now you don't need any tunnels and you are happy to develop with HMR in the telegram production environment!

![](/tma-https-on-localhost.png)
