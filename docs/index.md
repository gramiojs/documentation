---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

head:
    - - meta
      - property: "title"
        content: GramIO - Powerful Telegram Bot API framework for TypeScript/JavaScript

    - - meta
      - name: "description"
        content: GramIO is a TypeScript/JavaScript framework for building Telegram bots that works on Node.js, Bun and Deno. To start, bootstrap a new project with «npx create gramio bot-dir» and run the bot with «npm run dev». This is all it needs to do a get started with GramIO.

    - - meta
      - name: "keywords"
        content: Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, How to build a bot, create

hero:
    name: "GramIO"
    text: |
        Create your 
        <span class="text-telegram"><span class="i-logos:telegram inline-block text-3xl md:text-5xl"></span> Telegram</span> bots with convenience!

    image:
        dark: /logo.svg
        light: /logo-light.svg
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
      details: Works on <a href="https://nodejs.org/">Node.js</a>, <a href="https://bun.sh/">Bun</a> and <a href="https://deno.com/">Deno</a>*
---

**Deno\*** [windows-specific issue with undici](https://github.com/denoland/deno/issues/19532)
