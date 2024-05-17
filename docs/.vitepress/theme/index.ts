import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import "@shikijs/vitepress-twoslash/style.css";
import "virtual:uno.css";
import "./style.css";
import type { EnhanceAppContext } from "vitepress";
import Theme from "vitepress/theme";
import Layout from "./Layout.vue";

export default {
	extends: Theme,
	Layout,
	enhanceApp({ app }: EnhanceAppContext) {
		app.use(TwoslashFloatingVue);
	},
};
