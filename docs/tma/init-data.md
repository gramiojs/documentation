# Init data

WIP

## Elysia integration example

```ts twoslash
import { validateAndParseInitData } from "@gramio/init-data";
import { Elysia } from "elysia";

const authElysia = new Elysia()
    .derive(({ headers, error }) => {
        const initData = headers["x-init-data"];
        if (!initData) return error("Unauthorized");

        const result = validateAndParseInitData(
            initData,
            process.env.TOKEN as string
        );
        if (!result || !result.user) return error("Unauthorized");

        return {
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
