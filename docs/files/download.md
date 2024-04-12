# Download

The standard file download path looks like this:

-   Call `getFile` with `file_id`
-   Extract `file_path` from response
-   Construct a link of the following type https://api.telegram.org/file/bot<token>/<file_path>
-   Send request and download the requested media
-   ? Maybe save file in FS ?

but in our case it looks more convenient and simpler.

## Via context methods

```ts
bot.on("message", async (context) => {
    if (!context.document) return;
    // download to ./file-name
    await context.download(context.document.fileName || "file-name");
    // get ArrayBuffer
    const buffer = await context.download();

    return context.send("Thank you!");
});
```

> [!IMPORTANT]
> // prettier-ignore
> **One message** contain only **one attachment**. Therefore, to download an attachment, you can simply use the `context.download` method

## Via bot instance method

```ts
const chat = await bot.api.getChat({ chat_id: "@not_found" });

if (!chat.photo?.big_file_id) return;

// download to ./not_found_chat_photo.png
await bot.downloadFile(chat.photo.big_file_id, "not_found_chat_photo.png");
// get ArrayBuffer
const buffer = await bot.downloadFile(chat.photo.big_file_id);
```
