import { Bot, MediaUpload, MediaInput } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

// Upload from file path
bot.command("photo_path", (context) => {
    return context.sendPhoto(MediaUpload.path("./photo.jpg"));
});

// Upload from URL
bot.command("photo_url", (context) => {
    return context.sendPhoto(
        MediaUpload.url("https://gramio.dev/logo.png")
    );
});

// Upload from buffer
bot.command("photo_buffer", (context) => {
    const buffer = Buffer.from("..."); // your image data
    return context.sendPhoto(MediaUpload.buffer(buffer, "image.png"));
});

// Upload document with custom filename
bot.command("document", (context) => {
    return context.sendDocument(
        MediaUpload.path("./report.pdf", "monthly-report.pdf")
    );
});

// Send media group (album)
bot.command("album", (context) => {
    return context.sendMediaGroup([
        MediaInput.photo(MediaUpload.path("./photo1.jpg"), {
            caption: "First photo",
        }),
        MediaInput.photo(MediaUpload.path("./photo2.jpg")),
        MediaInput.photo(
            MediaUpload.url("https://example.com/photo3.jpg")
        ),
    ]);
});

// Download a file from a message
bot.on("message", async (context) => {
    if (context.photo) {
        // Download the largest photo size
        const file = context.photo[context.photo.length - 1];
        const path = await context.download("received-photo.jpg");
        return context.send(`Photo saved to ${path}`);
    }
});

// Bun.file() integration (Bun only)
bot.command("bun_file", (context) => {
    return context.sendDocument(Bun.file("./data.json"));
});

bot.start();
