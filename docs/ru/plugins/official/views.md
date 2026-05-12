# Views

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/views?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/views)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/views?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/views)
[![JSR](https://jsr.io/badges/@gramio/views)](https://jsr.io/@gramio/views)
[![JSR Score](https://jsr.io/badges/@gramio/views/score)](https://jsr.io/@gramio/views)

</div>

Система шаблонов для переиспользуемых вьюшек сообщений. Автоматически определяет, что делать — отправить новое сообщение или отредактировать текущее — в зависимости от типа контекста. Из коробки поддерживает программные адаптеры, JSON-вьюшки с интерполяцией, загрузку из файловой системы, i18n, все типы клавиатур и медиа с интерполяцией URL.

> [!WARNING]
> Пакет находится в активной разработке. API может измениться.

### Установка

::: pm-add @gramio/views
:::

### Использование

```ts
import { Bot, InlineKeyboard } from "gramio";
import { initViewsBuilder } from "@gramio/views";

interface Data {
    user: {
        id: number;
        name: string;
        age: number;
    };
    t: (test: "a" | "b", age: number) => string;
}

const defineView = initViewsBuilder<Data>();

const userView = defineView().render(function (test: "a" | "b") {
    return this.response
        .text(this.t(test, this.user.age))
        .keyboard(new InlineKeyboard().text("test", test));
});

const bot = new Bot(process.env.BOT_TOKEN!)
    .derive(["message", "callback_query"], async (context) => {
        const user = {
            id: context.from.id,
            name: context.from.firstName,
            age: 18,
        };

        const t = (test: "a" | "b", age: number) => test + age;

        return {
            render: defineView.buildRender(context, {
                user,
                t,
            }),
        };
    })
    .on("message", async (context) => {
        return context.render(userView, "a");
    })
    .on("callback_query", async (context) => {
        return context.render(userView, context.data === "a" ? "b" : "a");
    });

bot.start();
```

### Как это работает

`context.render` собирается из четырёх частей:

1. **`initViewsBuilder<Data>()`** объявляет типизированную форму глобалов, которые вы передадите в `buildRender`.
2. **`defineView().render(function (params) { ... })`** объявляет сам view. Внутри тела `this` несёт глобалы и `this.response` — билдер сообщения. Используйте `function`, не arrow — у arrow `this` теряется.
3. **`.derive(["message", "callback_query"], ctx => ({ render: defineView.buildRender(ctx, globals) }))`** подключает `context.render` к каждому типу обновления, который должен рендерить views. Если забыть какой-то тип — `context.render` для него молча не появится.
4. **`context.render(view, params)`** сам выбирает между отправкой и редактированием по типу контекста — `sendMessage` для `message`, `editMessageText` / `editMessageMedia` / `editMessageCaption` для `callback_query`.

Один и тот же view, вызванный из обработчика команды и из `callbackQuery`, в первом случае шлёт новое сообщение, во втором — редактирует существующее:

```ts
bot
    .command("profile",       (ctx) => ctx.render(profileView))   // sendMessage
    .callbackQuery("refresh", (ctx) => ctx.render(profileView));  // editMessageText
```

Именно это свойство позволяет одному определению view обслуживать и «показать экран», и «перерисовать экран» без дублирующихся тел сообщений, которые со временем расходятся.

### Globals и params — что куда

<span v-pre>`buildRender(context, globals)` вызывается внутри `.derive()` на каждое обновление. Второй аргумент становится `this.<key>` внутри `render` и `{{$<key>}}` внутри JSON-шаблонов — там живёт контекст обновления (текущий пользователь, локаль, dbhandle).</span>

`context.render(view, params)` тоже принимает второй аргумент. Это per-call значения — то, что меняется между двумя `ctx.render` в одном хендлере. Локаль идёт в globals (чтобы фабрика адаптеров i18n могла по ней маршрутизировать); id товара, на который кликнули, идёт в params.

```ts
// derive — контекст обновления
.derive(["message", "callback_query"], (ctx) => ({
    render: defineView.buildRender(ctx, {
        user:   { id: ctx.from.id, name: ctx.from.firstName },
        locale: ctx.from.languageCode ?? "en",
    }),
}));

// позже в хендлере — per-call значение
ctx.render(productView, { id: 42 });
```

### Ленивые globals (с v0.2)

`buildRender` принимает обе формы `globals`:

```ts
// 1. Обычный объект — захватывается один раз при вызове .derive()
defineView.buildRender(ctx, { user, locale });

// 2. Thunk — вызывается на каждый render
defineView.buildRender(ctx, () => ({ user, locale, snapshot: getCurrentSnapshot() }));
```

**Зачем нужен thunk?** Обычный объект захватывается в момент вызова `.derive()`. Если хэндлер мутирует стейт между `.derive()` и `ctx.render(view)` (запись в session, `update()` сцены, флип локали, эскалация роли, переход шага в онбординге) — view, захваченный один раз, видит **устаревший** snapshot. Передаёте функцию — views-рантайм вызывает её на каждый `ctx.render(view)`, и view всегда отражает актуальный стейт. Adapter-фабрика тоже пересоздаётся на каждый render с уже разрешёнными globals — то есть выбор адаптера по локали продолжает работать, даже если локаль поменялась посреди обработчика.

```ts
.derive(["message", "callback_query"], (ctx) => ({
    render: defineView.buildRender(ctx, () => ({
        user:    { id: ctx.from!.id, name: ctx.from!.firstName },
        // захватывается свежим на каждый render — флип локали в middleware «просто работает»
        locale:  ctx.from?.languageCode ?? "en",
        // токены для @gramio/onboarding — см. /ru/plugins/official/onboarding
        onboarding: getCurrentOnboardingTokens(),
    })),
}));
```

> Геттеры на свойствах обычного-объекта globals тоже резолвятся на каждый render (object spread в `createContext` читает их каждый раз). Форма с thunk нужна, когда надо пересобрать всю фигуру целиком или хочется, чтобы `ctx`-замыкания пересхватывались.

## Импорты

Библиотека использует модульные импорты, чтобы не тянуть лишние зависимости:

```ts
// Main entry — core functionality
import { initViewsBuilder } from "@gramio/views";

// Import adapters separately
import { createJsonAdapter } from "@gramio/views/json";
import { loadJsonViews, loadJsonViewsDir } from "@gramio/views/fs";
import { defineAdapter } from "@gramio/views/define";
```

**Зачем отдельные импорты?**
- `@gramio/views/fs` тянет Node.js API для работы с файловой системой — не импортируйте его в браузерных/edge-окружениях
- Лучше tree-shaking и меньше бандл
- Чёткое разделение ответственности

## JSON-адаптер

Позволяет описывать вьюшки в JSON — удобно для CMS-ок или пользовательских шаблонов, которые можно редактировать без деплоя.

```ts
import { initViewsBuilder } from "@gramio/views";
import { createJsonAdapter } from "@gramio/views/json";

const adapter = createJsonAdapter({
    views: {
        welcome: { text: "Hello, {{name}}!" },
        goodbye: { text: "See you later!" },
    },
});

const defineView = initViewsBuilder<Data>().from(adapter);

// Then in a handler:
context.render("welcome", { name: "Alice" });
```

### `reply_markup`, клавиатуры и медиа

Поле `reply_markup` повторяет структуру [Telegram Bot API](https://core.telegram.org/bots/api#replykeyboardmarkup) один-в-один. Интерполяция `{{key}}` работает в тексте кнопок, `callback_data`, `url` и `input_field_placeholder`.

**Инлайн-клавиатура:**

```json
{
    "welcome": {
        "text": "Hello, {{name}}!",
        "reply_markup": {
            "inline_keyboard": [
                [
                    { "text": "Profile {{name}}", "callback_data": "profile_{{id}}" },
                    { "text": "Help", "callback_data": "help" }
                ],
                [
                    { "text": "Visit", "url": "https://example.com/{{id}}" }
                ]
            ]
        }
    }
}
```

**Reply-клавиатура:**

```json
{
    "menu": {
        "text": "Choose an option:",
        "reply_markup": {
            "keyboard": [
                [{ "text": "Help" }, { "text": "Settings" }],
                [{ "text": "Share Contact", "request_contact": true }]
            ],
            "resize_keyboard": true,
            "one_time_keyboard": true
        }
    }
}
```

**Удаление клавиатуры / Принудительный ответ:**

```json
{ "reply_markup": { "remove_keyboard": true } }
{ "reply_markup": { "force_reply": true, "input_field_placeholder": "Type {{what}}..." } }
```

**Медиа** (одиночное или группа):

```json
{
    "photo_view": {
        "text": "A caption",
        "media": { "type": "photo", "media": "{{photoUrl}}" }
    },
    "gallery": {
        "text": "My photos",
        "media": [
            { "type": "photo", "media": "{{photo1}}" },
            { "type": "photo", "media": "{{photo2}}" }
        ]
    }
}
```

Поддерживаемые типы медиа: `photo`, `video`, `animation`, `audio`, `document`.

### Доступ к глобалам через `{{$path}}`

Используйте `{{$path}}`, чтобы обращаться к глобалам (значениям, которые прокидываются в `buildRender`) прямо из JSON-шаблонов:

```json
{
    "welcome": { "text": "Welcome to {{$appName}}!" },
    "profile": { "text": "{{$user.name}} (age {{$user.age}})" }
}
```

```ts
// globals passed in .derive():
{ appName: "MyBot", user: { name: "Alice", age: 25 } }
```

`$`-глобалы спокойно миксуются с обычными `{{params}}`: `"{{$botName}} says hi to {{name}}"`.

### Кастомный `resolve`-колбэк

Для i18n или любой кастомной логики интерполяции можно передать функцию `resolve` в `createJsonAdapter`. Она вызывается для каждого `{{key}}` (кроме `$`-префиксных) перед фолбэком на params:

```ts
const adapter = createJsonAdapter<{ t: (key: string) => string }, ViewMap>({
    views: {
        greet: { text: "{{t:hello}}, {{name}}!" },
    },
    resolve: (key, globals) => {
        if (key.startsWith("t:")) return globals.t(key.slice(2));
    },
});
```

Если `resolve` вернёт `undefined`, ключ пробрасывается в params. Неразрезолвленные ключи остаются как `{{key}}`.

Все три источника работают везде — в тексте, кнопках клавиатуры, URL медиа, плейсхолдерах:

```json
{ "text": "{{$brand}}: {{t:title}} — {{subtitle}}" }
```

### i18n через фабрику адаптеров

Для полноценного i18n пишите JSON-шаблоны целиком на каждом языке и передавайте **фабричную функцию** в `from()`. Фабрика получает глобалы и возвращает нужный адаптер по локали:

```
views/
  en/
    welcome.json    → { "text": "Hello, {{name}}!" }
  ru/
    welcome.json    → { "text": "Привет, {{name}}!" }
```

```ts
import { initViewsBuilder } from "@gramio/views";
import { createJsonAdapter } from "@gramio/views/json";
import { loadJsonViewsDir } from "@gramio/views/fs";

const adapters = {
    en: createJsonAdapter({ views: await loadJsonViewsDir("./views/en") }),
    ru: createJsonAdapter({ views: await loadJsonViewsDir("./views/ru") }),
};

const defineView = initViewsBuilder<Data>().from(
    (globals) => adapters[globals.locale]
);

// In .derive(), locale comes from the user context:
bot.derive(["message", "callback_query"], (context) => ({
    render: defineView.buildRender(context, {
        locale: context.from.languageCode ?? "en",
    }),
}));

// render stays the same — adapter is selected automatically:
context.render("welcome", { name: "Alice" });
// → "Привет, Alice!" for Russian users
```

## Загрузка JSON-вьюшек из файловой системы

### Один файл

Один JSON-файл с несколькими вьюшками:

```json
// views.json
{
    "welcome": { "text": "Hello, {{name}}!" },
    "goodbye": { "text": "Bye!" }
}
```

```ts
import { createJsonAdapter } from "@gramio/views/json";
import { loadJsonViews } from "@gramio/views/fs";

const views = await loadJsonViews("./views.json");
const adapter = createJsonAdapter({ views });
```

### Директория

Каждый `.json`-файл содержит несколько именованных вьюшек:

```
views/
  messages.json         → "messages.welcome", "messages.goodbye", "messages.help"
  goods/
    products.json       → "goods.products.list", "goods.products.detail"
```

```json
// messages.json
{
    "welcome": { "text": "Hello, {{name}}!" },
    "goodbye": { "text": "Bye, {{name}}!" },
    "help": { "text": "Need help?" }
}
```

```json
// goods/products.json
{
    "list": { "text": "Product list" },
    "detail": {
        "text": "Product {{name}}",
        "media": { "type": "photo", "media": "{{photo}}" }
    }
}
```

**Как это работает:**

Каждый `.json`-файл должен содержать объект, где:
- **Ключи** — имена вьюшек
- **Значения** — определения вьюшек (`{ text?, reply_markup?, media? }`)

Итоговый ключ вьюшки формируется из пути файла (через точку) + имя вьюшки:

```
views/
  main.json             ← { "home": {...}, "about": {...} }
  user/
    profile.json        ← { "view": {...}, "edit": {...} }
```

```ts
import { createJsonAdapter } from "@gramio/views/json";
import { loadJsonViewsDir } from "@gramio/views/fs";

const views = await loadJsonViewsDir("./views");
const adapter = createJsonAdapter({ views });

// Available keys:
// - "main.home"
// - "main.about"
// - "user.profile.view"
// - "user.profile.edit"
```

## Inline-query результаты

Один и тот же view может рендериться как `InlineQueryResult` — то же тело `defineView`, что отправляет сообщение в чат, формирует элемент списка inline-выдачи с полной типобезопасностью. Вместе с уже существующим авто-выбором между send и edit это даёт **четыре контекста на одно определение view**: `message`, `callback_query`, `inline_query`, `chosen_inline_result`.

### `.preview()` — метаданные только для inline

Inline-результаты несут preview-данные (id, title, description, thumbnail), которых нет в обычной отправке/редактировании. Их задаёт `.preview()` внутри того же тела рендера — при обычной отправке/редактировании эти поля игнорируются.

```ts
import { CallbackData, InlineKeyboard } from "gramio";
import { initViewsBuilder } from "@gramio/views";

const trackRef = new CallbackData("track").string("src").string("id");

const trackView = defineView<Data>().render(function (track: Track) {
    return this.response
        .text(`${track.title} — ${track.artist}`)
        .media({
            type: "audio",
            media: track.url,
            performer: track.artist,
            duration: track.durationSec,
        })
        .keyboard(new InlineKeyboard().text("Refresh", "refresh"))
        .preview({
            id: trackRef.pack({ src: track.source, id: track.id }),
            title: track.title,
            description: track.artist,
            thumbnail: { url: track.albumArt, width: 200, height: 200 },
        });
});
```

Форма `PreviewOpts`:

```ts
type PreviewOpts = {
    id: string;                              // обязателен, ≤ 64 байт, уникален в пределах ответа
    title?: string;                          // обязателен для Article + Video/Audio/Voice/Document
    description?: string;
    thumbnail?: {
        url: string;                         // обязателен для Photo/Gif/Mpeg4Gif/Video
        width?: number;
        height?: number;
        mimeType?: "image/jpeg" | "image/gif" | "video/mp4";   // только Gif/Mpeg4Gif
    };
    url?: string;                            // только Article — ссылка «Visit» в UI
};
```

### Таблица соответствий

| Форма render | Маппится на | Обязательные `.preview()` | Обязательные `.media()` |
|---|---|---|---|
| только text | `InlineQueryResultArticle` | `id`, `title` | — |
| text + photo | `InlineQueryResultPhoto` | `id`, `thumbnail.url` | — |
| text + audio | `InlineQueryResultAudio` | `id`, `title` | — |
| text + video | `InlineQueryResultVideo` | `id`, `title`, `thumbnail.url` | — |
| text + voice | `InlineQueryResultVoice` | `id`, `title` | — |
| text + document | `InlineQueryResultDocument` | `id`, `title` | `mimeType` (`pdf` \| `zip`) |
| text + animation | `InlineQueryResultMpeg4Gif` | `id`, `thumbnail.url` | — |

`InlineQueryResultArticle` требует чтобы у response также был установлен `.text(...)` — он формирует `InputTextMessageContent`. Трансформер бросает понятные ошибки с именем поля до сетевых вызовов, если обязательного поля нет.

### Список результатов в `inline_query`

Добавьте `inline_query` в `.derive()`, затем смапьте данные:

```ts
bot.derive(
    ["message", "callback_query", "inline_query", "chosen_inline_result"],
    (ctx) => ({ render: defineView.buildRender(ctx, globals) }),
);

bot.on("inline_query", async (ctx) => {
    const tracks = await search(ctx.query);
    await ctx.render.answerInline(
        tracks.map((t) => [trackView, t]),
        { cache_time: 0, is_personal: true },
    );
});
```

`ctx.render.answerInline(items, opts?)` — это сахар для `ctx.answer(items.map(toInlineResult), opts)`. Для более тонкого контроля (фильтрация результатов после рендера, обработка ошибок поэлементно) используйте чистый трансформер:

```ts
const results = await Promise.all(
    tracks.map((t) => ctx.render.inlineResult(trackView, t)),
);
await ctx.answer(results, { cache_time: 0, is_personal: true });
```

`ctx.render.inlineResult(view, ...args)` — **чистая функция**, без IO, возвращает `InlineQueryResult`.

### Auto-edit на `chosen_inline_result`

В контексте `chosen_inline_result` `ctx.render(view, params)` направляет вызов в `editMessageText` / `editMessageMedia` / `editMessageCaption` / `editMessageReplyMarkup` с ключом `inline_message_id` — тот же auto-detect, что и для callback-query, но по другому идентификатору.

```ts
bot.chosenInlineResult(/.+/, async (ctx) => {
    const data = trackRef.safeUnpack(ctx.resultId);
    if (!data.success) return;
    const fresh = await fetchTrack(data.data.src, data.data.id);
    if (!fresh) return;
    await ctx.render(trackView, fresh);   // → editMessage* через inline_message_id
});
```

`chosen_inline_result` приходит только если у @BotFather включён `/setinlinefeedback` **и** результат содержал `reply_markup`. Без обоих условий апдейт не приходит; если вы вызываете `ctx.render(view, ...)` и `inline_message_id` отсутствует, плагин кинет ошибку с пояснением.

### Принудительные inline-стратегии

```ts
ctx.render.inlineResult(view, params)  // чистая функция → InlineQueryResult
ctx.render.answerInline(items, opts?)  // сахар → ctx.answer(items.map(toInlineResult), opts)
ctx.render.editInline(view, params)    // принудительное редактирование inline-сообщения
```

`render.editInline(...)` — escape-hatch для повторного редактирования сохранённого `inline_message_id` из не-`chosen_inline_result` контекста — например, воркер очереди обновляет inline-сообщение через несколько часов.

### `id` как ключ для refetch, а не как payload-кеш

ID результата ограничен 64 байтами. Используйте `CallbackData` чтобы упаковать **маленький lookup-ключ** (источник + id у источника, или primary key из вашей БД) и **доставайте свежие данные при выборе**, а не храните весь payload в Redis. Свежее, без TTL-багов, без Redis в hot path:

```ts
const trackRef = new CallbackData("track").string("src").string("id");
trackRef.pack({ src: "spotify", id: "abc123" });   // ~16 байт
```

Та же схема `CallbackData` работает и для inline `result_id`, и для callback-кнопок.

### JSON-адаптер — ключ `preview`

`@gramio/views/json` распознаёт ключ `preview` в определениях view. Та же интерполяция `{{key}}` и `{{$global}}`; числовые поля приводятся к числу после интерполяции.

```json
{
    "track-result": {
        "text": "{{title}} — {{artist}}",
        "media": {
            "type": "audio",
            "media": "{{audioUrl}}",
            "performer": "{{artist}}",
            "duration": "{{duration}}"
        },
        "reply_markup": {
            "inline_keyboard": [[{ "text": "Open", "callback_data": "open_{{packedId}}" }]]
        },
        "preview": {
            "id": "{{packedId}}",
            "title": "{{title}}",
            "description": "{{artist}}",
            "thumbnail": { "url": "{{albumArt}}", "width": 200, "height": 200 }
        }
    }
}
```

### Что views намеренно не делают

- **Нет fetcher / пагинации / дедупа / ранжирования.** Пагинация через `next_offset` per-answer — передавайте её в `ctx.answer(items, { next_offset })` сами.
- **Нет `id ↔ payload` bridge.** Кодируйте lookup-ключи через `CallbackData` и делайте refetch; views отвечают только за визуал.
- **Нет абстракции для `cache_time` / `is_personal` / `button`.** Это per-answer параметры, передавайте их в `ctx.answer(items, opts)`.

### Отложено (пока не поддерживается)

- **Cached (`file_id`) варианты результатов.** v1 поддерживает только URL-формы; cached-варианты и стикеры (которые Telegram отдаёт только cached) — в следующей версии.
- **`InlineQueryResultLocation` / `Venue` / `Contact` / `Game` / `Invoice`.** Требуют новых форм ResponseView (lat/long, invoice prices). Phase 2.
- **Embedded-player video** (`mime_type: "text/html"` для YouTube/Vimeo). Требует override через `input_message_content`.
