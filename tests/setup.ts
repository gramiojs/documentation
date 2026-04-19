import { Bot } from "gramio";

process.env.BOT_TOKEN ??= "test-token";

const originalStart = Bot.prototype.start;
Bot.prototype.start = async function patchedStart(
    this: Bot,
    ..._args: Parameters<typeof originalStart>
) {
    return undefined as unknown as ReturnType<typeof originalStart>;
};
