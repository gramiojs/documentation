---
title: Плагин медиа-групп для GramIO

head:
    - - meta
      - name: "description"
        content: "Самый простой способ обработки медиа-групп (альбомов) в Telegram Bot API"

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, плагин медиа-групп, обработка альбомов, media_group_id, группы фотографий, отправка нескольких фото, отправка нескольких видео, объединение медиа в альбом, создание альбомов, загрузка альбома, отправка группы медиа, дубликаты обновлений, обработка коллекций фото"
---

# Плагин медиа-групп

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/media-group?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/media-group)
[![JSR](https://jsr.io/badges/@gramio/media-group)](https://jsr.io/@gramio/media-group)
[![JSR Score](https://jsr.io/badges/@gramio/media-group/score)](https://jsr.io/@gramio/media-group)

</div>

Этот плагин собирает `mediaGroup` из сообщений (**1** вложение = **1** сообщение), используя **задержку**, если `mediaGroupId` присутствует в **MessageContext**. Далее плагин передает только **первое** сообщение по цепочке обработчиков с ключом `mediaGroup`, содержащим **массив** всех сообщений этой **mediaGroup** (включая **первое** сообщение).

```ts
import { Bot } from "gramio";
import { mediaGroup } from "@gramio/media-group";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(mediaGroup())
    .on("message", async (context) => {
        if (!context.mediaGroup) return;

        return context.send(
            `Подпись из первого сообщения - ${context.caption}. Медиа-группа содержит ${context.mediaGroup.length} вложений`
        );
    })
    .onStart(({ info }) => console.log(`✨ Бот ${info.username} запущен!`));

bot.start();
```

### Установка

::: code-group

```bash [npm]
npm install @gramio/media-group
```

```bash [yarn]
yarn add @gramio/media-group
```

```bash [pnpm]
pnpm add @gramio/media-group
```

```bash [bun]
bun install @gramio/media-group
```

:::

### Настройка

Вы можете изменить время задержки в миллисекундах, просто указав его при вызове:

```typescript
const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(mediaGroup(1000)) // ждём 1 секунду сообщений с mediaGroupId (обновляется с каждым новым сообщением)
    .on("message", async (context) => {
        if (!context.mediaGroup) return;

        return context.send(
            `Подпись из первого сообщения - ${context.caption}. Медиа-группа содержит ${context.mediaGroup.length} вложений`
        );
    })
    .onStart(({ info }) => console.log(`✨ Бот ${info.username} запущен!`));

bot.start();
```

По умолчанию это `150 мс`. 