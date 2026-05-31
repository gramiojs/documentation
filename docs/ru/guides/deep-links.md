---
title: Deep-ссылки в Telegram-ботах — каждая t.me-ссылка и куда попадает её payload

head:
    - - meta
      - name: "description"
        content: "Полный гайд по deep-ссылкам Telegram-ботов на GramIO: ?start, ?startgroup, ?startchannel, ?startapp, ?startattach, ?game и t.me/share/url — в какой хендлер попадает каждая, правила кодирования payload и паттерны роутинга."

    - - meta
      - name: "keywords"
        content: "telegram бот, GramIO, deep link, deep-ссылка, t.me ссылка, start parameter, start_parameter, startapp, startgroup, startchannel, startattach, реферальная ссылка, добавить бота в группу, deep-ссылка mini app, my_chat_member, ctx.args, base64url, payload, ссылка онбординга, OAuth callback, TypeScript"
---

# Deep-ссылки

**Deep-ссылка** — это URL `https://t.me/…` (или URI `tg://…`), который открывает Telegram и запускает действие против твоего бота. Любой реферал, онбординг, OAuth-callback, кнопка «добавь меня в группу», точка входа в Mini App и редирект авторизации из инлайн-режима в конце концов проходят через одну из них.

Подвох в том, что есть **восемь** семейств deep-ссылок для ботов, и каждое попадает в **разное** место твоего бота. `/start <args>` — лишь одно из них. Путаница между ними — причина №1 «куда делся payload»: например, `?startapp=foo` **не** триггерит `/start`, он приезжает внутрь `initData` Mini App на фронтенде.

