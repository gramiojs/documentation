---
title: Сервер tdlight Bot API + @gramio/tdlight - юзерботы, доп. методы и типы

head:
    - - meta
      - name: "description"
        content: "Запустите собственный сервер tdlight-telegram-bot-api и получите полные типы TypeScript в GramIO с @gramio/tdlight. Режим пользователя (юзерботы), searchMessages/getChats, отложенные сообщения, прокси и неограниченный размер файлов — через declaration merging поверх @gramio/types."

    - - meta
      - name: "keywords"
        content: "tdlight, tdlight-telegram-bot-api, GramIO, юзербот telegram typescript, режим пользователя telegram bot api, searchMessages, getChats, getChatMembers, votePoll, отложенные сообщения send_at, прокси telegram bot api, @gramio/tdlight, declaration merging @gramio/types, tdlight docker, tdlight/tdlightbotapi, свой telegram bot api, неограниченный размер файлов"
---

# Сервер tdlight Bot API

[tdlight-telegram-bot-api](https://github.com/tdlight-team/tdlight-telegram-bot-api) — это форк сообщества от открытого [сервера Bot API](https://github.com/tdlib/telegram-bot-api) от Telegram, построенный на лёгкой библиотеке **TDLight**. Это drop-in замена: он говорит на стандартном Bot API **плюс** добавляет набор дополнительных методов, дополнительные поля у существующих объектов и — своя главная фишка — экспериментальный **режим пользователя**, позволяющий управлять реальным аккаунтом (*юзербот*), а не только ботом.

GramIO работает с ним так же, как с любым своим сервером — через [`api.baseURL`](/ru/bot-class). Не хватало только **типов**: вызов `searchMessages` или чтение `message.views` были без типов. Это и добавляет [`@gramio/tdlight`](https://github.com/gramiojs/tdlight).

> [!IMPORTANT]
> `@gramio/tdlight` — пакет **только с типами**. Он дополняет [`@gramio/types`](/ru/types) через declaration merging TypeScript, чтобы `bot.api.*` и объекты ответов получили поверхность tdlight. Рантайма нет — вы по-прежнему направляете GramIO на сервер tdlight через `api.baseURL`. Впервые поднимаете свой сервер? Сначала прочитайте гайд [Локальный сервер Bot API](/ru/bot-api/local); всё оттуда (суффикс `/bot`, нюанс скачивания файлов, загрузка до 2 ГБ) применимо и к tdlight.

## Зачем tdlight

Стандартный Bot API намеренно узок: бот видит только чаты, в которые его добавили, не умеет искать, не может получить полный список участников группы, не умеет откладывать сообщения и никогда не может действовать как пользователь. tdlight снимает эти ограничения.

| Возможность | Облачный API | Официальный локальный (`--local`) | **tdlight** |
|---|---|---|---|
| Загрузка 2 ГБ, скачивание без лимита, пути `file://` | — | ✅ | ✅ |
| Неограниченный **размер** файлов (`--no-file-limit`) | — | — | ✅ |
| **Режим пользователя** — действовать как реальный аккаунт (юзербот) | — | — | ✅ |
| Глобальный поиск сообщений (`searchMessages`) | — | — | ✅ |
| Список всех ваших чатов (`getChats`) | — | — | ✅ |
| Полный список участников (`getChatMembers`) | частично | частично | ✅ (до 200/страница) |
| Отложенные сообщения (`send_at`) | — | — | ✅ |
| Прокси MTProto | — | — | ✅ |
| `views` / `forwards` у сообщений | — | — | ✅ |
| Флаги `is_scam` / `is_fake` / `is_verified` | — | — | ✅ |

Если вам нужен обычный бот с увеличенными лимитами файлов — [официальный локальный сервер](/ru/bot-api/local) проще и проверен временем, используйте его. Берите tdlight, когда нужен именно режим пользователя или дополнительные методы чтения.

> [!WARNING]
> **Режим пользователя экспериментальный и рискованный.** Вход реального аккаунта на сторонний сервер и его автоматизация могут привести к **ограничению или блокировке** аккаунта со стороны Telegram, особенно при массовых действиях (массовые вступления, добавление участников, скрейпинг). Используйте одноразовый/второстепенный аккаунт, держите низкую частоту запросов и никогда не запускайте режим пользователя на аккаунте, который не готовы потерять. Сам tdlight помечает поддержку пользователей как экспериментальную.

## Установка

::: pm-add @gramio/tdlight
:::

`@gramio/tdlight` объявляет [`@gramio/types`](/ru/types) как peer-зависимость — она у вас уже есть транзитивно через `gramio`.

## Точки входа — берите минимальную поверхность

Declaration merging работает **глобально на импорт**, поэтому пакет разделён по режимам. Импортируйте только нужное — и ваш `bot.api` не будет засорён методами, которые нельзя вызвать с вашим токеном.

| Импорт | Добавляет в `bot.api` / объекты | Когда использовать |
|---|---|---|
| `@gramio/tdlight` | поля объектов + **методы для ботов** (`ping`, `getChatMembers`, `getMessageInfo`, прокси…), параметры отложки, диапазонный `deleteMessages` | Обычный **токен бота** на сервере tdlight — безопасный вариант по умолчанию |
| `@gramio/tdlight/all` | всё вышеперечисленное **плюс** методы только для пользователя (`searchMessages`, `votePoll`, `getChats`, флоу авторизации…) | **Юзербот** (токен `/user`), которому нужны обе поверхности |
| `@gramio/tdlight/user` | поля объектов + **только** методы для пользователя | Нужна только пользовательская «дельта» |

Импорт — это одноразовый сайд-эффект: сделайте его один раз (например, в точке входа), и типы применятся везде.

```ts
// типы применяются глобально для всего приложения
import "@gramio/tdlight";
```

## Быстрый старт (режим бота)

Сервер tdlight в режиме бота ведёт себя как официальный локальный сервер, с дополнительными методами сверху.

```ts
import { Bot } from "gramio";
import "@gramio/tdlight"; // дополняет bot.api методами tdlight для режима бота

const bot = new Bot(process.env.BOT_TOKEN as string, {
    api: {
        baseURL: "http://localhost:8081/bot", // ваш сервер tdlight — сохраните суффикс /bot
    },
});

bot.command("ping", async (ctx) => {
    const seconds = await bot.api.ping(); // number — задержка MTProto
    await ctx.reply(`pong за ${seconds.toFixed(3)} с`);
});

bot.command("admins", async (ctx) => {
    const admins = await bot.api.getChatMembers({
        chat_id: ctx.chatId,
        filter: "admins",
    });
    await ctx.reply(`${admins.length} админов`);
});

bot.start();
```

> Суффикс `/bot` важен: GramIO строит URL запроса как `${baseURL}${token}/${method}`. `"http://localhost:8081/bot"` ✅ · `"http://localhost:8081"` ❌ (токен приклеится к хосту). См. [Локальный сервер Bot API](/ru/bot-api/local).

## Запуск сервера tdlight (Docker)

tdlight публикует мультиархитектурный образ в Docker Hub (`tdlight/tdlightbotapi`) и GHCR (`ghcr.io/tdlight-team/tdlightbotapi`). Как и в официальном образе, entrypoint-скрипт сопоставляет переменные окружения `TELEGRAM_*` с флагами CLI.

Нужны `api_id` / `api_hash` с [my.telegram.org](https://my.telegram.org) (идентифицируют ваше *приложение*, не бота) — ровно как для [официального локального сервера](/ru/bot-api/local). И так же: токен бота нельзя одновременно использовать в облаке и на локальном сервере — вызовите [`logOut`](/telegram/methods/logOut) на облачном API один раз перед переводом бота.

::: code-group

```sh [docker run]
docker run -d --name tdlight \
  -e TELEGRAM_API_ID=123456 \
  -e TELEGRAM_API_HASH=your_api_hash \
  -e TELEGRAM_LOCAL=1 \
  -p 8081:8081 \
  -v tdlight-data:/var/lib/telegram-bot-api \
  tdlight/tdlightbotapi:latest
```

```yaml [docker-compose.yml]
services:
  tdlight:
    image: tdlight/tdlightbotapi:latest
    restart: unless-stopped
    environment:
      TELEGRAM_API_ID: ${TELEGRAM_API_ID}
      TELEGRAM_API_HASH: ${TELEGRAM_API_HASH}
      TELEGRAM_LOCAL: 1            # локальный режим: большие файлы, file_path на диске
      TELEGRAM_ALLOW_USERS: 1      # включить режим пользователя (опустите для режима только бота)
      # TELEGRAM_ALLOW_USERS_REGISTRATION: 1  # разрешить registerUser (новые аккаунты)
    volumes:
      - tdlight-data:/var/lib/telegram-bot-api
    ports:
      - "8081:8081"

volumes:
  tdlight-data:
```

:::

> [!WARNING]
> **Имена переменных окружения у tdlight свои — не копируйте их из официального образа.** Они пересекаются, но отличаются: tdlight использует `TELEGRAM_STAT` (только наличие — включает порт статистики 8082), `TELEGRAM_MAX_BATCH` (→ `--max-batch-operations`), `TELEGRAM_STAT_HIDE_SENSIBLE_DATA`, `TELEGRAM_NO_FILE_LIMIT` и т. д. HTTP-порт **жёстко зашит как 8081** в entrypoint — переменной `TELEGRAM_HTTP_PORT` нет. Чтобы его сменить, нужно передать полную команду (любой позиционный аргумент заставляет entrypoint выполнить её как есть, пропустив обработку переменных).

Соберите образ сами из `Dockerfile` в репозитории (Alpine, не от root), если хотите зафиксировать конкретный коммит. Рабочая директория — `/var/lib/telegram-bot-api` (как в официальном образе), поэтому [схема раздачи файлов через nginx](/ru/bot-api/local) переносится без изменений.

## Режим пользователя (юзерботы)

Режим пользователя позволяет `@gramio/tdlight` управлять **реальным аккаунтом**. Запросы идут на `/user{token}/…` вместо `/bot{token}/…`, и многие дополнительные методы (`searchMessages`, `getChats`, `votePoll`, …) работают только здесь. Включите его на сервере через `TELEGRAM_ALLOW_USERS=1` (и `TELEGRAM_ALLOW_USERS_REGISTRATION=1`, только если нужно регистрировать новые аккаунты).

### Флоу авторизации

Токен пользователя не существует заранее — вы получаете его, войдя в аккаунт. Это **не** обычный вызов метода: вход начинается с `POST` без имени метода на `/user{token}/` с номером телефона, затем идёт код → пароль 2FA → (опционально) регистрация. Каждый шаг возвращает [`AuthorizationState`](#новые-объекты).

Поскольку у первого шага нет имени метода, он не может идти через `bot.api.*` — его делают обычным `fetch` (рантайм-хелпер для входа запланирован в будущем релизе). Когда у вас уже есть токен пользователя, последующие шаги — это **типизированные** методы:

```ts
import { Bot } from "gramio";
import "@gramio/tdlight/all";

const SERVER = "http://localhost:8081";

// Шаг 1 — начать вход (без метода) и получить токен пользователя + состояние
const res = await fetch(`${SERVER}/userlogin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number: "+1555..." }),
});
const { result } = (await res.json()) as {
    result: { token: string; authorization_state: string };
};
const USER_TOKEN = result.token;

