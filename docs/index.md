---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

head:
    - - meta
      - property: "title"
        content: GramIO - Powerful Telegram Bot API framework for TypeScript/JavaScript

    - - meta
      - name: "description"
        content: GramIO is a TypeScript/JavaScript framework for building Telegram bots. To start, bootstrap a new project with "npx create gramio bot-dir" and run the bot with "npm run dev". This is all it needs to do a get started with GramIO.

hero:
    name: "GramIO"
    text: "Create your bots with convenience!"
    image:
        src: /logo.svg
    actions:
        - theme: brand
          text: Get started
          link: /get-started
        # - theme: alt
        #   text: API Examples
        #   link: /api-examples
features:
    - title: Not
      details:
    - title: Ready Yet
      details:
    - icon: ✨
      title: Extensible
      details: Our plugin and hook system is awesome
    - icon: ⚙️
      title: Code-generated
      details: Many parts are code-generated
    - icon: 🛡️
      title: Type-safe
      details: Written in TypeScript with love ❤️
    - icon: 🌐
      title: Multi-runtime
      details: Works on Node.js, Bun and Deno*
---

**Deno\*** [windows-specific issue with undici](https://github.com/denoland/deno/issues/19532)