> Авторитетная спека: [core.telegram.org/api/links](https://core.telegram.org/api/links). Эта страница маппит каждый связанный с ботами пункт оттуда на точку приземления в GramIO.
>
> У твоего AI-ассистента это тоже есть как канонический референс — см. [гайд по AI Skills](/ru/guides/ai-skills) (`references/deep-links.md`).

## TL;DR — ссылка → хендлер → поле

| Шаблон ссылки | Что делает | Хендлер | Где лежит payload |
| --- | --- | --- | --- |
| `t.me/<bot>?start=<payload>` | Открыть ЛС, отправить «Start» | [`bot.command("start", …)`](/ru/triggers/command) | `ctx.args` (`string \| null`) |
| `t.me/<bot>?startgroup=<payload>` | Выбрать группу, добавить бота **участником** | [`bot.command("start", …)`](/ru/triggers/command) | `ctx.args` — бот получает `/start@bot <payload>` (плюс срабатывает `my_chat_member`) |
| `t.me/<bot>?startgroup&admin=<perms>` | Выбрать группу, добавить бота **админом** | `bot.on("my_chat_member", …)` | Без payload — читай права в `ctx.newChatMember` |
| `t.me/<bot>?startchannel&admin=<perms>` | Выбрать канал, добавить бота **админом** | `bot.on("my_chat_member", …)` | Без payload |
| `t.me/<bot>?startapp=<payload>&mode=<mode>` | Открыть Main Mini App | Внутри Mini App (фронтенд) | `Telegram.WebApp.initDataUnsafe.start_param` |
| `t.me/<bot>/<appname>?startapp=<payload>` | Открыть Direct Mini App `<appname>` | Внутри Mini App (фронтенд) | `Telegram.WebApp.initDataUnsafe.start_param` |
| `t.me/<bot>?startattach=<payload>&choose=<peers>` | Открыть attachment-меню бота | Внутри Mini App (web_app) | `start_param` на событии web_app |
| `t.me/<bot>?game=<short_name>` | Поделиться игрой от бота | `bot.on("callback_query")` (кнопка Play) | `ctx.gameShortName` на callback |
| `t.me/share/url?url=…&text=…` | Композер «поделиться в чат» | n/a — UX-хелпер, не апдейт бота | n/a |
| Инлайн `start_parameter` (см. [inline query](/ru/triggers/inline-query)) | Редирект из инлайна в ЛС | [`bot.command("start", …)`](/ru/triggers/command) | `ctx.args` — как у `?start=` |

`tg://resolve?domain=<bot>&…` — это URI-вариант каждой ссылки `t.me/<bot>?…` выше: те же параметры, та же точка прихода. В внешних ссылках предпочитай `https://t.me/…` (человекочитаемо, работает в браузере); `tg://` — только для in-app контекстов, где ты уже знаешь, что у пользователя есть Telegram.

## Правила кодирования payload — прочитай один раз

Эти правила применимы к **каждому** `start*`-payload (`start=`, `startgroup=`, `startapp=`, `startattach=`):

- **Максимум 64 символа.**
- **Алфавит: только `A-Z a-z 0-9 _ -`.** Это алфавит base64url — **никаких `+`, `/`, паддинга `=`, точек и пробелов.** Обычный base64 сломает ссылку.
- **Регистрозависимо.**
- **Считай это недоверенным вводом.** Payload виден в URL открытым текстом; пользователи могут его поменять. Никогда не клади туда секреты — используй непрозрачные токены, индексирующие серверный стейт.
- **Кейс холодного открытия.** На некоторых клиентах (особенно Telegram Desktop) пользователь, который уже стартовал бота, может получить `/start` *без* payload при повторном тапе по ссылке. Делай payload **идемпотентным** и аккуратно деградируй, когда его нет.

### Паттерны кодирования

| Что передать | Паттерн | Заметки |
| --- | --- | --- |
| Один ID | `?start=ref_12345` (префикс + значение) | Префиксы неймспейсят хендлер — `ref_`, `order_`, `inv_` |
| Короткую строку | `?start=login-inline` | Простая строка — kebab-case влезает в алфавит |
| Структурированный объект | JSON в base64url, затем префикс | `tok_eyJ1IjoxfQ` — декод + `JSON.parse` на стороне бота |
| Что-то секретное | **серверный токен** | Храни реальный payload на сервере; передавай только непрозрачный ID |

Используй `Buffer.from(json).toString("base64url")` (Node 16+ / Bun / Deno), чтобы получить валидную строку `[A-Za-z0-9_-]` без паддинга:

```ts
const token = Buffer.from(JSON.stringify({ u: 1, t: "abc" })).toString("base64url");
const link = `https://t.me/${bot.info.username}?start=tok_${token}`;
```

## 1. `/start` deep-ссылки — `?start=`

Классическая deep-ссылка. Открывает ЛС бота, показывает кнопку **Start** и отправляет боту `/start <payload>`.

```ts
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string).command("start", (ctx) => {
    const payload = ctx.args; // string | null — null, если открыли без payload

    if (!payload) return ctx.send("Добро пожаловать!");

    // Роутинг по префиксу — сначала самый специфичный.
    if (payload.startsWith("ref_")) return handleReferral(ctx, payload.slice(4));
    if (payload.startsWith("order_")) return handleOrderJump(ctx, payload.slice(6));
    if (payload.startsWith("tok_")) return exchangeAuthToken(ctx, payload.slice(4));
    if (payload === "login-inline") return startAuthFlow(ctx);

    // Неизвестный payload — деградируй мягко. Не эхай сырое значение обратно.
    return ctx.send("Добро пожаловать! Ссылку не распознал, но ты в деле.");
});
```

`ctx.args` у команды `start` — это `string | null`, и содержит **только** часть после `/start ` (ведущий слеш и имя команды отрезаны). Полный референс триггера — в [`command`](/ru/triggers/command).

### Генерация ссылки

```ts
const link = `https://t.me/${bot.info.username}?start=${encodeURIComponent(payload)}`;
```

### Типичные применения

- **Рефералы** — `?start=ref_12345` отслеживает, кто кого пригласил. Сохрани `referrer = 12345` за новым пользователем до любой другой логики.
- **Переходы по контексту извне** — `?start=order_987` кидает пользователя из письма/сайта прямо на конкретный заказ. Отрендери заказ, а не вываливай его на домашний экран `/start`.
- **OAuth-callback** — внешний сервис редиректит на `t.me/<bot>?start=<короткоживущий-токен>`; бот меняет **одноразовый, с минутным TTL** токен на стороне сервера и линкует аккаунт.
- **Редирект из инлайна в ЛС** — см. *§5 — Кнопка редиректа из инлайн-режима* ниже.

## 2. Group / channel deep-ссылки — `?startgroup=` и `?startchannel=`

`?startgroup=` открывает пикер чатов, чтобы пользователь добавил бота в группу; `?startchannel` — то же для каналов.

```text
https://t.me/<bot>?startgroup=<payload>                       # добавить участником, несёт payload
https://t.me/<bot>?startgroup=<payload>&admin=<permissions>   # добавить админом
https://t.me/<bot>?startchannel&admin=<permissions>           # каналы: только админом
```

Есть **два разных флоу**, и до бота они доходят по-разному.

### Простой `?startgroup=<payload>` — приходит как сообщение `/start`

Когда пользователь добавляет бота через `?startgroup=spaceship` (без `admin=`), бот добавляется участником и **получает сообщение** — по [Bot API](https://core.telegram.org/bots/features#deep-linking), *«результирующий апдейт будет содержать текст вида: `/start@your_bot spaceship`»*. То есть твой обычный хендлер `/start` срабатывает, payload лежит в `ctx.args`:

```ts
bot.command("start", (ctx) => {
    const payload = ctx.args; // "spaceship" — работает и в группах (/start@bot spaceship)
    if (ctx.chat.type !== "private" && payload) {
        // пользователь только что добавил бота в группу по ссылке ?startgroup=<payload>
    }
});
```

Апдейт `my_chat_member` (статус `left` → `member`) **тоже** срабатывает на изменение членства — используй то, что удобнее.

### Флоу `admin=` — подтверждай через `my_chat_member`

Когда ссылка несёт `admin=` (`?startgroup&admin=…` или `?startchannel&admin=…`), бот добавляется **администратором** с запрошенными правами. Поля payload в этом флоу нет — используй `my_chat_member`, чтобы подтвердить добавление и **проверить, какие права реально получил** (`admin=` — это запрос; пользователь может снять галочки, см. ниже). Если нужен контекст — закодируй его **при генерации ссылки** и сохрани в сессии пользователя.

### Комбо `admin=` — это запрос, а не выдача

`admin=` перечисляет права, которые ты *хочешь*. Пользователь может снять галочки в диалоге подтверждения, так что **всегда проверяй, что реально получил**. Токены комбинируются через `+`: `admin=post_messages+edit_messages+delete_messages`. Каждый маппится на поле `ChatAdministratorRights` (`post_messages` → `can_post_messages`, `delete_messages` → `can_delete_messages`, `manage_chat` → `can_manage_chat` и т.д.).

### Проверка прав при приходе

```ts
bot.on("my_chat_member", (ctx) => {
    const me = ctx.newChatMember;

    if (me.status !== "administrator") {
        return ctx.send(
            "Мне нужно быть админом здесь, чтобы постить от твоего имени. " +
                "Выдай мне право 'post messages'."
        );
    }
    if (!me.canPostMessages?.()) {
        return ctx.send("Почти готово — выдай ещё право 'post messages'.");
    }
    return ctx.send("Готово! Буду постить сюда апдейты.");
});
```

> `bot.on("my_chat_member", …)` не требует опт-ина — он в дефолтном `allowed_updates` Telegram. Похожий по имени `chat_member` (про изменения членства *других* пользователей) — опт-ин, см. [Updates](/ru/updates/overview).

### Генерация ссылки

```ts
const perms = ["post_messages", "edit_messages", "delete_messages"].join("+");
const link = `https://t.me/${bot.info.username}?startchannel&admin=${perms}`;
```

## 3. Mini App deep-ссылки — `?startapp=`

**Main Mini App** (одно на бота): `https://t.me/<bot>?startapp=<payload>&mode=<compact|fullscreen>`
**Direct Mini App** (именованное): `https://t.me/<bot>/<short_name>?startapp=<payload>`

