---
description: Create a custom GramIO plugin with proper structure, derived properties, error types, and TypeScript typing.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Create GramIO Plugin

You are creating a custom plugin for the GramIO framework.

## Arguments

The user provides `[plugin-name]` and optionally describes what the plugin should do.

## Steps

1. **Choose approach** — there are two ways:

   ### Option A: Use scaffolding tool (recommended for standalone packages)
   ```bash
   npm create gramio-plugin ./plugin-name
   ```

   ### Option B: Create inline plugin (for project-internal use)
   Create the plugin file directly in the user's project.

2. **For inline plugins**, create the plugin file:

   ```typescript
   // src/plugins/plugin-name.ts
   import { Plugin } from "gramio";

   // Optional: custom error class
   export class PluginNameError extends Error {
       code: string;
       constructor(message: string, code: string) {
           super(message);
           this.code = code;
       }
   }

   export const pluginName = new Plugin("plugin-name")
       // Register custom error type (optional)
       .error("PLUGIN_NAME", PluginNameError)
       // Derive new properties onto context
       .derive((context) => {
           return {
               // These properties become available on context
               myHelper() {
                   return "hello from plugin";
               },
           };
       });
   ```

3. **Register the plugin** in the bot:
   ```typescript
   import { pluginName } from "./plugins/plugin-name";

   const bot = new Bot(process.env.BOT_TOKEN as string)
       .extend(pluginName)
       // Now context.myHelper() is available and typed
       .command("test", (context) => {
           return context.send(context.myHelper());
       });
   ```

4. **Plugin capabilities** — remind the user what plugins can do:
   - `.derive()` — add properties/methods to context (type-safe)
   - `.error()` — register custom error types for `.onError()` handling
   - `.on()` / `.use()` — add middleware
   - `.group()` — create handler groups
   - Plugins can also use `.preRequest()`, `.onResponse()`, `.onResponseError()` hooks

5. **If the plugin needs state/storage**:
   ```typescript
   import { sessionPlugin } from "@gramio/session";

   // Combine with session for stateful plugins
   const bot = new Bot("TOKEN")
       .extend(sessionPlugin({ key: "myState", initial: () => ({}) }))
       .extend(pluginName);
   ```

6. **Test the plugin** — suggest the user test with a simple command:
   ```typescript
   bot.command("test-plugin", (context) => {
       // verify derived properties work
       return context.send(String(context.myHelper()));
   });
   ```
