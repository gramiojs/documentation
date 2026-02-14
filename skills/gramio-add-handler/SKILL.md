---
description: Add a new command, event, or callback handler to a GramIO bot with proper typing, context usage, and best practices.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Add GramIO Handler

You are adding a new handler to an existing GramIO bot project.

## Arguments

The user provides what kind of handler they need, e.g.:
- `/gramio-add-handler command /settings` — a new `/settings` command
- `/gramio-add-handler callback approve_*` — a callback query handler
- `/gramio-add-handler hears "hello"` — a text pattern handler

## Handler Types

### Command Handler
```typescript
bot.command("commandname", (context) => {
    // context.args — command arguments after /commandname
    return context.send("Response text");
});
```

### Hears (Text Pattern)
```typescript
bot.hears(/pattern|text/, (context) => {
    return context.send("Matched!");
});
```

### Callback Query
```typescript
bot.callbackQuery("callback_data", (context) => {
    // context.data — the callback data string
    return context.answer("Callback processed!");
});
```

### Inline Query
```typescript
bot.inlineQuery(/pattern/, (context) => {
    return context.answer([
        {
            type: "article",
            id: "1",
            title: "Result",
            input_message_content: {
                message_text: "Selected result",
            },
        },
    ]);
});
```

### Reaction Handler
```typescript
bot.reaction("👍", (context) => {
    return context.reply("Thanks for the reaction!");
});
```

### Generic Update Handler
```typescript
bot.on("message", (context) => {
    // Handles all messages
});
```

## Steps

1. **Read the existing bot code** — find the main bot file (usually `src/index.ts` or similar).

2. **Determine handler type** from the user's request.

3. **Add the handler** to the bot chain, before `.start()`:
   - Place it logically near similar handlers.
   - Use proper TypeScript types.
   - Include keyboard responses if the handler needs them.

4. **If the handler needs session/state**, check if `@gramio/session` is installed:
   ```typescript
   import { sessionPlugin } from "@gramio/session";
   // ensure bot.extend(sessionPlugin(...)) is called
   ```

5. **If the handler needs scenes** (multi-step flows), check if `@gramio/scenes` is installed.

6. **Show the user** the added code and suggest testing with the bot.
