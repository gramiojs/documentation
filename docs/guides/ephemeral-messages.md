---
title: Ephemeral Messages in Bot API 10.3 | GramIO

head:
    - - meta
      - name: "description"
        content: "Send, replace, edit, and delete Telegram messages visible to one user with GramIO and the Bot API 10.3 nested parameter shape."

    - - meta
      - name: "keywords"
        content: "gramio, telegram bot, ephemeral messages, ephemeral_message_parameters, receiver_user_id, replace_callback_query_message, Bot API 10.3"
---

# Ephemeral Messages

Ephemeral messages are visible only to one user and the bot. In Bot API 10.3, every send method groups the delivery fields inside `ephemeral_message_parameters`.

::: danger Bot API 10.3 migration
Top-level `receiver_user_id` and `callback_query_id` are no longer accepted by send methods. GramIO intentionally provides no compatibility alias: move both fields into `ephemeral_message_parameters`.
:::

## Send to one user

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("secret", (ctx) =>
	ctx.send("🤫 Only you can see this.", {
		ephemeral_message_parameters: {
			receiver_user_id: ctx.from!.id,
		},
	}),
);
```

The same nested object works with supported media methods and [`sendRichMessage`](/telegram/methods/sendRichMessage).

## Respond to or replace a callback message

Pass the callback query identifier when the send follows a button press. Set `replace_callback_query_message` to replace the original callback-query message with the ephemeral result.

```ts twoslash
import { Bot, InlineKeyboard } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("menu", (ctx) =>
	ctx.send("Pick one:", {
		reply_markup: new InlineKeyboard().text("Reveal", "reveal"),
	}),
);

bot.callbackQuery("reveal", async (ctx) => {
	await ctx.answer();
	return ctx.send("Your personal result", {
		ephemeral_message_parameters: {
			receiver_user_id: ctx.from.id,
			callback_query_id: ctx.id,
			replace_callback_query_message: true,
		},
	});
});
```

Do not set `replace_callback_query_message` for callbacks originating from an ephemeral message. Edit those with the dedicated `editEphemeralMessage…` methods.

## Read the response metadata

The returned `Message` and incoming message context expose the receiver and the ephemeral identifier:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("private", async (ctx) => {
	const sent = await ctx.send("Private", {
		ephemeral_message_parameters: {
			receiver_user_id: ctx.from!.id,
		},
	});

	console.log(sent.receiverUser?.id, sent.ephemeralMessageId);
});
```

- `receiverUser` is the user who can see the message.
- `ephemeralMessageId` addresses the message for later edits or deletion.

## Edit and delete

Edit/delete methods still use `receiver_user_id` and `ephemeral_message_id` as their own top-level address fields. The nesting change applies to send methods.

```ts twoslash
import { Bot, bold, format } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("countdown", async (ctx) => {
	const receiverId = ctx.from!.id;
	const sent = await ctx.send("3…", {
		ephemeral_message_parameters: { receiver_user_id: receiverId },
	});

	await bot.api.editEphemeralMessageText({
		chat_id: ctx.chatId,
		receiver_user_id: receiverId,
		ephemeral_message_id: sent.ephemeralMessageId!,
		text: format`Now ${bold`2…`}`,
	});

	await bot.api.deleteEphemeralMessage({
		chat_id: ctx.chatId,
		receiver_user_id: receiverId,
		ephemeral_message_id: sent.ephemeralMessageId!,
	});
});
```

Keep the receiver ID together with the ephemeral message ID. A normal `message_id` cannot address an ephemeral message.

## Reply to an ephemeral message

Use `reply_parameters.ephemeral_message_id` and make the reply ephemeral for the same receiver:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.on("message", (ctx) => {
	if (!ctx.ephemeralMessageId || !ctx.receiverUser) return;

	return ctx.send("A private reply", {
		ephemeral_message_parameters: {
			receiver_user_id: ctx.receiverUser.id,
		},
		reply_parameters: {
			ephemeral_message_id: ctx.ephemeralMessageId,
		},
	});
});
```

## See also

- [Rich Messages](/guides/rich-messages)
- [`EphemeralMessageParameters`](/telegram/types/EphemeralMessageParameters)
- [`editEphemeralMessageText`](/telegram/methods/editEphemeralMessageText)
- [`deleteEphemeralMessage`](/telegram/methods/deleteEphemeralMessage)
