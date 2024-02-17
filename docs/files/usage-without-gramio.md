# Usage without GramIO

## Write you own type-safe Telegram Bot API wrapper with File uploading support!

```ts twoslash
// @noErrors
import type {
    APIMethods,
    APIMethodParams,
    TelegramAPIResponse,
} from "@gramio/types";
import { fetch, type RequestInit } from "undici";
import { isMediaUpload, convertJsonToFormData } from "@gramio/files";
import { FormDataEncoder } from "form-data-encoder";

const TBA_BASE_URL = "https://api.telegram.org/bot";
const TOKEN = "";

const api = new Proxy({} as APIMethods, {
    get:
        <T extends keyof APIMethods>(_target: APIMethods, method: T) =>
        async (params: APIMethodParams<T>) => {
            const reqOptions: RequestInit = {
                method: "POST",
                duplex: "half",
            };

            if (params && isMediaUpload(method, params)) {
                const formData = await convertJsonToFormData(method, params);

                const encoder = new FormDataEncoder(formData);

                reqOptions.body = encoder.encode();
                reqOptions.headers = encoder.headers;
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
