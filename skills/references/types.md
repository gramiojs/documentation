---
name: types
description: "@gramio/types — standalone, auto-published Telegram Bot API TypeScript definitions. APIMethods, APIMethodReturn, APIMethodParams, Proxy-based custom wrapper, versioning, @gramio/keyboards integration."
---

# @gramio/types

> Code-generated, auto-published Telegram Bot API type definitions.

```bash
npm install @gramio/types
```

Versioning mirrors the Bot API: `7.7.x` types correspond to Bot API 7.7. Updated automatically via CI/CD.

## Core Type Helpers

```typescript
import type { APIMethods, APIMethodReturn, APIMethodParams } from "@gramio/types";

type SendMessageReturn = Awaited<ReturnType<APIMethods["sendMessage"]>>;
// => TelegramMessage

type GetMeReturn = APIMethodReturn<"getMe">;
// => TelegramUser

type SendMessageParams = APIMethodParams<"sendMessage">;
// => { chat_id, text, parse_mode?, ... }
```

## Imports

- `@gramio/types` — re-exports everything
- `@gramio/types/methods` — `APIMethods` (API function signatures)
- `@gramio/types/objects` — Telegram-prefixed objects (e.g. `TelegramUpdate`, `TelegramUser`)
- `@gramio/types/params` — parameter types used in methods

## Custom Bot API Wrapper (Proxy)

Build a type-safe wrapper without the full GramIO framework:

```typescript
import type { APIMethods, APIMethodParams, TelegramAPIResponse } from "@gramio/types";

const TBA_BASE_URL = "https://api.telegram.org/bot";
const TOKEN = process.env.BOT_TOKEN as string;

const api = new Proxy({} as APIMethods, {
    get:
        <T extends keyof APIMethods>(_target: APIMethods, method: T) =>
        async (params: APIMethodParams<T>) => {
            const response = await fetch(`${TBA_BASE_URL}${TOKEN}/${method}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(params),
            });
            const data = (await response.json()) as TelegramAPIResponse;
            if (!data.ok) throw new Error(`Error in ${method}`);
            return data.result;
        },
});

await api.sendMessage({ chat_id: 1, text: "Hello!" });
```

## With @gramio/keyboards

The custom wrapper works seamlessly with standalone keyboard builders:

```typescript
import { Keyboard } from "@gramio/keyboards";

await api.sendMessage({
    chat_id: 1,
    text: "Pick an option",
    reply_markup: new Keyboard().text("Option A"),
});
```

## Declaration Merging

Extend types for custom Bot API server methods:

```typescript
declare module "@gramio/types" {
    export interface APIMethods {
        myCustomMethod: {
            params: { chat_id: string; text: string };
            return: string;
        };
    }
}
```

Override `@gramio/types` version via `package.json` `"overrides"` for newer Bot API versions before an official release.

<!--
Source: https://gramio.dev/types
-->