### Payload приходит на фронтенд, а не как `/start`

Он приземляется **внутрь `initData` Mini App**:

```ts
// Внутри Mini App (React/Vue/итд), после загрузки SDK:
const startParam: string | undefined = Telegram.WebApp.initDataUnsafe.start_param;
```

TypeScript-код бота никогда не увидит `start_param`, пока Mini App не отправит его обратно (через `Telegram.WebApp.sendData(...)` или fetch на бэкенд). Если боту нужно среагировать на сервере — отправь payload из Mini App сам, обычно вместе с запросом на валидацию `initData`. Раунд-трип авторизации — в [гайде по Mini Apps](/ru/tma/overview).

### Генерация ссылки

```ts
// Main app, полноэкранно
`https://t.me/${bot.info.username}?startapp=${payload}&mode=fullscreen`;
// Direct app по имени "checkout"
`https://t.me/${bot.info.username}/checkout?startapp=${payload}`;
```

## 4. Attachment-меню deep-ссылки — `?startattach=`

Открывает запись бота в **attachment-меню** (скрепка). У бота должно быть одобренное attachment-меню — это курируемая поверхность, которой у большинства ботов нет.

```text
https://t.me/<bot>?startattach=<payload>
https://t.me/<chat_username>?attach=<bot>&startattach=<payload>
https://t.me/<bot>?startattach=<payload>&choose=users+bots+groups+channels
```

`choose=` ограничивает пикер (`users`, `bots`, `groups`, `channels`, через `+`). Payload приземляется туда же, что и `startapp` — `Telegram.WebApp.initDataUnsafe.start_param` — с теми же ограничениями (64 символа / base64url).

## 5. Кнопка редиректа из инлайн-режима — `start_parameter`

Когда инлайн-запросу нужна авторизация/настройка, которую бот не может сделать в инлайне, верни **пустой** массив результатов и верхнюю `button` с `start_parameter`. Кнопка висит над пустой панелью результатов; тап открывает ЛС бота с `/start <param>`.

```ts
bot.inlineQuery(async (ctx) => {
    if (!(await isAuthenticated(ctx.from.id))) {
        return ctx.answer([], {
            cache_time: 0,
            is_personal: true,
            button: {
                text: "Войти, чтобы искать",
                start_parameter: "login-inline", // ведёт на /start login-inline
            },
        });
    }
    // ...обычные результаты после авторизации
});

