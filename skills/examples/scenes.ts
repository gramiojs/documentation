import { Bot } from "gramio";
import { Scene, scenesDerives } from "@gramio/scenes";
import { sessionPlugin } from "@gramio/session";

// Define a registration scene with steps
const registration = new Scene("registration")
    .params<{ referral?: string }>()
    .step("name", (context) => {
        if (context.scene.step.firstTime) {
            return context.send("What is your name?");
        }
        if (!context.text) {
            return context.send("Please send a text message.");
        }
        context.scene.update({ name: context.text });
        return context.scene.step.next();
    })
    .step("age", (context) => {
        if (context.scene.step.firstTime) {
            return context.send(`Nice, ${context.scene.state.name}! How old are you?`);
        }
        const age = Number(context.text);
        if (Number.isNaN(age) || age < 1 || age > 150) {
            return context.send("Please enter a valid age.");
        }
        context.scene.update({ age });
        return context.scene.step.next();
    })
    .step("confirm", async (context) => {
        if (context.scene.step.firstTime) {
            const { name, age } = context.scene.state;
            return context.send(
                `Name: ${name}\nAge: ${age}\n\nIs this correct? (yes/no)`
            );
        }
        if (context.text?.toLowerCase() === "yes") {
            await context.send("Registration complete!");
            return context.scene.exit();
        }
        // Start over
        return context.scene.reenter();
    });

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(sessionPlugin({ key: "session", initial: () => ({}) }))
    .extend(scenesDerives())
    .command("register", (context) => {
        return context.scene.enter(registration, {
            referral: context.args,
        });
    })
    .command("cancel", (context) => {
        return context.scene.exit();
    });

bot.start();
