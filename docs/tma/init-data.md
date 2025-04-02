# Init data

WIP

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

## Elysia integration example

This example shows how to integrate `@gramio/init-data` with Elysia via convenient plugin with type safety.

`examples` at `x-init-data` header is valid generated init-data which allows you to more easily test your API in OpenAPI Client.

```ts twoslash
import { validateAndParseInitData } from "@gramio/init-data";
import { Elysia } from "elysia";

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
            config.BOT_TOKEN
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