bot.command("start", (ctx) => {
    if (ctx.args === "login-inline") return startAuthFlow(ctx);
});
```

`InlineQueryResultsButton` — это размеченное объединение: укажи **ровно одно** из `start_parameter` (deep-ссылка в ЛС) или `web_app` (запуск Mini App). Подробности — в [inline query](/ru/triggers/inline-query).

## 6. Game deep-ссылки — `?game=`

В основном используются Telegram внутренне для рендера Game-сообщений. Как бот ты чаще *получаешь* callback по существующей игре (кнопка Play), чем минтишь эти URL:

```ts
bot.on("callback_query", (ctx) => {
    if (ctx.gameShortName) {
        return ctx.answer({ url: `https://game.example.com/?u=${ctx.from.id}` });
    }
});
```

Минти ссылку, чтобы поделиться игрой вне Telegram: `https://t.me/<bot>?game=<short_name>`.

## 7. Хелпер «поделиться в чат» — `t.me/share/url`

Не апдейт бота — UX-хелпер, чтобы поделиться чем-то *из* бота. Заверни в URL-кнопку инлайн-клавиатуры:

```ts
import { InlineKeyboard } from "gramio";

const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(itemUrl)}&text=${encodeURIComponent("Зацени")}`;

const kb = new InlineKeyboard().url("📤 Поделиться", shareUrl);
```

И `url`, и `text` стоит прогнать через `encodeURIComponent`; `text` опционален.

## 8. Login widget — `t.me/login/<code>`

Флоу [Telegram Login Widget](https://core.telegram.org/widgets/login). Твой бот тут никогда не получатель — виджет постит данные авторизации обратно на твой **сайт** через JS-callback или редирект. Упомянуто для полноты; в коде бота не обрабатывается.

## Как открывать эти ссылки изнутри Mini App

Если твоему Mini App нужно *открыть* одну из этих `t.me/…` ссылок программно — отправить пользователя в чат, добавить бота в группу, прыгнуть в другое Mini App — используй **`Telegram.WebApp.openTelegramLink(url)`**, а **не** `openLink(url)`:

- **`openTelegramLink(url)`** обрабатывает ссылки `https://t.me/…` **нативно внутри Telegram** (открывает чат, запускает deep-ссылку, пикер добавления в группу, стартует другое Mini App). С **Bot API 7.0** Mini App остаётся открытым; до 7.0 он закрывался после вызова.
- **`openLink(url[, { try_instant_view }])`** — для **внешних** `http(s)` ссылок: открывает их во встроенном/внешнем браузере и никогда не закрывает Mini App. Передавать сюда `t.me/…` URL — не тот инструмент: ты гонишь Telegram-ссылку через вкладку браузера, которой потом приходится прыгать обратно в Telegram.

