import type { LocaleConfig } from "vitepress";

export const localeRu = {
	ru: {
		label: "Русский",
		lang: "ru",
		description: "Создавай своих ботов с удобством!",
		themeConfig: {
			// https://vitepress.dev/reference/default-theme-config
			nav: [
				{ text: "Главная", link: "/ru" },
				{ text: "Начало", link: "/ru/get-started" },
				// { text: "Plugins", link: "/plugins/index" },
				{ text: "Гайды", link: "/ru/guides" },
			],
			sidebar: {
				"/ru/guides/": [
					{
						text: "Гайды",
						items: [
							{
								text: "Для новичков",
								items: [
									{
										text: "1. Введение",
										link: "/ru/guides/for-beginners/1.md",
									},
									{
										text: "2. Знакомство",
										link: "/ru/guides/for-beginners/2.md",
									},
									{
										text: "3. SOON",
										link: "/ru/guides/for-beginners/3.md",
									},
								],
							},
						],
					},
				],
				// "/plugins/": [
				// 	{
				// 		text: "Plugins",
				// 		items: [
				// 			{
				// 				text: "Overview",
				// 				link: "/plugins/index",
				// 			},
				// 			{
				// 				text: "How to write a plugin",
				// 				link: "/plugins/how-to-write",
				// 			},
				// 			{
				// 				text: "Lazy-load plugin",
				// 				link: "/plugins/lazy-load",
				// 			},
				// 			{
				// 				text: "Official",
				// 				items: [
				// 					{
				// 						text: "Session",
				// 						link: "/plugins/official/session",
				// 					},
				// 					{
				// 						text: "Media cache",
				// 						link: "/plugins/official/media-cache",
				// 					},
				// 					{
				// 						text: "I18n",
				// 						link: "/plugins/official/i18n",
				// 					},
				// 					{
				// 						text: "Autoload",
				// 						link: "/plugins/official/autoload",
				// 					},
				// 					{
				// 						text: "Prompt",
				// 						link: "/plugins/official/prompt",
				// 					},
				// 					{
				// 						text: "Auto-retry",
				// 						link: "/plugins/official/auto-retry",
				// 					},
				// 				],
				// 			},
				// 		],
				// 	},
				// ],
				"/ru/": [
					{
						text: "База",
						items: [
							{ text: "Давайте начнём", link: "/ru/get-started" },
							// 			{ text: "Bot API", link: "/bot-api" },
							// 			{
							// 				text: "Contexts",
							// 				link: "https://tsdocs.dev/docs/@gramio/contexts",
							// 			},
							// 			{
							// 				text: "Triggers",
							// 				collapsed: true,
							// 				items: [
							// 					{
							// 						text: "Hears",
							// 						link: "/triggers/hears",
							// 					},
							// 					{
							// 						text: "Command",
							// 						link: "/triggers/command",
							// 					},
							// 					{
							// 						text: "Callback Query",
							// 						link: "/triggers/callback-query",
							// 					},
							// 					{
							// 						text: "Inline Query",
							// 						link: "/triggers/inline-query",
							// 					},
							// 					{
							// 						text: "Reaction",
							// 						link: "/triggers/reaction",
							// 					},
							// 				],
							// 			},
							// 			{
							// 				text: "Hooks",
							// 				collapsed: true,
							// 				items: [
							// 					{
							// 						text: "Overview",
							// 						link: "/hooks/overview",
							// 					},
							// 					{
							// 						text: "onStart",
							// 						link: "/hooks/on-start",
							// 					},
							// 					{
							// 						text: "onStop",
							// 						link: "/hooks/on-stop",
							// 					},
							// 					{
							// 						text: "onError (error-handling)",
							// 						link: "/hooks/on-error",
							// 					},
							// 					{
							// 						text: "preRequest",
							// 						link: "/hooks/pre-request",
							// 					},
							// 					{
							// 						text: "onResponse",
							// 						link: "/hooks/on-response",
							// 					},
							// 					{
							// 						text: "onResponseError",
							// 						link: "/hooks/on-response-error",
							// 					},
							// 				],
							// 			},
							// 			{
							// 				text: "Keyboards",
							// 				collapsed: true,
							// 				items: [
							// 					{
							// 						text: "Overview",
							// 						link: "/keyboards/overview",
							// 					},
							// 					{
							// 						text: "Keyboard",
							// 						link: "/keyboards/keyboard",
							// 					},
							// 					{
							// 						text: "Inline Keyboard",
							// 						link: "/keyboards/inline-keyboard",
							// 					},
							// 					{
							// 						text: "Remove Keyboard",
							// 						link: "/keyboards/remove-keyboard",
							// 					},
							// 					{
							// 						text: "Force Reply Keyboard",
							// 						link: "/keyboards/force-reply-keyboard",
							// 					},
							// 				],
							// 			},
							// 			{
							// 				text: "Files",
							// 				collapsed: true,
							// 				items: [
							// 					{
							// 						text: "Overview",
							// 						link: "/files/overview",
							// 					},
							// 					{
							// 						text: "Media Upload",
							// 						link: "/files/media-upload",
							// 					},
							// 					{
							// 						text: "Media Input",
							// 						link: "/files/media-input",
							// 					},
							// 					{ text: "Download", link: "/files/download" },
							// 					{
							// 						text: "Usage without GramIO",
							// 						link: "/files/usage-without-gramio",
							// 					},
							// 				],
							// 			},
							// 			{ text: "Formatting", link: "/formatting/index" },
							// 			{ text: "Types", link: "/types/index" },
							// 			{ text: "Webhook", link: "/webhook/index" },
							// 			{ text: "Rate-limits and broadcast", link: "/rate-limits" },
							// 			{ text: "Storages", link: "/storages/index" },
						],
					},
				],
			},
		},
	},
} satisfies LocaleConfig;
