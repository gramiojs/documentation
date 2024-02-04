import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "GramIO",
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
		logo: "/logo.svg",
		search: {
			provider: "local",
		},
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "Home", link: "/" },
			// { text: "Examples", link: "/markdown-examples" },
		],

		sidebar: [
			{
				text: "Guide",
				items: [
					{ text: "Get started", link: "/get-started" },
					{
						text: "Keyboards",
						collapsed: false,
						items: [
							{
								text: "Overview",
								link: "/keyboards/overview",
							},
							{
								text: "Keyboard",
								link: "/keyboards/keyboard",
							},
							{
								text: "Inline Keyboard",
								link: "/keyboards/inline-keyboard",
							},
							{
								text: "Remove Keyboard",
								link: "/keyboards/remove-keyboard",
							},
						],
					},
				],
			},
		],
		socialLinks: [
			{ icon: "github", link: "https://github.com/gramiojs/gramio" },
		],
	},
});
