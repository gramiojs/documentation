---
name: files
description: File handling — MediaUpload (path, url, buffer, stream, text), MediaInput (media groups), download, Web API File/Blob support, and Bun.file() integration.
---

# Files

Package: `@gramio/files` (built into GramIO, also usable standalone).

## Three Ways to Send Files

1. **file_id** — pass string: `context.sendPhoto(fileId)` (no size limit, already on Telegram servers)
2. **URL** — pass string: `context.sendPhoto("https://...")` (photos 5MB, others 20MB)
3. **Upload** — use `MediaUpload`: photos 10MB, others 50MB

file_ids are unique per bot — cannot share between bots. Reuse within same bot is free.

## MediaUpload

```typescript
import { MediaUpload } from "gramio";

// From local file path
await MediaUpload.path("./photo.jpg");
await MediaUpload.path("./file.json", "custom-name.json"); // rename

// From URL (downloads then uploads)
await MediaUpload.url("https://example.com/image.png");
await MediaUpload.url(url, "name.png", { headers: { Authorization: "Bearer ..." } });

// From buffer
MediaUpload.buffer(arrayBuffer, "file.json"); // default name: "file.buffer"

// From stream
await MediaUpload.stream(readableStream, "file.png"); // default name: "file.stream"

// From text content
MediaUpload.text("file content here", "output.txt"); // default name: "text.txt"
```

### Web API Support

GramIO accepts `File` and `Blob` directly:

```typescript
context.sendDocument(new File(["content"], "file.txt", { type: "text/plain" }));
context.sendPhoto(new Blob([buffer], { type: "image/png" }));
```

### Bun.file() Integration

```typescript
context.sendDocument(Bun.file("./data.json"));
```

## MediaInput (for sendMediaGroup)

```typescript
import { MediaInput, MediaUpload } from "gramio";

context.sendMediaGroup([
    MediaInput.photo(MediaUpload.path("./photo1.jpg"), {
        caption: "First photo",
        has_spoiler: true,
    }),
    MediaInput.photo(MediaUpload.url("https://example.com/photo.jpg")),
    MediaInput.video(MediaUpload.path("./video.mp4"), {
        thumbnail: MediaUpload.path("./thumb.jpg"),
    }),
]);
```

Available constructors:
- `MediaInput.photo(file, options?)`
- `MediaInput.video(file, options?)` — supports `thumbnail`
- `MediaInput.audio(file, options?)`
- `MediaInput.document(file, options?)`
- `MediaInput.animation(file, options?)`

## Download

```typescript
// Via context — auto-detects attachment type
const filePath = await context.download("saved-photo.jpg"); // saves to disk
const buffer = await context.download(); // returns ArrayBuffer

// Via bot instance — by file_id
const filePath = await bot.downloadFile(fileId, "output.png");
const buffer = await bot.downloadFile(fileId); // returns ArrayBuffer
```

<!--
Source: https://gramio.dev/files/
-->
