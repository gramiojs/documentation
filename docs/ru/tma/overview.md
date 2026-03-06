---
title: Telegram Mini Apps с GramIO - Разработка веб-приложений внутри мессенджера

head:
    - - meta
      - name: "description"
        content: "Полное руководство по созданию, тестированию и запуску Telegram Mini Apps (ранее Web Apps) с использованием GramIO. Узнайте, как интегрировать веб-приложения с вашим ботом и использовать все возможности платформы."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, Telegram Mini Apps, Web Apps, мини-приложения телеграм, разработка TMA, tma.js, WebAppData, WebAppInfo, WebAppInitData, валидация веб-приложений, локальная разработка TMA, HTTPS для разработки, mkcert, Telegram WebView, встроенные веб-приложения, WebAppButton, Main Button, Back Button, URL форматы TMA, проверка подписи, веб-приложения в ботах"
---

# Telegram Mini Apps (Web app)

> 🚧 Это руководство в процессе разработки 🚧

Данное руководство поможет вам начать разработку Telegram Mini Apps.

Для более подробного руководства рекомендуем обратиться к [Telegram apps (tma.js)](https://docs.telegram-mini-apps.com/).

Дополнительные ресурсы:
- [Документация Telegram](https://core.telegram.org/bots/webapps)
- [Figma UI Kit](https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-Library?type=design&node-id=26%3A1081&mode=design&t=Sck9CgzgyKz3iIFt-1)
- [Сообщество разработчиков Telegram](https://t.me/devs)

## Создание проекта с помощью create-gramio

[create-gramio](https://github.com/gramiojs/create-gramio) — это мощный инструмент для создания проектов Telegram Mini App. Он поддерживает различные конфигурации проектов и легко интегрируется с GramIO.

Вы можете быстро настроить:
- Отдельный Telegram бот
- Монорепозиторий с Mini App + Bot
- Полноценный монорепозиторий с Mini App + Bot + Elysia (бэкенд фреймворк)
  > Примечание: Этот вариант доступен только с [bun](https://bun.sh/) (альтернатива среде выполнения Node.js) из-за требований фреймворка Elysia

### Установка

Выберите предпочитаемый менеджер пакетов:

::: pm-create gramio@latest ./bot
:::

### Параметры настройки проекта

При запуске команды установки вы пройдете через ряд подсказок:

1. **Выбор типа проекта**:
   - Bot (отдельный бот)
   - Mini App + Bot + Elysia (фреймворк для бэкенда) монорепозиторий
   - Mini App + Bot монорепозиторий

2. **Для проектов с монорепозиторием**:
   - Вам будет предложено выбрать шаблон Mini App из опций `@telegram-apps/create-mini-app`
   - Если выбрана опция Elysia, вы также настроите бэкенд на Elysia

3. **Конфигурация фреймворка для бота**:
   - Выберите предпочитаемую базу данных (без БД, Prisma, Drizzle)
   - Выберите инструменты разработки (ESLint, Biome)
   - Настройте дополнительные функции (i18n, Redis, аналитика PostHog и т.д.)

### Структура монорепозитория

Когда вы создаете проект с монорепозиторием, структура вашего каталога будет выглядеть так:

```bash [tree]
├── apps
│   ├── bot         # Ваше приложение бота GramIO
│   ├── mini-app    # Фронтенд Telegram Mini App
│   └── server      # Серверная часть (если используется опция Elysia)
└── packages
    └── db          # Общий пакет базы данных (если выбран)
```


### Использование [Telegram apps (tma.js)](https://docs.telegram-mini-apps.com/) напрямую

В качестве альтернативы вы можете создать только часть Mini App с помощью `@telegram-apps/create-mini-app`:

::: pm-create @telegram-apps/mini-app@latest ./miniapp
:::

Эта команда поможет вам создать проект с шаблоном из следующих вариантов:

-   TypeScript
    -   [React](https://github.com/Telegram-Mini-Apps/reactjs-template)
    -   [Solid](https://github.com/Telegram-Mini-Apps/solidjs-template)
    -   [Next](https://github.com/Telegram-Mini-Apps/nextjs-template)
-   JavaScript
    -   [React](https://github.com/Telegram-Mini-Apps/reactjs-js-template)
    -   [Solid](https://github.com/Telegram-Mini-Apps/solidjs-js-template)

> [!WARNING]
> На данный момент поддержка монорепозитория в `create-gramio` может быть не идеальной (не самой удобной из коробки),
поскольку сложно поддерживать эти два варианта создания одновременно.

## HTTPS на localhost

BotFather принимает только ссылки **http://** для продакшена, но для получения вашего приложения в **тестовой среде** требуется HTTPS. Вот как настроить HTTPS на localhost:

1. Сначала установите [mkcert](https://github.com/FiloSottile/mkcert):

::: code-group

```bash [Windows]
choco install mkcert
# или с помощью Scoop
scoop bucket add extras
scoop install mkcert
```

```bash [macOS]
brew install mkcert
brew install nss # если вы используете Firefox
```

```bash [Linux]
sudo apt install libnss3-tools
brew install mkcert
```

:::

2. Создайте локальный сертификат для вашего пользовательского имени хоста и установите его:

```bash
mkcert mini-app.local
mkcert --install
```

3. Добавьте пользовательское имя хоста в файл hosts:

::: code-group

```powershell [Windows (откройте терминал от имени администратора)]
echo "127.0.0.1 mini-app.local" >> C:\Windows\System32\drivers\etc\hosts
```

```bash [macOS | Linux]
sudo echo "127.0.0.1 mini-app.local" >> /etc/hosts
```

:::

4. Настройте его в `vite.config.ts`:

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

🔥 Теперь вам не нужны никакие туннели, и вы можете с удовольствием разрабатывать с HMR в производственной среде Telegram!

![](/tma-https-on-localhost.png) 