// Шаг 2+ — теперь используем типизированный Bot, направленный на /user{token}
const userbot = new Bot(USER_TOKEN, {
    api: { baseURL: `${SERVER}/user` }, // обратите внимание: /user, не /bot
});

// отправляем код, который только что пришёл аккаунту (вернёт следующий AuthorizationState)
const afterCode = await userbot.api.authCode({ code: 12345 });

// если у аккаунта включена 2FA:
if (afterCode.authorization_state === "wait_password") {
    await userbot.api.authPassword({ password: process.env.TWO_FA as string });
}

// аккаунт авторизован — управляем им как юзерботом
const hits = await userbot.api.searchMessages({ query: "счёт", limit: 50 });
```

> [!NOTE]
> Часть стандартных методов **недоступна в режиме пользователя** (у пользователя нет `answerCallbackQuery`, `setMyCommands`, методов наборов стикеров и платежей, нельзя прикреплять `reply_markup`). А поскольку в чатах без ботов не создаются message-entities для команд, ваши обработчики `bot.command(...)` для юзербота могут вообще не срабатывать — управляйте им императивно или через `bot.on("message", …)`.

## Дополнительные методы

Все имена методов ниже — те, что сервер tdlight **реально маршрутизирует** (он приводит входящее имя к нижнему регистру). Несколько имён в OpenAPI-спецификации tdlight неверны и приведут к `404` — `@gramio/tdlight` типизирует реальные маршруты. См. [Ловушки в именах методов](#ловушки-в-именах-методов).

### Участники и инфо

```ts
import "@gramio/tdlight";

