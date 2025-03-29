---
title: Работа с файлами без GramIO - Создайте свою типо-безопасную обертку

head:
    - - meta
      - name: "description"
        content: "Узнайте, как создать свою собственную типо-безопасную обертку для Telegram Bot API с поддержкой загрузки файлов. Это руководство показывает, как использовать утилиты для работы с файлами GramIO независимо."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, загрузка файлов, собственная обертка, самостоятельная реализация, типобезопасность, обработка FormData, прокси API, утилиты для файлов, независимое использование, APIMethods, TelegramAPIResponse, isMediaUpload, convertJsonToFormData, типы запросов, загрузка изображений, разработка API"
---

# Использование без GramIO

## Напишите свою собственную типо-безопасную обертку для Telegram Bot API с поддержкой загрузки файлов!

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
            if (!data.ok) throw new Error(`Произошла ошибка в ${method}`);

            return data.result;
        },
});
```
