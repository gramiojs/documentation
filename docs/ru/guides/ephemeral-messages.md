---
title: Эфемерные сообщения в Bot API 10.3 | GramIO

head:
    - - meta
      - name: "description"
        content: "Отправка, замена, редактирование и удаление сообщений, видимых одному пользователю, с новой вложенной формой параметров Bot API 10.3."

    - - meta
      - name: "keywords"
        content: "gramio, telegram бот, эфемерные сообщения, ephemeral_message_parameters, receiver_user_id, replace_callback_query_message, Bot API 10.3"
---

# Эфемерные сообщения

Эфемерное сообщение видно только одному пользователю и боту. В Bot API 10.3 поля доставки у всех методов отправки сгруппированы внутри `ephemeral_message_parameters`.

::: danger Миграция на Bot API 10.3
Методы отправки больше не принимают `receiver_user_id` и `callback_query_id` на верхнем уровне. GramIO намеренно не добавляет совместимые алиасы: перенесите оба поля в `ephemeral_message_parameters`.
:::

## Отправка одному пользователю

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("secret", (ctx) =>
	ctx.send("🤫 Это видите только вы.", {
		ephemeral_message_parameters: {
			receiver_user_id: ctx.from!.id,
		},
	}),
);
```

Та же вложенная форма работает с поддерживаемыми медиа-методами и [`sendRichMessage`](/telegram/methods/sendRichMessage).

## Ответ на callback или замена исходного сообщения

Если отправка следует за нажатием кнопки, передайте идентификатор callback-запроса. `replace_callback_query_message` заменяет исходное сообщение эфемерным результатом.

```ts twoslash
import { Bot, InlineKeyboard } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("menu", (ctx) =>
	ctx.send("Выберите:", {
		reply_markup: new InlineKeyboard().text("Показать", "reveal"),
	}),
);

bot.callbackQuery("reveal", async (ctx) => {
	await ctx.answer();
	return ctx.send("Ваш персональный результат", {
		ephemeral_message_parameters: {
			receiver_user_id: ctx.from.id,
			callback_query_id: ctx.id,
			replace_callback_query_message: true,
		},
	});
});
```

Не устанавливайте `replace_callback_query_message` для callback-запроса из эфемерного сообщения. Используйте специальные методы `editEphemeralMessage…`.

## Метаданные ответа

Возвращённый `Message` и контекст входящего сообщения предоставляют получателя и эфемерный идентификатор:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("private", async (ctx) => {
	const sent = await ctx.send("Приватно", {
		ephemeral_message_parameters: {
			receiver_user_id: ctx.from!.id,
		},
	});

	console.log(sent.receiverUser?.id, sent.ephemeralMessageId);
});
```

- `receiverUser` — пользователь, которому видно сообщение.
- `ephemeralMessageId` — идентификатор для последующего редактирования или удаления.

## Редактирование и удаление

Методы редактирования и удаления по-прежнему используют `receiver_user_id` и `ephemeral_message_id` как собственные адресные поля верхнего уровня. Вложенная форма нужна именно методам отправки.

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
		text: format`Теперь ${bold`2…`}`,
	});

	await bot.api.deleteEphemeralMessage({
		chat_id: ctx.chatId,
		receiver_user_id: receiverId,
		ephemeral_message_id: sent.ephemeralMessageId!,
	});
});
```

Храните идентификатор получателя вместе с эфемерным идентификатором. Обычный `message_id` не адресует эфемерное сообщение.

## Ответ на эфемерное сообщение

Передайте `reply_parameters.ephemeral_message_id` и сделайте ответ эфемерным для того же получателя:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.on("message", (ctx) => {
	if (!ctx.ephemeralMessageId || !ctx.receiverUser) return;

	return ctx.send("Приватный ответ", {
		ephemeral_message_parameters: {
			receiver_user_id: ctx.receiverUser.id,
		},
		reply_parameters: {
			ephemeral_message_id: ctx.ephemeralMessageId,
		},
	});
});
```

## Смотрите также

- [Rich Messages](/ru/guides/rich-messages)
- [`EphemeralMessageParameters`](/telegram/types/EphemeralMessageParameters)
- [`editEphemeralMessageText`](/telegram/methods/editEphemeralMessageText)
- [`deleteEphemeralMessage`](/telegram/methods/deleteEphemeralMessage)
