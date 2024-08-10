import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import presetIcons from "@unocss/preset-icons";
import Unocss from "unocss/vite";
import { defineConfig } from "vitepress";
import { localeEn, localeRu } from "./config/locales";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "GramIO",
	description: "Build your bots with convenience!",
	cleanUrls: true,
	vite: {
		publicDir: "../public",
		plugins: [Unocss({ presets: [presetIcons()] })],
		// TODO: remove when bun on windows out!
		// server: {
		// 	watch: {
		// 		usePolling: true,
		// 	},
		// },
	},
	transformHead: ({ pageData: { relativePath } }) => {
		const canonicalUrl = `https://gramio.dev/${relativePath}`
			.replace(/index\.md$/, "")
			.replace(/\.md$/, "");

		return [["link", { rel: "canonical", href: canonicalUrl }]];
	},
	// transformPageData(pageData) {
	// 	const canonicalUrl = `https://example.com/${pageData.relativePath}`
	// 		.replace(/index\.md$/, "")
	// 		.replace(/\.md$/, "");

	// 	pageData.frontmatter.head ??= [];
	// 	pageData.frontmatter.head.push([
	// 		"link",
	// 		{ rel: "canonical", href: canonicalUrl },
	// 	]);
	// },
	head: [
		["link", { rel: "icon", href: "/favicon.ico", type: "image/x-icon" }],
		["link", { rel: "icon", href: "/logo.svg", type: "image/svg+xml" }],
		["link", { rel: "apple-touch-icon", href: "/logo.png" }],
		["meta", { name: "theme-color", content: "#000000" }],
		["meta", { property: "og:type", content: "website" }],
		["meta", { property: "og:locale", content: "en" }],
		["meta", { property: "og:url", content: "https://gramio.dev/" }],
		[
			"meta",
			{
				property: "og:title",
				content:
					"GramIO | Telegram Bot API framework for Node.js, Bun and Deno",
			},
		],
		[
			"meta",
			{
				property: "og:image",
				content: "https://gramio.dev/logo.png",
			},
		],
		["meta", { property: "og:site_name", content: "GramIO" }],
	],
	sitemap: {
		hostname: "https://gramio.dev",
	},
	locales: {
		...localeEn,
		...localeRu,
	},
	markdown: {
		codeTransformers: [transformerTwoslash()],
	},
	lastUpdated: true,
	themeConfig: {
		logo: {
			dark: "/logo.svg",
			light: "./logo-light.svg",
			width: 24,
			height: 24,
		},
		search: {
			provider: "local",
		},
		editLink: {
			pattern: "https://github.com/gramiojs/documentation/edit/main/docs/:path",
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
