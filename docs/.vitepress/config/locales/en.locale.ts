import type { LocaleConfig } from "vitepress";

export const localeEn = {
	root: {
		label: "English",
		lang: "en",
		description: "Build your bots with convenience!",

		themeConfig: {
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
								text: "Lazy-load plugin",
								link: "/plugins/lazy-load",
							},
							{
								text: "Official",
								items: [
									{
										text: "Scenes",
										link: "/plugins/official/scenes",
									},
									{
										text: "I18n",
										link: "/plugins/official/i18n",
									},
									{
										text: "Autoload",
										link: "/plugins/official/autoload",
									},
									{
										text: "Auto answer callback query",
										link: "/plugins/official/auto-answer-callback-query",
									},
									{
										text: "Session",
										link: "/plugins/official/session",
									},
									{
										text: "Auto retry",
										link: "/plugins/official/auto-retry",
									},
									{
										text: "Media cache",
										link: "/plugins/official/media-cache",
									},
									{
										text: "Media group",
										link: "/plugins/official/media-group",
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
								text: "Updates",
								collapsed: true,
								link: "/updates",
								items: [
									{
										text: "Overview",
										link: "/updates",
									},
									{ text: "Webhook", link: "/webhook/index" },
									{
										text: "Graceful Shutdown",
										link: "/updates/graceful-shutdown",
									},
								],
							},
							{
								text: "Triggers",
								collapsed: true,
								items: [
									{
										text: "Hears",
										link: "/triggers/hears",
									},
									{
										text: "Command",
										link: "/triggers/command",
									},
									{
										text: "Callback Query",
										link: "/triggers/callback-query",
									},
									{
										text: "Inline Query",
										link: "/triggers/inline-query",
									},
									{
										text: "Chosen Inline Result",
										link: "/triggers/chosen-inline-result",
									},
									{
										text: "Reaction",
										link: "/triggers/reaction",
									},
								],
							},
							{
								text: "Hooks",
								collapsed: true,
								link: "/hooks/overview",
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
										text: "onStop",
										link: "/hooks/on-stop",
									},
									{
										text: "onError (error-handling)",
										link: "/hooks/on-error",
									},
									{
										text: "preRequest",
										link: "/hooks/pre-request",
									},
									{
										text: "onResponse",
										link: "/hooks/on-response",
									},
									{
										text: "onResponseError",
										link: "/hooks/on-response-error",
									},
								],
							},
							{
								text: "Keyboards",
								collapsed: true,
								link: "/keyboards/overview",
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
								collapsed: true,
								link: "/files/overview",
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
									{ text: "Download", link: "/files/download" },
									{
										text: "Usage without GramIO",
										link: "/files/usage-without-gramio",
									},
								],
							},
							{ text: "Formatting", link: "/formatting/index" },
							{ text: "Types", link: "/types/index" },

							{ text: "Rate-limits and broadcast", link: "/rate-limits" },
							{ text: "Storages", link: "/storages/index" },
							{
								text: "Telegram Mini Apps",
								collapsed: true,
								link: "/tma/",
								items: [
									{
										text: "Overview",
										link: "/tma/",
									},
									{
										text: "Init data",
										link: "/tma/init-data",
									},
								],
							},
							{
								text: "Bot class",
								link: "/bot-class",
							},
						],
					},
				],
			},
		},
	},
} satisfies LocaleConfig;
