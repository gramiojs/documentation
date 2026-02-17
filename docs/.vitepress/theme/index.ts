import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import "@shikijs/vitepress-twoslash/style.css";
import "virtual:uno.css";
import "virtual:group-icons.css";
import "./style.css";
import type { EnhanceAppContext } from "vitepress";
import Theme from "vitepress/theme";
import Layout from "./Layout.vue";
import CopyOrDownloadAsMarkdownButtons from "vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue";
import PollingVsWebhook from "../components/PollingVsWebhook.vue";
import BroadcastVisualizer from "../components/BroadcastVisualizer.vue";

export default {
	extends: Theme,
	Layout,
	enhanceApp({ app }: EnhanceAppContext) {
		app.use(TwoslashFloatingVue);
		app.component("CopyOrDownloadAsMarkdownButtons", CopyOrDownloadAsMarkdownButtons);
		app.component("PollingVsWebhook", PollingVsWebhook);
		app.component("BroadcastVisualizer", BroadcastVisualizer);
	},
};
