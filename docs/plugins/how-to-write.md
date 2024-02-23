# How to write a plugin

It happens that you are missing something... And plugins can help you with this!

# Example

```ts twoslash
import { Plugin, Bot } from "gramio";

export class PluginError extends Error {
    wow: "type" | "safe" = "type";
}

const plugin = new Plugin("gramio-example")
    .error("PLUGIN", PluginError)
    .derive(() => {
        return {
            some: ["derived", "props"] as const,
        };
    });

const bot = new Bot(process.env.TOKEN!)
    .extend(plugin)
    .onError(({ context, kind, error }) => {
        if (context.is("message") && kind === "PLUGIN") {
            console.log(error.wow);
            //                ^^^
        }
    })
    .use((context) => {
        console.log(context.some);
        //                  ^^^^
    });
```
