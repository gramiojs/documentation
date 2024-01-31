import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "GramIO - an amazing telegram bot framework",
	description: "Build your bots with convenience!",
	vite: {
		publicDir: "../public",
		// TODO: remove when but on windows out!
		server: {
			watch: {
				usePolling: true,
			},
		},
	},
	themeConfig: {
		logo: "logo.svg",
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Examples", link: "/markdown-examples" },
		],

		sidebar: [
			{
				text: "Examples",
				items: [
					{ text: "Markdown Examples", link: "/markdown-examples" },
					{ text: "Runtime API Examples", link: "/api-examples" },
				],
			},
		],

		socialLinks: [
			{ icon: "github", link: "https://github.com/vuejs/vitepress" },
		],
	},
});
