import type { TelegramInlineKeyboardMarkup, TelegramReplyKeyboardMarkup } from "@gramio/types";

export function asInlineKeyboard(rm: unknown): TelegramInlineKeyboardMarkup {
    return JSON.parse(JSON.stringify(rm)) as TelegramInlineKeyboardMarkup;
}

export function asReplyKeyboard(rm: unknown): TelegramReplyKeyboardMarkup {
    return JSON.parse(JSON.stringify(rm)) as TelegramReplyKeyboardMarkup;
}

export function flatInline(rm: unknown) {
    return asInlineKeyboard(rm).inline_keyboard.flat();
}
