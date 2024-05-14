---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

head:
    - - meta
      - property: "title"
        content: GramIO - Telegram Bot API фреймворк для TypeScript/JavaScript

    - - meta
      - name: "description"
        content: GramIO это TypeScript/JavaScript фреймворк для создания Телеграм ботов. Чтобы начать, вы можете ввести в консоль "npx create gramio bot-dir" и запустить своего бота с помощью "npm run dev". Это всё что вам нужно чтобы начать работать с GramIO.

hero:
    name: "GramIO"
    text: "Создавай ботов с удобством!"
    image:
        src: /logo.svg
    actions:
        - theme: brand
          text: Начало
          link: /get-started
        # - theme: alt
        #   text: API Examples
        #   link: /api-examples
features:
    - title: Ещё
      details:
    - title: не совсем готов (может быть)
      details:
    - icon: ✨
      title: Легко расширяется
      details: Наша система плагинов и хуков потрясающая
    - icon: ⚙️
      title: Используется кодо-генерация
      details: Многие части библиотеки кодо-генерируются
    - icon: 🛡️
      title: Умные типы
      details: Написана на TypeScript с любовью ❤️
    - icon: 🌐
      title: Работает в разных рантаймах
      details: Работает на Node.js, Bun и Deno*
---

**Deno\*** [windows-специфичный issue с библиотекой undici](https://github.com/denoland/deno/issues/19532)
