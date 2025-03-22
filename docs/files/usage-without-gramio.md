---
title: Using file handling without GramIO - Create your own type-safe wrapper

head:
    - - meta
      - name: "description"
        content: "Learn how to create your own type-safe Telegram Bot API wrapper with file uploading support. This guide shows how to use GramIO's file utilities independently."

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, file upload, custom wrapper, standalone implementation, type-safe wrapper, FormData handling, API proxy, file utilities, independent usage"
---

# Usage without GramIO

## Write your own type-safe Telegram Bot API wrapper with file uploading support!

```ts twoslash
// @noErrors
import type {
    APIMethods,
    APIMethodParams,
    TelegramAPIResponse,
} from "@gramio/types";
import { isMediaUpload, convertJsonToFormData } from "@gramio/files";

const TBA_BASE_URL = "https://api.telegram.org/bot";
const TOKEN = "";

const api = new Proxy({} as APIMethods, {
    get:
        <T extends keyof APIMethods>(_target: APIMethods, method: T) =>
        async (params: APIMethodParams<T>) => {
            const reqOptions: Parameters<typeof fetch>[1] = {
                method: "POST",
            };

            if (params && isMediaUpload(method, params)) {
                const formData = await convertJsonToFormData(method, params);

                reqOptions.body = formData;
            } else {
                reqOptions.headers = {
                    "Content-Type": "application/json",
                };
                reqOptions.body = JSON.stringify(params);
            }

            const response = await fetch(
                `${TBA_BASE_URL}${TOKEN}/${method}`,
                reqOptions
            );

            const data = (await response.json()) as TelegramAPIResponse;
            if (!data.ok) throw new Error(`Some error in ${method}`);

            return data.result;
        },
});
```
