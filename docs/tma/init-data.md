# Init data

`@gramio/init-data` is a TypeScript library for securely validating, parsing, and generating Telegram Web App init data strings. It provides a set of utilities to help you work with the Telegram Mini App authentication init data, ensuring the integrity and authenticity of user data passed from the Telegram client to your backend. The library is framework-agnostic.

Key features:

-   Validates the authenticity of Telegram Web App init data using your bot token
-   Parses and exposes structured user and chat data from the init data string
-   Generates valid init data strings for testing and documentation
-   Provides strong TypeScript types for all data structures and methods

[Reference](https://jsr.io/@gramio/init-data@0.0.1/doc)

### Installation

::: code-group

```bash [npm]
npm install @gramio/init-data
```

```bash [yarn]
yarn add @gramio/init-data
```

```bash [pnpm]
pnpm add @gramio/init-data
```

```bash [bun]
bun install @gramio/init-data
```

:::

# getBotTokenSecretKey

Get a secret key from your Telegram bot token. This secret key is required to validate the hash of the init data string sent by the Telegram Web App. Always use this method to generate the secret key before validating or signing init data if you wants reach maximum performance. If you don't provide it to validate init data methods it will execute it on **every call**.

```ts
import { getBotTokenSecretKey } from "@gramio/init-data";

const botToken = process.env.BOT_TOKEN as string;
const secretKey = getBotTokenSecretKey(botToken);
// use it later
```

# validateAndParseInitData

Verifies the authenticity of the Telegram Web App init data string using the secret key or bot token. If the data is valid, it parses and returns the [WebAppInitData](https://core.telegram.org/bots/webapps#webappinitdata) object. If the data is invalid, it returns `false`.

```ts
import {
    validateAndParseInitData,
    getBotTokenSecretKey,
} from "@gramio/init-data";

const botToken = process.env.BOT_TOKEN as string;
const secretKey = getBotTokenSecretKey(botToken);

const initData = req.headers["x-init-data"] as string;
const result = validateAndParseInitData(initData, secretKey);

if (!result) {
    // Handle invalid or tampered data
}

// Access user and chat data
const userId = result.user?.id;
const chatId = result.chat?.id;
```

# validateInitData

Checks the authenticity of the Telegram Web App init data string using the secret key or bot token. Returns `true` if the data is valid, otherwise returns `false`. This method only validates the data and does **not parse** it. Use this when you only need to check authenticity without extracting user or chat information.

```ts
import { validateInitData, getBotTokenSecretKey } from "@gramio/init-data";

const botToken = process.env.BOT_TOKEN as string;
const secretKey = getBotTokenSecretKey(botToken);

const initData = req.headers["x-init-data"] as string;
const isValid = validateInitData(initData, secretKey);

if (!isValid) {
    // Handle invalid or tampered data
}
// If valid, you can safely trust the init data string
```

# parseInitData

Parses the Telegram Web App init data string and returns the [WebAppInitData](https://core.telegram.org/bots/webapps#webappinitdata) object. This method does not perform any validation or authenticity checks. Use it only if you have already verified the data with `validateInitData` or `validateAndParseInitData`.

```ts
import { parseInitData } from "@gramio/init-data";

const initData = req.headers["x-init-data"] as string;
const parsed = parseInitData(initData);

// Access user and chat data
const userId = parsed.user?.id;
const chatId = parsed.chat?.id;
```

# signInitData

Generates a valid init data string from a data object and a secret key or bot token. This is useful for testing, documentation, or generating example values for API clients.

```ts
import {
    signInitData,
    getBotTokenSecretKey,
    type WebAppUser,
} from "@gramio/init-data";

const botToken = process.env.BOT_TOKEN as string;
const secretKey = getBotTokenSecretKey(botToken);

const data = {
    user: {
        id: 1,
        first_name: "durov",
        username: "durov",
    },
} satisfies WebAppUser;

const signedInitData = signInitData(data, secretKey);
// Use signedInitData as a valid init data string for testing
```

# Example: Elysia integration

You can use `@gramio/init-data` in any backend framework. Here is a bonus example of integrating it with Elysia for type-safe authentication:

```ts
twoslash;
import {
    validateAndParseInitData,
    signInitData,
    getBotTokenSecretKey,
} from "@gramio/init-data";
import { Elysia, t } from "elysia";

const secretKey = getBotTokenSecretKey(process.env.BOT_TOKEN as string);

export const authElysia = new Elysia({
    name: "auth",
})
    .guard({
        headers: t.Object({
            "x-init-data": t.String({
                examples: [
                    signInitData(
                        {
                            user: {
                                id: 1,
                                first_name: "durov",
                                username: "durov",
                            },
                        },
                        secretKey
                    ),
                ],
            }),
        }),
        response: {
            401: t.Literal("UNAUTHORIZED"),
        },
    })
    .resolve(({ headers, error }) => {
        const result = validateAndParseInitData(
            headers["x-init-data"],
            secretKey
        );
        if (!result || !result.user)
            return error("Unauthorized", "UNAUTHORIZED");

        return {
            tgId: result.user.id,
            user: result.user,
        };
    })
    .as("plugin");

const app = new Elysia()
    .get("hello", "world")
    .use(authElysia)
    .get("/user", ({ user }) => {
        user;
        // ^?
    });
```
