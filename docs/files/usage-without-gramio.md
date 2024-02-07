# Usage without GramIO

## Write you own type-safe TBA API wrapper with File uploading support!

```ts
import type { ApiMethods, TelegramAPIResponse } from "@gramio/types";
import { isMediaUpload, convertJsonToFormData } from "@gramio/files";
import { FormDataEncoder } from "form-data-encoder";

const TBA_BASE_URL = "https://api.telegram.org/bot";
const TOKEN = "";

const api = new Proxy({} as ApiMethods, {
    get:
        <T extends keyof ApiMethods>(_target: ApiMethods, method: T) =>
        (params: Parameters<ApiMethods[T]>[0]) => {
            const reqOptions: RequestInit = {
                method: "POST",
                duplex: "half",
            };

            if (isMediaUpload(method, params)) {
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
            if (!data.ok) throw new APIError({ method, params }, data);

            return data.result;
        },
});
```
