import { Bot, MediaUpload, MediaInput } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

// Upload from file path — returns Promise<File>, so await it
bot.command("photo_path", async (context) => {
    return context.sendPhoto(await MediaUpload.path("./photo.jpg"));
});

// Upload from URL — also async
bot.command("photo_url", async (context) => {
    return context.sendPhoto(
        await MediaUpload.url("https://gramio.dev/logo.png")
    );
});

// Upload from buffer — synchronous
bot.command("photo_buffer", (context) => {
    const buffer = Buffer.from("..."); // your image data
    return context.sendPhoto(MediaUpload.buffer(buffer, "image.png"));
});

// Upload document with custom filename
bot.command("document", async (context) => {
    return context.sendDocument(
        await MediaUpload.path("./report.pdf", "monthly-report.pdf")
    );
});

// Send media group (album)
bot.command("album", async (context) => {
    return context.sendMediaGroup([
        MediaInput.photo(await MediaUpload.path("./photo1.jpg"), {
            caption: "First photo",
        }),
        MediaInput.photo(await MediaUpload.path("./photo2.jpg")),
        MediaInput.photo(
            await MediaUpload.url("https://example.com/photo3.jpg")
        ),
    ]);
});

// Download a file from a message
bot.on("message", async (context) => {
    if (context.photo) {
        const path = await context.download("received-photo.jpg");
        return context.send(`Photo saved to ${path}`);
    }
});

// Bun.file() integration (Bun only)
bot.command("bun_file", (context) => {
    return context.sendDocument(Bun.file("./data.json"));
});

bot.start();
