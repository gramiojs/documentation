# onStart

This hook called when the bot is `started`.

## Parameters

```ts
{
		plugins: string[];
		info: TelegramUser;
		updatesFrom: "webhook" | "long-polling";
}
```

-   plugins - array of plugins
-   info - bot account info
-   updatesFrom - webhook/polling

## Example

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string).onStart(
    ({ plugins, info, updatesFrom }) => {
        console.log(`plugin list - ${plugins.join(", ")}`);
        console.log(`bot username is @${info.username}`);
        console.log(`updates from ${updatesFrom}`);
    }
);

bot.start();
```
