# Lazy-load plugins

Plugins can be **lazy-loaded** if they are in an **asynchronous** function. Such plugins are always connected at the very **last** moment (during the **.start** call). If you want to call it **earlier**, put **await** in front of it.

## Example

```ts
const bot = new Bot(process.env.TOKEN as string)
    .extend(autoload()) // autoload is async
    .command("start", () => {
        // this command registered BEFORE than autoload
    });

bot.start(); // autoload is loaded here
```

You can fix that with **await**.

```ts
const bot = new Bot(process.env.TOKEN as string)
    .extend(await autoload()) // autoload is async but we await it
    .command("start", () => {
        // this command registered AFTER than autoload
    });

bot.start();
```

for now it works as expected!
