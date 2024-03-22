import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "GramIO",
	description: "Build your bots with convenience!",
	vite: {
		publicDir: "../public",
		// TODO: remove when bun on windows out!
		server: {
			watch: {
				usePolling: true,
			},
		},
	},
	markdown: {
		codeTransformers: [transformerTwoslash()],
	},
	themeConfig: {
		logo: "/logo.svg",
		search: {
			provider: "local",
		},
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Get started", link: "/get-started" },
			{ text: "Plugins", link: "/plugins/index" },
			// { text: "Examples", link: "/markdown-examples" },
		],

		sidebar: {
			"/plugins/": [
				{
					text: "Plugins",
					items: [
						{
							text: "Overview",
							link: "/plugins/index",
						},
						{
							text: "How to write a plugin",
							link: "/plugins/how-to-write",
						},
						{
							text: "Official",
							items: [
								{
									text: "Session",
									link: "/plugins/official/session",
								},
								{
									text: "Autoload",
									link: "/plugins/official/autoload",
								},
								{
									text: "Prompt",
									link: "/plugins/official/prompt",
								},
							],
						},
					],
				},
			],
			"/": [
				{
					text: "Guide",
					items: [
						{ text: "Get started", link: "/get-started" },
						{ text: "Bot API", link: "/bot-api" },
						{
							text: "Contexts",
							collapsed: false,
							link: "https://tsdocs.dev/docs/@gramio/contexts",
						},
						{
							text: "Hooks",
							items: [
								{
									text: "Overview",
									link: "/hooks/overview",
								},
								{
									text: "onStart",
									link: "/hooks/on-start",
								},
								{
									text: "onError (error-handling)",
									link: "/hooks/on-error",
								},
								{
									text: "preRequest",
									link: "/hooks/pre-request",
								},
							],
						},
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
								{
									text: "Force Reply Keyboard",
									link: "/keyboards/force-reply-keyboard",
								},
							],
						},
						{
							text: "Files",
							collapsed: false,
							items: [
								{
									text: "Overview",
									link: "/files/overview",
								},
								{
									text: "Media Upload",
									link: "/files/media-upload",
								},
								{
									text: "Media Input",
									link: "/files/media-input",
								},
								{
									text: "Usage without GramIO",
									link: "/files/usage-without-gramio",
								},
							],
						},
						{ text: "Formatting", link: "/formatting/index" },
						{ text: "Types", link: "/types/index" },
						{ text: "Webhook", link: "/webhook/index" },
					],
				},
			],
		},
		socialLinks: [
			{ icon: "github", link: "https://github.com/gramiojs/gramio" },
			{
				icon: {
					svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Telegram</title><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
				},
				link: "https://t.me/gramio_forum",
			},
		],
	},
});