// полный список участников с фильтром и постраничностью (доступно ботам)
const banned = await bot.api.getChatMembers({
    chat_id: -1001234567890,
    filter: "banned",
    offset: 0,
    limit: 200,
});

// `getParticipants` — алиас `getChatMembers` (тот же обработчик)
const all = await bot.api.getParticipants({ chat_id: -1001234567890 });

// полная информация по одному сообщению
const msg = await bot.api.getMessageInfo({ chat_id: -1001234567890, message_id: 42 });
```

### Чаты

Режим пользователя (`@gramio/tdlight/all` или `/user`):

```ts
import "@gramio/tdlight/all";

const chats = await userbot.api.getChats();                       // все ваши чаты
const common = await userbot.api.getCommonChats({ user_id: 777 }); // общие чаты с пользователем
const found = await userbot.api.searchPublicChats({ query: "gramio" });
await userbot.api.joinChat({ invite_link: "https://t.me/+abc123" });
const created = await userbot.api.createChat({
    title: "Проект X",
    type: "supergroup",
    description: "секретные планы",
});
```

### Сообщения и отложка

```ts
import "@gramio/tdlight/all";

const results = await userbot.api.searchMessages({ query: "дедлайн", limit: 100 });
const inChat = await userbot.api.searchChatMessages({
    chat_id: -1001234567890,
    query: "релиз",
    from_user_id: 777,
});
const scheduled = await userbot.api.getScheduledMessages({ chat_id: 777 });
```

### Взаимодействие

```ts
import "@gramio/tdlight/all";

