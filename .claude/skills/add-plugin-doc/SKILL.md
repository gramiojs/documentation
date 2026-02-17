---
name: add-plugin-doc
description: Create documentation for a new official GramIO plugin with proper template, badges, installation instructions, and sidebar registration.
allowed-tools: Read, Write, Edit, Glob, Grep
metadata:
  internal: true
---

# Add Plugin Documentation

You are creating documentation for a new official GramIO plugin.

## Arguments

The user provides `[plugin-name]` — e.g., `media-cache` or `session`.

## Steps

1. **Read an existing plugin page** for reference — e.g., `docs/plugins/official/session.md` — to match the exact format.

2. **Read AGENTS.md** for conventions.

3. **Create the EN plugin page** at `docs/plugins/official/{plugin-name}.md`:

   ```markdown
   ---
   title: {Plugin Name} Plugin for GramIO

   head:
       - - meta
         - name: "description"
           content: "{Brief description of the plugin for SEO}."

       - - meta
         - name: "keywords"
           content: "Telegram bot, GramIO, {plugin-name}, {relevant keywords}"
   ---

   # {Plugin Name} Plugin

   <div class="badges">

   [![npm](https://img.shields.io/npm/v/@gramio/{plugin-name}?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/{plugin-name})
   [![JSR](https://jsr.io/badges/@gramio/{plugin-name})](https://jsr.io/@gramio/{plugin-name})
   [![JSR Score](https://jsr.io/badges/@gramio/{plugin-name}/score)](https://jsr.io/@gramio/{plugin-name})

   </div>

   {Short description of the plugin.}

   ### Installation

   ::: code-group

   ```bash [npm]
   npm install @gramio/{plugin-name}
   ```

   ```bash [yarn]
   yarn add @gramio/{plugin-name}
   ```

   ```bash [pnpm]
   pnpm add @gramio/{plugin-name}
   ```

   ```bash [bun]
   bun install @gramio/{plugin-name}
   ```

   :::

   ## Usage

   ```ts twoslash
   import { Bot } from "gramio";
   // TODO: Add usage example
   ```
   ```

4. **Create the RU translation** at `docs/ru/plugins/official/{plugin-name}.md`:
   - Translate the frontmatter (`title`, `description`, `keywords`) to Russian.
   - Translate all body content to Russian (headings, descriptions, paragraphs).
   - Preserve code blocks, twoslash annotations, badges, and markdown structure exactly.

5. **Register in EN sidebar** — edit `en.locale.ts`, add to the Official plugins list.

6. **Register in RU sidebar** — edit `ru.locale.ts`, add to the Официальные plugins list.
