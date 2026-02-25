---
title: Плагины GramIO — Обзор официальных плагинов
head:
    - - meta
      - name: "description"
        content: "Обзор официальных плагинов GramIO: Scenes, Session, I18n, Auto-retry, Autoload, Media cache, Pagination и другие. Каждый плагин подключается через .extend() с полным распространением TypeScript-типов."
    - - meta
      - name: "keywords"
        content: "плагины GramIO, плагины telegram бота, плагин scenes, плагин session, i18n плагин, autoload плагин, auto-retry, media cache, pagination, prompt, расширения TypeScript telegram бота"
---

# Обзор плагинов

Система плагинов GramIO построена на том же механизме `.extend()`, который лежит в основе всего фреймворка. Каждый плагин компонуется чисто — плагины могут добавлять свойства контекста, регистрировать обработчики и встраиваться в жизненный цикл бота, и всё это с **полным распространением типов** в каждый последующий обработчик.

```ts
const bot = new Bot(token)
    .extend(session())       // ctx.session теперь типизирован
    .extend(scenes([...]))   // ctx.scene теперь типизирован
    .extend(i18n())          // ctx.i18n теперь типизирован
    .on("message", (ctx) => {
        ctx.session; // ✅
        ctx.scene;   // ✅
        ctx.i18n;    // ✅
    });
```

---

## Официальные плагины

### [Scenes](/ru/plugins/official/scenes) — `@gramio/scenes`

Многошаговые диалоговые потоки. Создавайте мастера, сценарии онбординга и многошаговые формы, где каждый шаг ожидает следующего сообщения от пользователя.

- Шаги типизированы: состояние передаётся между шагами
- Войти в сцену можно из любого обработчика; выйти или перейти к любому шагу
- Работает с session для сохранения состояния между перезапусками

```ts
const registerScene = new Scene("register")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("Как вас зовут?");
        return ctx.scene.update({ name: ctx.text });
    })
    .step("message", (ctx) =>
        ctx.send(`Добро пожаловать, ${ctx.scene.state.name}!`)
    );
```

[Подробная документация →](/ru/plugins/official/scenes)

---

### [Session](/ru/plugins/official/session) — `@gramio/session`

Постоянное состояние для каждого пользователя между сообщениями. Чтение и запись прозрачны — просто используйте `ctx.session` как обычный объект.

- По умолчанию в памяти; подключите любой [адаптер хранилища](/ru/storages)
- Фабрика начального состояния полностью типизирована
- Отлично работает со Scenes для сохранения состояния сцены

```ts
const bot = new Bot(token).extend(
    session({ initial: () => ({ count: 0, name: "" }) })
);

bot.command("count", (ctx) => {
    ctx.session.count++;
    return ctx.send(`Счётчик: ${ctx.session.count}`);
});
```

[Подробная документация →](/ru/plugins/official/session)

---

### [I18n](/ru/plugins/official/i18n) — `@gramio/i18n`

TypeScript-нативная интернационализация с **полной проверкой типов во время компиляции** — без кодогенерации, без `.ftl` файлов. Переводы — это обычные TS-функции; `ShouldFollowLanguage` гарантирует, что каждая локаль совпадает с ключами и сигнатурами основного языка.

- Переводы — обычные функции: используйте `format`/`bold`/и т.д. напрямую
- Локаль для каждого пользователя из любого источника (база данных, session, Telegram `language_code`)
- Автодополнение ключей и типов аргументов в редакторе
- Поддержка Fluent `.ftl` также доступна для сложных правил склонения

```ts
import { defineI18n, type LanguageMap, type ShouldFollowLanguage } from "@gramio/i18n";
import { format, bold } from "gramio";

const en = {
    welcome: (name: string) => format`Hello, ${bold(name)}!`,
} satisfies LanguageMap;

const ru = {
    welcome: (name: string) => format`Привет, ${bold(name)}!`,
} satisfies ShouldFollowLanguage<typeof en>;

const i18n = defineI18n({ primaryLanguage: "en", languages: { en, ru } });

const bot = new Bot(token)
    // строим t() для каждого запроса по локали пользователя
    .derive((ctx) => ({
        t: i18n.buildT(ctx.from?.language_code ?? "en"),
    }));

bot.command("start", (ctx) =>
    ctx.send(ctx.t("welcome", ctx.from?.first_name ?? "незнакомец"))
);
```

