# Context

## Listen to all events

```ts
bot.use((context, next) => {
    // ...
});
```

## Listen only to specific events

```ts
bot.on("message", (context, next) => {
    // ...
});
// or
bot.on(["message", "callback_query"], (context, next) => {
    // ...
});
```

You can read API Reference for contexts [here](https://jsr.io/@gramio/contexts/doc).