// проголосовать в опросе  ⚠ маршрут — `votePoll`, НЕ `setPollAnswer`
await userbot.api.votePoll({ chat_id: -100..., message_id: 42, option_ids: [0, 2] });

// нажать callback-кнопку и прочитать, что ответил бы исходный бот
const answer = await userbot.api.getCallbackQueryAnswer({
    chat_id: -100...,
    message_id: 42,
    callback_data: "buy:item-7",
});
```

### Прокси

Управление прокси MTProto, через которые подключается сервер (доступно ботам):

```ts
import "@gramio/tdlight";

const proxy = await bot.api.addProxy({
    server: "1.2.3.4",
    port: 443,
    type: "mtproto",
    secret: "ee...",
});
await bot.api.enableProxy({ proxy_id: proxy.id });
const proxies = await bot.api.getProxies(); // TdlightProxy[]
```

## Отложенные сообщения

tdlight добавляет `send_at` (и `repeat_period`) ко всему семейству отправки/копирования/пересылки. Передайте Unix-таймстамп (не дальше 365 дней) или строку `"online"`, чтобы отправить, когда получатель в следующий раз будет онлайн. У отложенных сообщений **отрицательный** `message_id`.

```ts
import "@gramio/tdlight";

// отправить, когда получатель появится онлайн
await bot.api.sendMessage({ chat_id: 777, text: "ping", send_at: "online" });

