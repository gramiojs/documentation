---
description: Scaffold a new GramIO Telegram bot project with proper structure, TypeScript config, environment setup, and initial handlers.
allowed-tools: Read, Write, Edit, Bash, Glob
---

# Create New GramIO Bot

You are scaffolding a new GramIO Telegram bot project.

## Arguments

The user may provide:
- `[project-name]` — directory name for the project (default: current directory)
- Optional flags or preferences (e.g., runtime, plugins to include)

## Steps

1. **Check if `create-gramio` is available**:
   - The recommended way is `npm create gramio [project-name]` (or bun/pnpm/yarn equivalent).
   - If the user wants a custom setup instead, proceed with manual scaffolding below.

2. **If using `create-gramio`** (recommended):
   ```bash
   npm create gramio [project-name]
   ```
   Then help the user configure the generated project.

3. **If manual scaffolding**, create the project structure:

   ```
   [project-name]/
     src/
       index.ts          # Main bot entry point
     .env                # BOT_TOKEN=your_token_here
     .env.example        # BOT_TOKEN= (template)
     .gitignore          # node_modules, .env, dist
     package.json
     tsconfig.json
   ```

4. **`src/index.ts`** — basic bot setup:
   ```typescript
   import { Bot } from "gramio";

   const bot = new Bot(process.env.BOT_TOKEN as string)
       .command("start", (context) =>
           context.send("Hello! I'm powered by GramIO.")
       )
       .onStart(({ info }) => {
           console.log(`Bot @${info.username} started!`);
       })
       .onError(({ context, kind, error }) => {
           console.error(`[${kind}]`, error);
       });

   bot.start();
   ```

5. **`package.json`** — include gramio and dev scripts:
   ```json
   {
     "name": "[project-name]",
     "type": "module",
     "scripts": {
       "dev": "bun --watch src/index.ts",
       "start": "bun src/index.ts"
     },
     "dependencies": {
       "gramio": "latest"
     }
   }
   ```

6. **Install dependencies**:
   ```bash
   cd [project-name] && bun install
   ```

7. **Add recommended plugins** if the user wants them:
   - `@gramio/session` for user data
   - `@gramio/autoload` for file-based handler loading
   - `@gramio/auto-retry` for resilient API calls

8. **Remind the user** to:
   - Set `BOT_TOKEN` in `.env`
   - Run `bun run dev` to start developing
