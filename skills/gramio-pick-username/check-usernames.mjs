#!/usr/bin/env node
// Batch-checks Telegram bot username availability via t.me page inspection.
//
// Works on Node >=18, Bun, and Deno (all ship a native fetch).
// Zero runtime dependencies — copy-paste anywhere.
//
// Usage:
//   node check-usernames.mjs weatherbot pogodabot meteobot
//   node check-usernames.mjs --json weatherbot pogodabot
//   echo "foobot\nbarbot" | node check-usernames.mjs --json
//   node check-usernames.mjs --concurrency 4 --timeout 10000 foo bar baz
//
// Output (human, default):
//   [FREE ]  @weatheritbot    button="Send Message"  kind=unclaimed
//   [TAKEN]  @weatherbot      button="Start Bot"     kind=bot_live
//   [INVAL]  @1foo            reasons=MUST_START_WITH_LETTER
//
// Output (--json): a JSON array of { username, verdict, kind, button, ogTitle,
// hasAvatar, hasDescription, status, reasons, error } — safe to pipe into any
// agent for parsing without re-reading raw HTML.
//
// Verdicts:
//   free          — username is genuinely unclaimed on t.me (still VERIFY in
//                   @BotFather — deleted bots often stay reserved)
//   taken         — live bot / orphan bot / user / channel / group
//   invalid       — fails BotFather rules, never fetched
//   rate_limited  — t.me returned 429; back off and retry
//   error         — network/timeout/unexpected status
//   unknown       — HTML didn't match known patterns (rare; inspect manually)

const DEFAULTS = {
    concurrency: 8,
    timeoutMs: 8000,
    userAgent:
        "Mozilla/5.0 (compatible; gramio-username-checker/1.0; +https://gramio.dev)",
};

const BUTTON_RE =
    /<a\b[^>]*class="([^"]*\btgme_action_button_new\b[^"]*)"[^>]*>([\s\S]*?)<\/a>/i;
const OG_TITLE_RE =
    /<meta\s+property="og:title"\s+content="([^"]*)"\s*\/?>/i;
const AVATAR_RE = /\btgme_page_photo_image\b/;
// NB: tgme_page_description is rendered on free pages too (as the boilerplate
// "If you have Telegram, you can contact @xxx" container). Do NOT use it as a
// "taken" signal — the reliable discriminator is the avatar + button text.

function validateUsername(raw) {
    const clean = String(raw).replace(/^@/, "").trim();
    const lc = clean.toLowerCase();
    const reasons = [];

    if (clean.length < 5) reasons.push("TOO_SHORT_MIN_5");
    if (clean.length > 32) reasons.push("TOO_LONG_MAX_32");
    if (!/^[a-zA-Z0-9_]+$/.test(clean)) reasons.push("INVALID_CHARS");
    if (!/^[a-zA-Z]/.test(clean)) reasons.push("MUST_START_WITH_LETTER");
    if (/_$/.test(clean)) reasons.push("TRAILING_UNDERSCORE");
    if (/__/.test(clean)) reasons.push("CONSECUTIVE_UNDERSCORES");
    if (!/bot$/i.test(clean)) reasons.push("MISSING_BOT_SUFFIX");

    return { clean, lc, reasons };
}