// отправить в конкретное время
await bot.api.sendDocument({
    chat_id: 777,
    document: "BQACAgI...",
    send_at: Math.floor(Date.now() / 1000) + 3600, // через 1 час
});

// перепланировать (или отправить сейчас) существующее отложенное сообщение
await bot.api.editMessageScheduling({ chat_id: 777, message_id: -5, send_at: "online" });
```

## Удаление диапазона сообщений

tdlight расширяет [`deleteMessages`](/telegram/methods/deleteMessages) **диапазонной** формой `start`/`end` (только супергруппы, `start < end`, ограничено `--max-batch-operations`, по умолчанию 10000). `@gramio/tdlight` типизирует `start?` и `end?` в параметрах.

```ts
import "@gramio/tdlight";

// стандартная форма (без изменений)
await bot.api.deleteMessages({ chat_id: -100..., message_ids: [10, 11, 12] });

// диапазонная форма tdlight — удалить всё с id 100 по 500
await bot.api.deleteMessages({ chat_id: -100..., message_ids: [], start: 100, end: 500 });
```

> [!NOTE]
> **Известное ограничение:** `@gramio/types` типизирует `message_ids` как **обязательное**, а declaration merging в TypeScript не может сделать обязательное поле необязательным. Поэтому диапазонная форма всё равно требует `message_ids` по типам — передавайте `[]`. Чистое решение — на стороне upstream (сделать `message_ids` необязательным в `@gramio/types`).

## Дополнительные поля объектов

Дополнение добавляет доп. поля tdlight (все необязательные) к объектам, которые вы и так читаете из контекста, поэтому они типизированы везде, где появляется `User` / `Chat` / `Message` / участник чата:

```ts
import "@gramio/tdlight";

