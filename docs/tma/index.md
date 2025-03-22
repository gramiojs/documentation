---
title: Telegram Mini Apps (Web app)

head:
    - - meta
      - name: "description"
        content: "Simple guide on how to develop Telegram Mini Apps"

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, api, twa, web app, mini app, mkcert"
---

# Telegram Mini Apps (Web app)

> 🚧 This guide is WIP 🚧

This guide will help you get started with Telegram Mini Apps development.

For a comprehensive guide, we recommend [Telegram apps (tma.js)](https://docs.telegram-mini-apps.com/).

Additional resources:
- [Telegram documentation](https://core.telegram.org/bots/webapps)
- [Figma UI Kit](https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-Library?type=design&node-id=26%3A1081&mode=design&t=Sck9CgzgyKz3iIFt-1)
- [Telegram Developers Community](https://t.me/devs)

## Scaffold project with create-gramio

[create-gramio](https://github.com/gramiojs/create-gramio) is a powerful tool for scaffolding your Telegram Mini App projects. It supports multiple project configurations and integrates seamlessly with GramIO.

You can quickly set up:
- A standalone Telegram bot
- A monorepo with Mini App + Bot
- A full-stack monorepo with Mini App + Bot + Elysia backend
  > Note: This option is only available with [bun](https://bun.sh/) (alternative to Node.js runtime) due to Elysia framework requirements

### Installation

Choose your preferred package manager:

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

### Project Setup Options

When running the installation command, you'll be guided through a series of prompts:

1. **Project Type Selection**:
   - Bot (standalone bot)
   - Mini App + Bot + Elysia (backend framework) monorepo
   - Mini App + Bot monorepo

2. **For Monorepo Projects**:
   - You'll be prompted to select a Mini App template from the `@telegram-apps/create-mini-app` options
   - If choosing the Elysia option, you'll set up an Elysia backend as well

3. **Bot Framework Configuration**:
   - Choose your preferred database (none, Prisma, Drizzle)
   - Select development tools (ESLint, Biome)
   - Configure additional features (i18n, Redis, PostHog analytics, etc.)

### Monorepo Structure

When you create a monorepo project, your directory structure will look like:

```tree
├── apps
│   ├── bot         # Your GramIO bot application
│   ├── mini-app    # Telegram Mini App frontend
│   └── server      # Backend server (if using Elysia option)
└── packages
    └── db          # Shared database package (if selected)
```


### Using [Telegram apps (tma.js)](https://docs.telegram-mini-apps.com/)
 Directly

Alternatively, you can scaffold just the Mini App part using `@telegram-apps/create-mini-app`:

::: code-group

```bash [npm]
npm create @telegram-apps/mini-app@latest ./miniapp
```

```bash [yarn]
yarn create @telegram-apps/mini-app@latest ./miniapp
```

```bash [pnpm]
pnpm create @telegram-apps/mini-app@latest ./miniapp
```

```bash [bun]
bun create @telegram-apps/mini-app@latest ./miniapp
```

:::

This command will help you scaffold a project with a template from these options:

-   TypeScript
    -   [React](https://github.com/Telegram-Mini-Apps/reactjs-template)
    -   [Solid](https://github.com/Telegram-Mini-Apps/solidjs-template)
    -   [Next](https://github.com/Telegram-Mini-Apps/nextjs-template)
-   JavaScript
    -   [React](https://github.com/Telegram-Mini-Apps/reactjs-js-template)
    -   [Solid](https://github.com/Telegram-Mini-Apps/solidjs-js-template)

> [!WARNING]
> At the moment, `create-gramio`'s monorepo support may not be ideal (not the most convenient out of the box). 
because it's difficult to support these two creation options at the same time.

## HTTPS on localhost

BotFather only accepts **http://** links for production, but getting your app into the **test environment** requires HTTPS. Here's how to set up HTTPS on localhost:

1. First, install [mkcert](https://github.com/FiloSottile/mkcert):

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

2. Create a local certificate for your custom hostname and install it:

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

4. Configure it in `vite.config.ts`:

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
