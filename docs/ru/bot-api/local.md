---
title: Локальный сервер Bot API - Запуск Telegram Bot API с GramIO

head:
    - - meta
      - name: "description"
        content: "Запустите собственный сервер Telegram Bot API с GramIO. Загружайте файлы до 2 ГБ, скачивайте без ограничений и раздавайте файлы по HTTP без токена бота в ссылке — с помощью официального Docker-образа gramiojs/telegram-bot-api."

    - - meta
      - name: "keywords"
        content: "telegram бот, GramIO, локальный сервер bot api, свой telegram bot api, telegram-bot-api docker, загрузка 2 ГБ, большие файлы telegram бот, api.baseURL, getFile локальный путь, tdlib bot api, docker, nginx, скачивание файлов telegram бот"
---

# Локальный сервер Bot API

По умолчанию GramIO обращается к облачному Bot API Telegram по адресу `https://api.telegram.org`. Вместо этого вы можете запустить **собственный** [сервер Telegram Bot API](https://github.com/tdlib/telegram-bot-api) и направить GramIO на него.

GramIO публикует готовый образ: **`ghcr.io/gramiojs/telegram-bot-api`** (а также `gramiojs/telegram-bot-api` на Docker Hub) — мультиархитектурный, не от root, с healthcheck, подписанный и автоматически пересобираемый при обновлениях upstream.

> [!TIP]
> Нужен **режим пользователя** (управлять реальным аккаунтом как юзерботом), поиск сообщений, `getChats` или отложенные сообщения? Это есть в [форке tdlight](/ru/bot-api/tdlight) — используйте типизированный слой [`@gramio/tdlight`](/ru/bot-api/tdlight). Для обычного бота с увеличенными лимитами файлов проще и надёжнее официальный образ с этой страницы.

## Зачем свой сервер

| | Облачный API | Локальный сервер (`--local`) |
|---|---|---|
| Загрузка | 50 МБ | **2 ГБ** |
| Скачивание | 20 МБ | **без ограничений** |
| Загрузка с диска | — | **локальный путь `file://`** |
| Результат `getFile` | URL для скачивания | **абсолютный путь на диске** |
| Вебхуки | HTTPS, фиксированные порты | **HTTP, любой IP/порт** |

Если вам нужны только небольшие файлы и стандартные лимиты — облачный API проще, оставайтесь на нём.

## Что нужно заранее

Нужны **два разных набора данных** — не перепутайте:

| Данные | Идентифицируют | Где взять |
|---|---|---|
| `BOT_TOKEN` | вашего **бота** | [@BotFather](https://t.me/BotFather) → `/newbot` (у вас уже есть) |
| `api_id` + `api_hash` | ваше **приложение** (нужно для локального сервера) | [my.telegram.org](https://my.telegram.org) — шаги ниже |

**Как получить `api_id` / `api_hash` (один раз, ~1 мин):**

1. Откройте [my.telegram.org](https://my.telegram.org) и войдите по **номеру телефона вашего аккаунта Telegram** (вашего личного, *не* бота — код придёт в Telegram).
2. Нажмите **API development tools**.
3. Заполните любые **App title** и **Short name** (платформа: *Other*) → **Create application**.
4. Скопируйте **`api_id`** (число) и **`api_hash`** (длинная строка). Храните хеш в секрете.

Затем **сначала выйдите из облачного API** — один токен бота нельзя использовать в облаке и на локальном сервере одновременно. Вызовите [`logOut`](/telegram/methods/logOut) один раз, затем запускайте локальный сервер. Вход в облако будет недоступен ещё ~10 минут.

```ts twoslash
import { Bot } from "gramio";

const cloudBot = new Bot(process.env.BOT_TOKEN as string);
// ---cut---
// Выполните один раз на облачном API, перед переходом на локальный сервер
await cloudBot.api.logOut();
```

## Запуск сервера

::: code-group

```sh [docker run]
docker run -d --name telegram-bot-api \
  -e TELEGRAM_API_ID=123456 \
  -e TELEGRAM_API_HASH=your_api_hash \
  -p 8081:8081 \
  -v telegram-bot-api-data:/var/lib/telegram-bot-api \
  ghcr.io/gramiojs/telegram-bot-api:latest
```

```yaml [docker-compose.yml]
services:
  telegram-bot-api:
    image: ghcr.io/gramiojs/telegram-bot-api:latest
    restart: unless-stopped
    environment:
      TELEGRAM_API_ID: ${TELEGRAM_API_ID}
      TELEGRAM_API_HASH: ${TELEGRAM_API_HASH}
    volumes:
      - telegram-bot-api-data:/var/lib/telegram-bot-api
    ports:
      - "8081:8081"

volumes:
  telegram-bot-api-data:
```

:::

Образ по умолчанию запускается с `--local`. Установите `TELEGRAM_LOCAL=0`, чтобы сохранить привычный способ скачивания по URL (см. [Скачивание файлов](#скачивание-файлов)).

Образ — компактная (~50 МБ) Alpine-сборка, мультиархитектурная (`amd64` + `arm64`), не от root, подписанная.

## Подключение GramIO

Укажите `api.baseURL` на ваш сервер. **Сохраните суффикс `/bot`** — GramIO дописывает токен после него.

```ts twoslash
import { Bot } from "gramio";
// ---cut---
const bot = new Bot(process.env.BOT_TOKEN as string, {
    api: {
        baseURL: "http://localhost:8081/bot",
    },
});
```

В Docker используйте имя сервиса вместо `localhost`, например `http://telegram-bot-api:8081/bot`.

## Скачивание файлов

Именно здесь обычно возникают сложности. В режиме `--local` метод [`getFile`](/telegram/methods/getFile) возвращает **абсолютный путь в файловой системе сервера** (например, `/var/lib/telegram-bot-api/<bot_id>/documents/file_5.jpg`), а **не** URL для скачивания.

Если бот работает в **отдельном контейнере/хосте от сервера** (обычный случай), он не может прочитать этот путь с диска, а `ctx.download()` / `bot.downloadFile()` — которые строят URL вида `…/file/bot<token>/<path>` — не работают с `--local`.

### Проще всего: встроенный файловый сервер (`FILE_SERVER=1`)

Образ умеет раздавать файлы сам — без sidecar и доп. сервиса. Установите `FILE_SERVER=1`, и контейнер дополнительно запустит nginx, который раздаёт рабочую директорию по HTTP по **путевым ссылкам без токена** (`http://host:8080/<bot_id>/documents/file.jpg`). По умолчанию **выключено**; включается одной переменной. Это самый простой вариант на платформах с одним образом (Coolify, Dokploy, Railway, …):

```sh
docker run -d --name telegram-bot-api \
  -e TELEGRAM_API_ID=123456 \
  -e TELEGRAM_API_HASH=your_api_hash \
  -e FILE_SERVER=1 \
  -p 8081:8081 -p 8080:8080 \
  -v telegram-bot-api-data:/var/lib/telegram-bot-api \
  ghcr.io/gramiojs/telegram-bot-api:latest
```

Затем превратите абсолютный `file_path` в URL для скачивания (замена префикса), указывая порт файлового сервера:

```ts
const file = await bot.api.getFile({ file_id: ctx.document!.fileId });
const rel = file.file_path!.replace("/var/lib/telegram-bot-api/", "");
const url = `http://telegram-bot-api:8080/${rel}`; // без токена
```

`FILE_SERVER_PORT` (по умолчанию `8080`) меняет порт. Нужен один процесс на контейнер? Используйте sidecar nginx ниже.

### Альтернатива: отдельный sidecar nginx

Запустите sidecar `nginx`, который монтирует том рабочей директории сервера **только для чтения** и раздаёт его по HTTP. Ссылки основаны на пути, поэтому **токен бота в них не попадает**.

`nginx/telegram-files.conf`:

```nginx
server {
    listen 80;
    location / {
        root /var/lib/telegram-bot-api;  # смонтировано только для чтения
        autoindex off;
    }
}
```

Overlay для compose:

```yaml
services:
  nginx:
    image: nginx:alpine
    depends_on:
      telegram-bot-api:
        condition: service_healthy
    volumes:
      - telegram-bot-api-data:/var/lib/telegram-bot-api:ro
      - ./nginx/telegram-files.conf:/etc/nginx/conf.d/default.conf:ro
    ports:
      - "8080:80"
```

Затем превратите абсолютный `file_path` в URL для скачивания, заменив префикс рабочей директории на базовый URL nginx:

```ts
import { Bot } from "gramio";

const FILES_BASE_URL = "http://localhost:8080";
const WORK_DIR = "/var/lib/telegram-bot-api";

const bot = new Bot(process.env.BOT_TOKEN as string, {
    api: { baseURL: "http://telegram-bot-api:8081/bot" },
});

bot.on("message", async (ctx) => {
    const fileId = ctx.document?.fileId;
    if (!fileId) return;

    const file = await bot.api.getFile({ file_id: fileId });
    if (!file.file_path) return;

    // /var/lib/telegram-bot-api/123/documents/x.pdf -> http://localhost:8080/123/documents/x.pdf
    const rel = file.file_path.replace(`${WORK_DIR}/`, "");
    const url = `${FILES_BASE_URL}/${rel}`;

    await ctx.reply(`Скачать: ${url}`); // в этой ссылке нет токена
});
```

nginx нативно поддерживает [range-запросы](https://developer.mozilla.org/ru/docs/Web/HTTP/Range_requests), поэтому скачивание файлов на несколько ГБ корректно возобновляется. Нужен контроль доступа? Добавьте HTTP basic auth, список разрешённых IP или nginx `secure_link` — всё это опционально и по умолчанию выключено.

### Альтернативы

- **Бот разделяет том.** Если контейнер бота монтирует тот же том, просто читайте `file.file_path` с диска через `fs`/`Bun.file` — nginx не нужен.
- **Отключить `--local`.** С `TELEGRAM_LOCAL=0` сервер сам скачивает файлы и отдаёт их по привычному URL `…/file/bot<token>/<path>`, поэтому `ctx.download()` продолжает работать — но вы теряете загрузку 2 ГБ и скачивание без лимитов.

## Загрузка больших файлов

Локальный сервер поднимает лимит загрузки до **2 ГБ** (облачный API ограничивает документы 50 МБ — без локального сервера это не обойти). На локальный сервер **обычная загрузка работает до 2 ГБ** — ничего особенного не нужно:

```ts
import { Bot, MediaUpload } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string, {
    api: { baseURL: "http://localhost:8081/bot" },
});

bot.on("message", (ctx) =>
    // стримится по HTTP на ваш локальный сервер — до 2 ГБ
    ctx.sendDocument(MediaUpload.path("./big-archive.zip")),
);
```

Если файл уже лежит **на диске самого сервера** (бот рядом или общий том), `MediaUpload.localPath()` — это **оптимизация**: сервер читает его напрямую через схему `file://`, и байты не передаются по HTTP:

```ts
ctx.sendDocument(MediaUpload.localPath("/var/data/big-archive.zip"));
```

См. [руководство по загрузке медиа](/files/media-upload) и [`sendDocument`](/telegram/methods/sendDocument).

> [!TIP]
> Для очень больших файлов предпочитайте `MediaUpload.stream(...)` вместо `MediaUpload.path(...)` — последний сейчас читает весь файл в память.

## Вебхуки

Локальный сервер принимает **HTTP**-вебхуки на любом IP и порту (облачный API требует HTTPS на фиксированном наборе портов). См. [Webhook](/ru/updates/webhook).

## Переменные окружения

Доступны все опции `telegram-bot-api` в виде переменных окружения — правило: `--some-option` → `TELEGRAM_SOME_OPTION`.

| Переменная | Флаг | По умолчанию | Описание |
|---|---|---|---|
| `TELEGRAM_API_ID` *(обязательно)* | `--api-id` | — | идентификатор приложения с [my.telegram.org](https://my.telegram.org) |
| `TELEGRAM_API_HASH` *(обязательно)* | `--api-hash` | — | хеш приложения с [my.telegram.org](https://my.telegram.org) |
| `TELEGRAM_LOCAL` | `--local` | `1` | включить локальный режим (`0` чтобы отключить) |
| `FILE_SERVER` | *(встроенный nginx)* | `0` | раздавать рабочую директорию по HTTP (`1` чтобы включить) |
| `FILE_SERVER_PORT` | *(встроенный nginx)* | `8080` | порт встроенного файлового сервера |
| `TELEGRAM_WORK_DIR` | `--dir` | `/var/lib/telegram-bot-api` | рабочая директория сервера |
| `TELEGRAM_TEMP_DIR` | `--temp-dir` | `/tmp/telegram-bot-api` | директория для временных файлов |
| `TELEGRAM_HTTP_PORT` | `--http-port` | `8081` | HTTP-порт |
| `TELEGRAM_STAT_PORT` | `--http-stat-port` | `8082` | порт статистики (его использует healthcheck) |
| `TELEGRAM_HTTP_IP_ADDRESS` | `--http-ip-address` | — | локальный IP для приёма HTTP-соединений |
| `TELEGRAM_HTTP_STAT_IP_ADDRESS` | `--http-stat-ip-address` | — | локальный IP для приёма соединений статистики |
| `TELEGRAM_FILTER` | `--filter` | — | `<остаток>/<модуль>` — шардирование ботов между серверами |
| `TELEGRAM_MAX_WEBHOOK_CONNECTIONS` | `--max-webhook-connections` | — | макс. число webhook-соединений на бота |
| `TELEGRAM_MAX_CONNECTIONS` | `--max-connections` | — | максимальное число открытых файловых дескрипторов |
| `TELEGRAM_PROXY` | `--proxy` | — | HTTP-прокси для исходящих webhook-запросов (`http://host:port`) |
| `TELEGRAM_LOG_FILE` | `--log` | — | путь к файлу лога |
| `TELEGRAM_LOG_MAX_FILE_SIZE` | `--log-max-file-size` | `2000000000` | макс. размер файла лога в байтах до ротации |
| `TELEGRAM_VERBOSITY` | `--verbosity` | — | уровень детализации логов |
| `TELEGRAM_MEMORY_VERBOSITY` | `--memory-verbosity` | `3` | уровень детализации логов в памяти |
| `TELEGRAM_USERNAME` | `--username` | — | имя пользователя, под которым работать |
| `TELEGRAM_GROUPNAME` | `--groupname` | — | имя группы, под которой работать |
| `TELEGRAM_CPU_AFFINITY` | `--cpu-affinity` | — | CPU affinity как 64-битная маска |
| `TELEGRAM_MAIN_THREAD_AFFINITY` | `--main-thread-affinity` | — | CPU affinity главного потока |

`TELEGRAM_API_ID` / `TELEGRAM_API_HASH` также принимают суффикс `_FILE` для чтения значения из файла (секреты Docker/Kubernetes). Любые дополнительные аргументы, переданные контейнеру, добавляются к `telegram-bot-api` без изменений.

## Проверка работы

```sh
# эндпоинт статистики отвечает
curl http://localhost:8082/

# контейнер здоров
docker inspect --format '{{.State.Health.Status}}' telegram-bot-api
```

## Смотрите также

- [Скачивание файлов](/files/download) — помощники GramIO для скачивания
- [`logOut`](/telegram/methods/logOut) · [`close`](/telegram/methods/close) — переход с облачного API
- [`getFile`](/telegram/methods/getFile) · [`sendDocument`](/telegram/methods/sendDocument)
- [Сервер tdlight Bot API](/ru/bot-api/tdlight) — форк с режимом пользователя, доп. методами и неограниченным размером файлов
