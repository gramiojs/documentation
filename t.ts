import { Keyboard } from "@gramio/keyboards";
import { Bot } from "grammy";

const data = ["Apple", "Realme", "Tesla", "Xiaomi"];

const bot = new Bot(process.env.TOKEN!);
bot.on("message", (ctx) => {
	return ctx.reply("test", {
		reply_markup: new Keyboard()
			.columns(1)
			.text("simple keyboard")
			.add(...data.map((x) => Keyboard.text(x)))
			.filter(({ button }) => button.text !== "Tesla")
			.build(),
	});
});
bot.start();