function stripTags(html) {
    return html
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

function classify({ username, html }) {
    const btnMatch = html.match(BUTTON_RE);
    const buttonClass = btnMatch ? btnMatch[1] : "";
    const button = btnMatch ? stripTags(btnMatch[2]) : null;
    const ogMatch = html.match(OG_TITLE_RE);
    const ogTitle = ogMatch ? ogMatch[1] : null;
    const hasAvatar = AVATAR_RE.test(html);
    // `shine` class appears on live bot CTAs that launch straight into /start.
    const hasShine = /\bshine\b/.test(buttonClass);

    const base = { username, button, ogTitle, hasAvatar };

    switch (button) {
        case "Start Bot":
            return { ...base, verdict: "taken", kind: "bot_live" };
        case "View Bot":
            return { ...base, verdict: "taken", kind: "bot_no_start" };
        case "View Channel":
        case "Subscribe":
            return { ...base, verdict: "taken", kind: "channel" };
        case "View Group":
        case "Join Group":
            return { ...base, verdict: "taken", kind: "group" };
        case "Send Message": {
            // The generic "Send Message" CTA renders for BOTH unclaimed names
            // and real user accounts. An avatar is the only reliable
            // discriminator: unclaimed names never have one.
            if (hasAvatar || hasShine) {
                return { ...base, verdict: "taken", kind: "user" };
            }
            return { ...base, verdict: "free", kind: "unclaimed" };
        }
        default:
            if (!button && !hasAvatar) {
                return { ...base, verdict: "free", kind: "unclaimed" };
            }
            return { ...base, verdict: "unknown", kind: "unknown" };
    }
}

async function checkOne(raw, opts) {
    const { clean, lc, reasons } = validateUsername(raw);
    if (reasons.length) {
        return { username: clean, verdict: "invalid", reasons };
    }

    const url = `https://t.me/${lc}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs);

    try {
        const res = await fetch(url, {
            redirect: "follow",
            headers: { "User-Agent": opts.userAgent, Accept: "text/html" },
            signal: ctrl.signal,
        });

        if (res.status === 429) {
            return {
                username: clean,
                verdict: "rate_limited",
                status: 429,
            };
        }
        if (res.status >= 400) {
            return {
                username: clean,
                verdict: "error",
                status: res.status,
            };
        }

        const html = await res.text();
        const result = classify({ username: clean, html });
        return { ...result, status: res.status };
    } catch (err) {
        const isAbort = err?.name === "AbortError";
        return {
            username: clean,
            verdict: "error",
            error: isAbort ? "timeout" : String(err?.message ?? err),
        };
    } finally {
        clearTimeout(timer);
    }
}

async function runPool(items, worker, concurrency) {
    const results = new Array(items.length);
    let cursor = 0;
    const workers = Array.from(
        { length: Math.min(concurrency, items.length) },
        async () => {
            while (cursor < items.length) {
                const idx = cursor++;
                results[idx] = await worker(items[idx], idx);
            }
        },
    );
    await Promise.all(workers);
    return results;
}

function parseArgs(argv) {
    const opts = { ...DEFAULTS, json: false, names: [] };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--json") opts.json = true;
        else if (a === "--concurrency") opts.concurrency = Number(argv[++i]);
        else if (a === "--timeout") opts.timeoutMs = Number(argv[++i]);
        else if (a === "--help" || a === "-h") opts.help = true;
        else if (a.startsWith("--")) {
            console.error(`Unknown flag: ${a}`);
            process.exit(2);
        } else opts.names.push(a);
    }
    return opts;
}

async function readStdin() {
    if (process.stdin.isTTY) return "";
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    return Buffer.concat(chunks).toString("utf8");
}

function formatHuman(r) {
    const tag = {
        free: "[FREE ]",
        taken: "[TAKEN]",
        invalid: "[INVAL]",
        rate_limited: "[429  ]",
        error: "[ERROR]",
        unknown: "[?    ]",
    }[r.verdict] ?? "[?    ]";
    const handle = `@${r.username}`.padEnd(28);
    const tail = [];
    if (r.button) tail.push(`button="${r.button}"`);
    if (r.kind) tail.push(`kind=${r.kind}`);
    if (r.reasons?.length) tail.push(`reasons=${r.reasons.join(",")}`);
    if (r.error) tail.push(`error=${r.error}`);
    if (r.status && r.status !== 200) tail.push(`status=${r.status}`);
    return `${tag}  ${handle}${tail.join("  ")}`;
}

function printHelp() {
    console.log(
        [
            "check-usernames.mjs — batch-check Telegram bot username availability",
            "",
            "Usage:",
            "  node check-usernames.mjs [flags] <name> [name...]",
            "  echo 'foo bar baz' | node check-usernames.mjs [flags]",
            "",
            "Flags:",
            "  --json                Emit a JSON array instead of a human table",
            "  --concurrency <n>     Parallel fetches (default 8)",
            "  --timeout <ms>        Per-request timeout in ms (default 8000)",
            "  -h, --help            Show this help",
            "",
            "Verdicts: free | taken | invalid | rate_limited | error | unknown",
            "",
            "Caveat: a 'free' verdict means the name is unclaimed on t.me.",
            "It may still be RESERVED if a prior bot was deleted. Final check",
            "is /newbot in @BotFather.",
        ].join("\n"),
    );
}

async function main() {
    const opts = parseArgs(process.argv.slice(2));
    if (opts.help) {
        printHelp();
        return;
    }

    let names = [...opts.names];
    if (!names.length) {
        const stdin = await readStdin();
        names = stdin.split(/[\s,]+/).filter(Boolean);
    }
    if (!names.length) {
        printHelp();
        process.exit(2);
    }

    names = [
        ...new Set(names.map((n) => n.replace(/^@/, "").toLowerCase())),
    ];

    const results = await runPool(
        names,
        (name) => checkOne(name, opts),
        opts.concurrency,
    );

    if (opts.json) {
        process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
        return;
    }

    for (const r of results) console.log(formatHuman(r));

    const summary = results.reduce((acc, r) => {
        acc[r.verdict] = (acc[r.verdict] ?? 0) + 1;
        return acc;
    }, {});
    const parts = Object.entries(summary).map(([k, v]) => `${k}=${v}`);
    console.log(`\nsummary: ${parts.join("  ")}  total=${results.length}`);
}

main().catch((err) => {
    console.error("fatal:", err);
    process.exit(1);
});
