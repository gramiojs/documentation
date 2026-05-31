import { Bot } from "gramio";

// Demonstrates every routing pattern for /start deep-link payloads, plus
// my_chat_member handling for ?startgroup= / ?startchannel= links.
//
// Generate the corresponding links with:
//   t.me/<bot>?start=ref_12345                      → referral branch
//   t.me/<bot>?start=order_987                      → order-jump branch
//   t.me/<bot>?start=tok_eyJ1IjoxLCJ0IjoiYWJjIn0    → token-exchange (base64url JSON)
//   t.me/<bot>?start=login-inline                   → inline-mode redirect target
//   t.me/<bot>?startchannel&admin=post_messages     → my_chat_member, verifies the grant
//
// Mini App payloads (?startapp=) do NOT arrive here — they land on the Mini App
// frontend as Telegram.WebApp.initDataUnsafe.start_param. See skills/references/tma.md.

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (ctx) => {
        const payload = ctx.args; // string | null

        // No payload → welcome screen. Some clients deliver /start without
        // the payload on cold reopen; keep this branch graceful.
        if (!payload) return ctx.send("Welcome!");

        // Referral — persist referrerId against ctx.from.id BEFORE any other
        // welcome logic so attribution wins even if the user bounces.
        if (payload.startsWith("ref_")) {
            const referrerId = payload.slice(4);
            return ctx.send(`Welcome! You were invited by user ${referrerId}.`);
        }

        // Context-jump — render the requested order directly, don't dump
        // the user on /start home.
        if (payload.startsWith("order_")) {
            const orderId = payload.slice(6);
            return ctx.send(`Opening order #${orderId}…`);
        }

        // OAuth callback / opaque token exchange. The token is opaque to us
        // here; in a real bot we'd look it up server-side, exchange for the
        // real OAuth claims, link the account, then expire the token.
        // For the demo we encode { u, t } as base64url JSON inside the token.
        if (payload.startsWith("tok_")) {
            const token = payload.slice(4);
            try {
                const json = Buffer.from(token, "base64url").toString("utf8");
                const claims = JSON.parse(json) as { u: number; t: string };
                return ctx.send(`Linked account for user ${claims.u}.`);
            } catch {
                // ALL deep-link payloads are untrusted user input.
                return ctx.send(
                    "That login link looks invalid or expired. Try again."
                );
            }
        }

        // Inline-mode auth redirect — set by `start_parameter` on
        // InlineQueryResultsButton; see skills/references/triggers.md.
        if (payload === "login-inline") {
            return ctx.send("Let's get you logged in.");
        }

        // Unknown payload — don't echo the raw value back at the user; it
        // can be anything and often looks like garbage from a bad link.
        return ctx.send(
            "Welcome! Couldn't recognise that link, but you're in."
        );
    })
    // The ADMIN add-to-chat flow (?startgroup&admin=… / ?startchannel&admin=…)
    // arrives here, NOT as /start, and carries no payload — encode any context
    // in your link-generation step instead.
    //
    // NOTE: a *plain* ?startgroup=<payload> (no admin=) is different — the bot
    // is added as a member and DOES receive a `/start@bot <payload>` message,
    // so it lands in the .command("start") handler above with the payload in
    // ctx.args. https://core.telegram.org/bots/features#deep-linking
    .on("my_chat_member", (ctx) => {
        const me = ctx.newChatMember;

        // Bot was removed or restricted — nothing to do.
        if (me.status === "left" || me.status === "kicked") return;

        // Bot was added as a plain member of a channel where it needs admin.
        if (ctx.chat.type === "channel" && me.status !== "administrator") {
            return ctx.send(
                "Thanks for adding me! I need to be an admin with 'post messages' " +
                    "permission to publish updates here."
            );
        }

        // Bot got admin — but did we actually get the specific right we asked
        // for in `?admin=post_messages`? `admin=` is a request; the user can
        // untick boxes in the confirmation dialog. ALWAYS verify.
        if (me.status === "administrator" && !me.canPostMessages?.()) {
            return ctx.send(
                "Almost there — please grant me the 'post messages' permission too."
            );
        }

        if (me.status === "administrator") {
            return ctx.send("All set! I'll post updates here.");
        }
    });

// Helpers to build the links from inside the bot. `bot.info` is populated
// by `bot.start()` and is undefined before that — call these only from
// handler code (which runs after start) or from inside `onStart`.
export function buildStartLink(payload: string) {
    return `https://t.me/${bot.info!.username}?start=${encodeURIComponent(payload)}`;
}

export function buildAddToChannelLink(perms: readonly string[]) {
    return `https://t.me/${bot.info!.username}?startchannel&admin=${perms.join("+")}`;
}

bot.start();

export { bot };