[Подробная документация →](/ru/plugins/official/i18n)

---

### [Autoload](/ru/plugins/official/autoload) — `@gramio/autoload`

Файловая регистрация обработчиков. Просто добавьте файл в `src/commands/` — он зарегистрируется автоматически, без ручных импортов и центрального реестра.

- Паттерн glob настраивается (по умолчанию `src/commands/**/*.ts`)
- Каждый файл экспортирует функцию `(bot: Bot) => Bot` по умолчанию
- Отлично подходит для больших ботов, разбитых на множество файлов фич

```ts
// src/index.ts
const bot = new Bot(token).extend(autoload());

// src/commands/start.ts
export default (bot: Bot) => bot.command("start", (ctx) => ctx.send("Привет!"));
```

[Подробная документация →](/ru/plugins/official/autoload)

---

### [Prompt](/ru/plugins/official/prompt) — `@gramio/prompt`

Ожидаемые одиночные ответы. Задайте вопрос и `await` ответа пользователя в линейном, читаемом потоке — без конечных автоматов.

- Приостанавливает выполнение и возобновляет, когда пользователь отвечает
- Опциональный таймаут
- Естественно сочетается со Scenes для сложных потоков

```ts
bot.command("rename", async (ctx) => {
    const reply = await ctx.prompt("Какое ваше новое имя?");
    await ctx.send(`Имя обновлено: ${reply.text}`);
});
```

[Подробная документация →](/ru/plugins/official/prompt)

---

### [Auto Retry](/ru/plugins/official/auto-retry) — `@gramio/auto-retry`

Автоматическая обработка ограничений скорости Telegram. Когда Telegram отвечает `retry_after`, плагин прозрачно ждёт и повторяет запрос — без изменений в вашем коде.

- Автоматически обрабатывает ошибки `Too Many Requests` (429)
- Настраиваемое количество повторов и стратегия задержки
- Работает для рассылок, высоконагруженных ботов

```ts
const bot = new Bot(token).extend(autoRetry());
// Все вызовы API теперь повторяются автоматически при превышении лимита
```

[Подробная документация →](/ru/plugins/official/auto-retry)

---

### [Auto Answer Callback Query](/ru/plugins/official/auto-answer-callback-query) — `@gramio/auto-answer-callback-query`

Никогда не забывайте подтверждать callback query. Автоматически отвечает на все необработанные обновления `callback_query` — Telegram требует ответа в течение 10 секунд, иначе показывает ошибку.

```ts
const bot = new Bot(token).extend(autoAnswerCallbackQuery());
// Теперь каждое нажатие инлайн-кнопки автоматически подтверждается
```

[Подробная документация →](/ru/plugins/official/auto-answer-callback-query)

---

### [Media Cache](/ru/plugins/official/media-cache) — `@gramio/media-cache`

Загрузите файл один раз, используйте его `file_id` бесконечно. Прозрачно кэширует `file_id` загруженных медиа, чтобы Telegram не повторял загрузку одного файла при каждой отправке.

- Работает с любым бэкендом хранилища
- Снижает задержку при повторных отправках
- Прозрачен — никаких изменений в вызовах send

[Подробная документация →](/ru/plugins/official/media-cache)

---

### [Media Group](/ru/plugins/official/media-group) — `@gramio/media-group`

Агрегация обновлений медиагруппы. Telegram отправляет сообщения `media_group` как отдельные обновления. Этот плагин буферизует их и доставляет полную группу в ваш обработчик как одно событие.

```ts
bot.on("message", (ctx) => {
    if (ctx.mediaGroup) {
        // ctx.mediaGroup — полный массив элементов медиагруппы
        ctx.send(`Получено ${ctx.mediaGroup.length} фото`);
    }
});
```

[Подробная документация →](/ru/plugins/official/media-group)

---

### [Pagination](/ru/plugins/official/pagination) — `@gramio/pagination`

Типизированные постраничные инлайн-клавиатуры. Создавайте многостраничные списки с типобезопасными данными страниц, кнопками следующей/предыдущей и понятной логикой обработчиков.

```ts
const paginationData = new CallbackData("page").number("offset");

const keyboard = pagination({
    data: paginationData,
    total: items.length,
    pageSize: 5,
    current: offset,
});
```

[Подробная документация →](/ru/plugins/official/pagination)

---

### [Views](/ru/plugins/official/views) — `@gramio/views`

