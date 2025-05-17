# Плагин Split

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/split?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/split)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/split?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/split)
[![JSR](https://jsr.io/badges/@gramio/split)](https://jsr.io/@gramio/split)
[![JSR Score](https://jsr.io/badges/@gramio/split/score)](https://jsr.io/@gramio/split)

</div>

Этот пакет может разделять сообщения, превышающие лимиты Telegram, на несколько частей. Также автоматически разделяет entities, избавляя от необходимости делать это вручную.

# Использование

```ts
import { splitMessage } from "@gramio/split";

const bot = new Bot(process.env.BOT_TOKEN!).command(
    "start",
    async (context) => {
        const messages = await splitMessage(
            format`${bold("a".repeat(4096 * 2))}`,
            (str) => context.send(str)
            // Внимание: при использовании context.send без обёртки
            // используйте context.send.bind(context) для сохранения контекста
        );

        console.log(messages); // messages - массив результатов отправки
    }
);

await bot.start();
```

Можно использовать с другими фреймворками:

```ts
import { splitMessage } from "@gramio/split";

const messages = await splitMessage(
    format`${bold("a".repeat(4096 * 2))}`,
    ({ text, entities }) => {
        return someOtherFramework.sendMessage(text, { entities });
    }
);
```

### Настройка

Максимальная длина текста настраивается. По умолчанию 4096 символов, но для подписей к фото (sendPhoto) - 1024:

```ts
const messages = await splitMessage(
    format`${bold("a".repeat(4096))}`,
    ({ text, entities }) => {
        return context.sendPhoto(PHOTO, {
            caption: text,
            caption_entities: entities,
        });
    },
    1024
);
```

> [!NOTE]
> Пакет находится в активной разработке.

## Планы:

-   [ ] Дополнительные тесты
-   [ ] Плагин с авто-разделением
-   [ ] Режим разделения по entities
-   [ ] Стратегии для разных типов контента (например, фото → текст)