```ts
// Внутри Mini App (фронтенд) — открываем t.me-ссылку правильно
const url = `https://t.me/${botUsername}?startgroup=onboarding&admin=post_messages`;

Telegram.WebApp.openTelegramLink(url); // ✅ остаётся в Telegram, нативная обработка

// ❌ неправильно — откроет t.me-ссылку в браузере, потом прыжок обратно в Telegram
// Telegram.WebApp.openLink(url);

// openLink — для по-настоящему внешних URL:
Telegram.WebApp.openLink("https://example.com/docs", { try_instant_view: true });
```

> `openLink` нужно вызывать **в ответ на жест пользователя** (тап внутри Mini App). Для `openTelegramLink` предпочитай URL вида `https://t.me/…` — схема `tg://` не его вход.

## Грабли

- **`startapp` ≠ `/start`.** Payload Mini App приходит на **фронтенд** через `initDataUnsafe.start_param`. `bot.command("start", …)` его никогда не увидит.
- **Из Mini App открывай `t.me/…` ссылки через `openTelegramLink`, а не `openLink`.** `openLink` — для внешних URL, и он гонит Telegram-ссылки через браузер. (Bot API 7.0+ оставляет Mini App открытым на `openTelegramLink`; ранние версии закрывали.)
- **У `startgroup` два флоу.** Простой `?startgroup=<payload>` приходит как сообщение `/start@bot <payload>` (payload в `ctx.args`). А вот **вариант с `admin=`** (`?startgroup&admin=…`, `?startchannel&admin=…`) добавляет бота админом без сообщения `/start` и без payload — лови через `my_chat_member`, а контекст кодируй в самой ссылке.
- **`admin=` — это запрос, а не выдача.** Всегда проверяй через `ctx.newChatMember.canPostMessages?.()` и т.д. — пользователи регулярно снимают галочки.
- **Payload — открытый текст в URL.** Никогда не клади туда токены авторизации, email или чувствительные ID. Используй непрозрачные серверные токены.
- **`+` / `/` в обычном base64 тихо ломают ссылку.** Используй вариант `base64url`. Ссылка не отдаст 404 — она просто *потеряет* параметр.
- **Лимит в 64 символа реален.** Длинные JWT не влезут. Передавай короткий непрозрачный ID и поднимай JWT на сервере.

## Смотрите также

- [`command`](/ru/triggers/command) — обработка `/start` и `ctx.args`.
- [`inline query`](/ru/triggers/inline-query) — кнопка редиректа `start_parameter`.
- [Mini Apps](/ru/tma/overview) — как `start_param` доезжает до бэкенда.
- [Inline-клавиатура](/ru/keyboards/inline-keyboard) — `.url(...)` для рендера этих ссылок кнопками.
- [Updates](/ru/updates/overview) — `allowed_updates`, `chat_member` против `my_chat_member`.
- Спека Telegram: [core.telegram.org/api/links](https://core.telegram.org/api/links).
