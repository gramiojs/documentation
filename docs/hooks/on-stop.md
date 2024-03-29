# onStop

This hook called when the bot stops.

## Parameters

```ts
{
		plugins: string[];
		info: TelegramUser;
}
```

-   plugins - array of plugins
-   info - bot account info

## Example

```ts twoslash
// @noErrors
import { Bot } from "gramio";

const bot = new Bot(process.env.TOKEN!).onStop(
    ({ plugins, info, updatesFrom }) => {
        console.log(`plugin list - ${plugins.join(", ")}`);
        console.log(`bot username is @${info.username}`);
    }
);

bot.start();
bot.stop();
```