bot.on("message", (ctx) => {
    // доп. поля User
    if (ctx.from?.is_scam) return; // is_scam / is_fake / is_verified / is_deleted
    const seen = ctx.from?.user_status; // "online" | "offline" | "recently" | ...

    // доп. поля Message (каналы)
    const views = ctx.views;       // number | undefined
    const forwards = ctx.forwards;  // number | undefined
});
```

| Объект | Поля tdlight |
|---|---|
| `User` | `is_verified` · `is_scam` · `is_fake` · `is_deleted` · `user_status` · `last_seen` |
| `Chat` | `is_verified` · `is_scam` · `is_fake` · `distance` |
| `Message` | `views` · `forwards` · `is_scheduled` · `scheduled_at` |
| участники чата | `joined_date` · `inviter` |

### Новые объекты

`@gramio/tdlight` также экспортирует три новых типа объектов (из любой точки входа):

- **`AuthorizationState`** — возвращается флоу авторизации.
- **`CallbackQueryAnswer`** — возвращается `getCallbackQueryAnswer`.
- **`TdlightProxy`** — возвращается `getProxies` / `addProxy`.

```ts
import type { AuthorizationState, TdlightProxy } from "@gramio/tdlight";
```

## Ловушки в именах методов

OpenAPI-спецификация tdlight документирует несколько имён методов, которые сервер на самом деле не маршрутизирует. `@gramio/tdlight` типизирует **реальные** маршруты (сверено с исходниками сервера на C++), чтобы вы не ловили молчаливые `404`:

| Используйте ✅ | Не это ❌ (404) |
|---|---|
| `votePoll` | `setPollAnswer` |
| `getMemoryStats` | `optimizeMemory` |
| `addChatMembers` (мн. ч.) | `addChatMember` |
| `getParticipants` (алиас `getChatMembers`) | — |
| вход через `POST` без метода | `userLogin` (такого метода нет) |

> [!NOTE]
> `getMemoryStats`, `toggleGroupInvites` и `reportChat` **принимаются, но являются no-op / не реализованы** в текущих сборках tdlight — они типизированы (с пометкой в JSDoc) для полноты, но полагаться на их эффект не стоит.

## Скачивание файлов

Работа с файлами идентична [официальному локальному серверу](/ru/bot-api/local): в режиме `--local` [`getFile`](/telegram/methods/getFile) возвращает **абсолютный путь на диске**, а не URL, поэтому `ctx.download()` не сработает в раздельном развёртывании. Раздавайте файлы по [схеме с nginx-сайдкаром](/ru/bot-api/local) — она переносится без изменений, потому что tdlight использует ту же рабочую директорию `/var/lib/telegram-bot-api`.

## Переменные окружения (специфичные для tdlight)

Правило `--some-option` → `TELEGRAM_SOME_OPTION` в основном работает, но **у tdlight свои имена** для некоторых — не копируйте их из официального образа.

| Переменная | Флаг | Примечания |
|---|---|---|
| `TELEGRAM_API_ID` *(обязательно)* | `--api-id` | с [my.telegram.org](https://my.telegram.org) |
| `TELEGRAM_API_HASH` *(обязательно)* | `--api-hash` | с [my.telegram.org](https://my.telegram.org) |
| `TELEGRAM_LOCAL` | `--local` | только наличие — большие файлы, `file_path` на диске |
| `TELEGRAM_ALLOW_USERS` | `--allow-users` | `1` — включить режим пользователя |
| `TELEGRAM_ALLOW_USERS_REGISTRATION` | `--allow-users-registration` | `1` — разрешить `registerUser` |
| `TELEGRAM_NO_FILE_LIMIT` | `--no-file-limit` | только наличие — снять лимит размера файла |
| `TELEGRAM_MAX_BATCH` | `--max-batch-operations` | лимит диапазонного удаления (по умолч. 10000) |
| `TELEGRAM_HTTP_IDLE_TIMEOUT` | `--http-idle-timeout` | секунды; по умолч. 500 |
| `TELEGRAM_STAT` | `--http-stat-port=8082` | только наличие — включает порт статистики |
| `TELEGRAM_STAT_HIDE_SENSIBLE_DATA` | `--stats-hide-sensible-data` | скрыть токен/вебхук на странице статистики |
| `TELEGRAM_INSECURE` | `--insecure` | разрешить HTTP вне локального режима |
| `TELEGRAM_RELATIVE` | `--relative` | разрешить только относительные пути в локальном режиме |
| `TELEGRAM_VERBOSITY` | `--verbosity` | уровень логов (0–4, 1024) |
| `TELEGRAM_PROXY` | `--proxy` | прокси для исходящих вебхуков |
| `TELEGRAM_WORK_DIR` | `--dir` | по умолч. `/var/lib/telegram-bot-api` |
| `TELEGRAM_TEMP_DIR` | `--temp-dir` | по умолч. `/tmp/telegram-bot-api` |

HTTP-порт API **жёстко зашит как 8081** в entrypoint (переменной нет). `TELEGRAM_API_ID`/`TELEGRAM_API_HASH` передавайте напрямую — бинарник читает их из окружения.

## Смотрите также

- [Локальный сервер Bot API](/ru/bot-api/local) — официальный сервер; подготовка, скачивание файлов и загрузка до 2 ГБ применимы и к tdlight
- [@gramio/types](/ru/types) — пакет, который дополняет `@gramio/tdlight`
- [Конфигурация бота](/ru/bot-class) — `api.baseURL` и другие опции
- [`logOut`](/telegram/methods/logOut) · [`getFile`](/telegram/methods/getFile) · [`deleteMessages`](/telegram/methods/deleteMessages)