Шаблоны сообщений для переиспользования. Определите сообщение (текст + клавиатура + параметры) один раз и используйте везде, разделяя UI и логику.

[Подробная документация →](/ru/plugins/official/views)

---

### [JSX](/ru/plugins/official/jsx) — `@gramio/jsx`

Пишите сообщения бота с использованием JSX. Используйте привычный синтаксис в стиле React для составления сообщений с форматированием.

```tsx
bot.command("start", (ctx) =>
    ctx.send(<b>Привет!</b> <i>Добро пожаловать в моего бота.</i>)
);
```

[Подробная документация →](/ru/plugins/official/jsx)

---

### [PostHog](/ru/plugins/official/posthog) — `@gramio/posthog`

Аналитика для вашего бота. Отслеживайте команды пользователей, события и поведение в [PostHog](https://posthog.com/) с автоматической фиксацией событий.

[Подробная документация →](/ru/plugins/official/posthog)

---

### [OpenTelemetry](/ru/plugins/official/opentelemetry) — `@gramio/opentelemetry`

Распределённая трассировка. Инструментируйте бота с помощью [OpenTelemetry](https://opentelemetry.io/) для полной наблюдаемости — трассирует каждый вызов API, обработчик и хук.

[Подробная документация →](/ru/plugins/official/opentelemetry)

---

### [Sentry](/ru/plugins/official/sentry) — `@gramio/sentry`

Мониторинг ошибок. Автоматически перехватывает необработанные ошибки и отправляет их в [Sentry](https://sentry.io/) с контекстом (тип обновления, ID пользователя и т.д.).

[Подробная документация →](/ru/plugins/official/sentry)

---

### [Split](/ru/plugins/official/split) — `@gramio/split`

Маршрутизация нескольких экземпляров. Распределяйте входящие обновления между несколькими экземплярами бота или воркерами для высокопроизводительных сценариев.

[Подробная документация →](/ru/plugins/official/split)

---

## Какой плагин мне нужен?

| Сценарий | Используйте |
|----------|------------|
| Многошаговые формы / мастера | [Scenes](/ru/plugins/official/scenes) |
| Хранение настроек / состояния пользователя | [Session](/ru/plugins/official/session) |
| Мультиязычный бот | [I18n](/ru/plugins/official/i18n) |
| Большой бот с множеством файлов команд | [Autoload](/ru/plugins/official/autoload) |
| Задать вопрос, ждать ответа | [Prompt](/ru/plugins/official/prompt) |
| Автоматическая обработка ограничений скорости | [Auto Retry](/ru/plugins/official/auto-retry) |
| Избежать ошибок неподтверждённых callback | [Auto Answer Callback Query](/ru/plugins/official/auto-answer-callback-query) |
| Избежать повторной загрузки одних файлов | [Media Cache](/ru/plugins/official/media-cache) |
| Обработка сообщений альбома/медиагруппы | [Media Group](/ru/plugins/official/media-group) |
| Пагинированные списки с инлайн-кнопками | [Pagination](/ru/plugins/official/pagination) |
| Отслеживание событий и воронок пользователей | [PostHog](/ru/plugins/official/posthog) |
| Мониторинг ошибок в продакшене | [Sentry](/ru/plugins/official/sentry) |
| Распределённая трассировка / наблюдаемость | [OpenTelemetry](/ru/plugins/official/opentelemetry) |

---

## Комбинирование плагинов

Плагины компонуются — подключайте столько, сколько нужно, и типы остаются корректными везде:

```ts
const bot = new Bot(token)
    .extend(session({ initial: () => ({ locale: "ru", name: "" }) }))
    .extend(i18n())
    .extend(scenes([registerScene]))
    .extend(autoAnswerCallbackQuery())
    .extend(autoRetry());

// В любом обработчике: ctx.session, ctx.i18n, ctx.scene — все типизированы ✅
```

---

## Напишите свой плагин

Любой `Composer` можно упаковать как плагин. Класс [`Plugin`](/ru/plugins/how-to-write) добавляет имя и чистый интерфейс `.extend()`.

```ts
import { Plugin } from "gramio";

export const myPlugin = new Plugin("my-plugin")
    .derive((ctx) => ({ isAdmin: ctx.from?.id === ADMIN_ID }));

// В боте:
bot.extend(myPlugin);
// ctx.isAdmin теперь типизирован везде ✅
```

[Как написать плагин →](/ru/plugins/how-to-write)
