---
title: Скачивание файлов - Получение медиа с серверов Telegram

head:
    - - meta
      - name: "description"
        content: "Узнайте, как скачивать файлы с серверов Telegram с помощью GramIO. Пошаговое руководство от получения file_id до загрузки файла."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, скачивание файлов, file_id, file_path, getFile, загрузка медиа, скачивание изображений, скачивание документов, получение файлов, API токен, HTTP-запросы к API, скачивание фото, скачивание видео, документы Telegram, media download"
---

# Скачивание

Стандартный путь скачивания файлов выглядит так:

-   Вызвать `getFile` с параметром `file_id`
-   Извлечь `file_path` из ответа
-   Составить ссылку следующего вида `https://api.telegram.org/file/bot<token>/<file_path>`
-   Отправить запрос и скачать запрашиваемый медиафайл
-   ? Возможно, сохранить файл в файловой системе ?

но в нашем случае это выглядит более удобно и проще.

## Через методы контекста

```ts
bot.on("message", async (context) => {
    if (!context.document) return;
    // скачать в ./file-name
    await context.download(context.document.fileName || "file-name");
    // получить ArrayBuffer
    const buffer = await context.download();

    return context.send("Спасибо!");
});
```

> [!IMPORTANT]
>
> **Одно сообщение** содержит только **одно вложение**. Поэтому для скачивания вложения можно просто использовать метод `context.download`
> Но вы можете работать с медиагруппами, используя плагин [media-group](/ru/plugins/official/media-group) и итерацию по массиву `context.mediaGroup`.

## Через метод экземпляра бота

```ts
const chat = await bot.api.getChat({ chat_id: "@not_found" });

if (!chat.photo?.big_file_id) return;

// скачать в ./not_found_chat_photo.png
await bot.downloadFile(chat.photo.big_file_id, "not_found_chat_photo.png");
// получить ArrayBuffer
const buffer = await bot.downloadFile(chat.photo.big_file_id);
```
