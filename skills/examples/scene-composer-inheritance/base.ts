import { Composer } from "gramio";

export const stats = { deriveRuns: 0 };

// A named, scoped composer carrying bot-wide derives. Two critical pieces:
//
//   { name: "base" }   enables GramIO's registration-time dedup. Any later
//                      .extend(baseComposer) with the same key is a no-op,
//                      so this derive runs exactly once per update even
//                      when the Bot and a Scene both extend it.
//
//   .as("scoped")      promotes every middleware to the scoped scope. Without
//                      it, the derive would land in a local isolation group
//                      (Object.create(ctx)) and its writes would not propagate
//                      back to the real ctx the Scene engine sees.
//
// This file intentionally does NOT import any scene — see ./index.ts for the
// reason (circular-import split).
export const baseComposer = new Composer({ name: "base" })
    .derive(() => {
        stats.deriveRuns += 1;
        return {
            t: (key: string) => key.toUpperCase(),
        };
    })
    .as("scoped");
