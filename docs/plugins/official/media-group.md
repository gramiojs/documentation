# Media group plugin

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/media-group?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/media-group)
[![JSR](https://jsr.io/badges/@gramio/media-group)](https://jsr.io/@gramio/media-group)
[![JSR Score](https://jsr.io/badges/@gramio/media-group/score)](https://jsr.io/@gramio/media-group)

</div>

This plugin collects `mediaGroup` from messages (**1** attachment = **1** message) using a **delay** if `mediaGroupId` is in the **MessageContext**, pass only **first** message further down the middleware chain with the `mediaGroup` key, which contains an **array** of messages of this **mediaGroup** (it also contains the **first** message).

```ts
import { Bot } from "gramio";
import { mediaGroup } from "@gramio/media-group";

const bot = new Bot(process.env.TOKEN as string)
    .extend(mediaGroup())
    .on("message", async (context) => {
        if (!context.mediaGroup) return;

        return context.send(
            `Caption from the first message - ${context.caption}. MediaGroup contains ${context.mediaGroup.length} attachments`
        );
    })
    .onStart(({ info }) => console.log(`✨ Bot ${info.username} was started!`));

bot.start();
```

### Installation

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

### Setup

You can change the duration of the delay in milliseconds by simply passing it like this:

```typescript
const bot = new Bot(process.env.TOKEN!)
    .extend(mediaGroup(1000)) // wait 1 second for message with mediaGroupId (refreshed after new message with it)
    .on("message", async (context) => {
        if (!context.mediaGroup) return;

        return context.send(
            `Caption from the first message - ${context.caption}. MediaGroup contains ${context.mediaGroup.length} attachments`
        );
    })
    .onStart(({ info }) => console.log(`✨ Bot ${info.username} was started!`));

bot.start();
```

By default it `150 ms`.
