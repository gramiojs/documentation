import type { DefaultTheme, LocaleConfig } from "vitepress";

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
										text: "3. TypeScript и виды клавиатур",
										link: "/ru/guides/for-beginners/3.md",
									},
									{
										text: "4. SOON",
										link: "/ru/guides/for-beginners/4.md",
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
						text: "Руководство",
						items: [
							{ text: "Начало работы", link: "/ru/get-started" },
							{ text: "Bot API", link: "/ru/bot-api" },
							{
								text: "Обновления",
								collapsed: true,
								link: "/ru/updates/overview",
								items: [
									{ text: "Обзор", link: "/ru/updates/overview" },
									{ text: "Webhook", link: "/ru/updates/webhook" },
									{
										text: "Graceful shutdown",
										link: "/ru/updates/graceful-shutdown",
									},
								],
							},
							{
								text: "Триггеры",
								collapsed: true,
								items: [
									{ text: "Hears", link: "/ru/triggers/hears" },
									{ text: "Command", link: "/ru/triggers/command" },
									{
										text: "Callback Query",
										link: "/ru/triggers/callback-query",
									},
									{
										text: "Inline Query",
										link: "/ru/triggers/inline-query",
									},
									{
										text: "Chosen Inline Result",
										link: "/ru/triggers/chosen-inline-result",
									},
									{
										text: "Reaction",
										link: "/ru/triggers/reaction",
									},
								],
							},
							{
								text: "Хуки",
								collapsed: true,
								link: "/ru/hooks/overview",
								items: [
									{ text: "Обзор", link: "/ru/hooks/overview" },
									{ text: "onStart", link: "/ru/hooks/on-start" },
									{ text: "onStop", link: "/ru/hooks/on-stop" },
									{
										text: "onError (обработка ошибок)",
										link: "/ru/hooks/on-error",
									},
									{ text: "preRequest", link: "/ru/hooks/pre-request" },
									{ text: "onResponse", link: "/ru/hooks/on-response" },
									{
										text: "onResponseError",
										link: "/ru/hooks/on-response-error",
									},
								],
							},
							{
								text: "Клавиатуры",
								collapsed: true,
								link: "/ru/keyboards/overview",
								items: [
									{ text: "Обзор", link: "/ru/keyboards/overview" },
									{ text: "Keyboard", link: "/ru/keyboards/keyboard" },
									{
										text: "Inline Keyboard",
										link: "/ru/keyboards/inline-keyboard",
									},
									{
										text: "Remove Keyboard",
										link: "/ru/keyboards/remove-keyboard",
									},
									{
										text: "Force Reply Keyboard",
										link: "/ru/keyboards/force-reply-keyboard",
									},
								],
							},
							{
								text: "Файлы",
								collapsed: true,
								link: "/ru/files/overview",
								items: [
									{ text: "Обзор", link: "/ru/files/overview" },
									{
										text: "Upload media",
										link: "/ru/files/media-upload",
									},
									{
										text: "MediaInput",
										link: "/ru/files/media-input",
									},
									{ text: "Скачивание", link: "/ru/files/download" },
									{
										text: "Использование без GramIO",
										link: "/ru/files/usage-without-gramio",
									},
								],
							},
							{ text: "Форматирование", link: "/ru/formatting/index" },
							{ text: "Типы", link: "/ru/types/index" },
							{
								text: "Лимиты и рассылка",
								link: "/ru/rate-limits",
							},
							{ text: "Хранилища", link: "/ru/storages/index" },
							{
								text: "Telegram Web Apps",
								collapsed: true,
								link: "/ru/tma/",
								items: [
									{ text: "Обзор", link: "/ru/tma/" },
									{
										text: "Init data",
										link: "/ru/tma/init-data",
									},
								],
							},
							{
								text: "Класс Bot",
								link: "/ru/bot-class",
							},
						],
					},
				],
			},
			// Переводы для дефолтных интерфейсов vitepress'а
			outline: {
				label: "На этой странице",
			},
			lastUpdated: {
				text: "Последнее обновление",
			},
			docFooter: {
				prev: "Предыдущая страница",
				next: "Следующая страница",
			},
			darkModeSwitchLabel: "Тема",
			lightModeSwitchTitle: "Перейти на светлую сторону",
			darkModeSwitchTitle: "Перейти на тёмную сторону",
			sidebarMenuLabel: "Меню",
			returnToTopLabel: "Вернуться к небу",
			langMenuLabel: "Сменить язык",
			editLink: {
				pattern:
					"https://github.com/gramiojs/documentation/edit/main/docs/:path",
				text: "Изменить эту страницу",
			},
			notFound: {
				title: "Страница не найдена",
				linkText: "Вернуться домой...",
			},
			search: {
				provider: "local",
				options: {
					translations: {
						button: {
							buttonText: "Поиск",
						},
						modal: {
							displayDetails: "Показывать подробнее",
							resetButtonTitle: "Прекрати!",
							backButtonTitle: "Назад",
							noResultsText: "К сожалению, мы ничего не нашли для вас :(",
							footer: {
								selectText: "Выбрать",
								navigateText: "Навигация",
								closeText: "Закрыть",
							},
						},
					},
				},
			},
		},
	},
} satisfies LocaleConfig<DefaultTheme.Config>;
