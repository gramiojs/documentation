# Hears

`hears`

```ts
new Bot().hears(/regular expression with (.*)/i, async (context) => {
    if (context.args) await context.send(`Params ${context.args[1]}`);
});
```

```ts
new Bot().hears("text-trigger", async (context) => {});
```

```ts
new Bot().hears(
    (context) => context.user.role === "admin",
    async (context) => {}
);
```
