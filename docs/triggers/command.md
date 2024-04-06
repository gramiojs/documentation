# Command

> [!IMPORTANT]
> No need to starts with `/`

> [!IMPORTANT]
> The trigger is triggered on `/start@name_bot` as well

```ts
new Bot().command("start", (context) => {
    return context.send(`Hi!`);
});
```
