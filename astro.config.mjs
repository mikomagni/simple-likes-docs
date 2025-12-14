// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeNova from 'starlight-theme-nova';

// https://astro.build/config
export default defineConfig({
	site: 'https://simplelikes.com',
	integrations: [
		starlight({
			title: 'Simple Likes Docs',
			description: 'A lightweight, performant likes system for Statamic CMS',
			plugins: [starlightThemeNova()],
			logo: {
				light: './src/assets/logo-light.svg',
				dark: './src/assets/logo-dark.svg',
				replacesTitle: true,
			},
			social: [],
			components: {
				SocialIcons: './src/components/HeaderLinks.astro',
				Footer: './src/components/Footer.astro',
			},
			customCss: [
				'./src/styles/custom.css',
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: '' },
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Quick Start', slug: 'getting-started/quick-start' },
                        { label: 'Help & Support', slug: 'getting-started/help' },
                        { label: 'Licensing', slug: 'getting-started/licensing' },
					],
				},
				{
					label: 'JavaScript',
					items: [
						{ label: 'Alpine.js Component', slug: 'javascript/alpine' },
						{ label: 'Vanilla JavaScript', slug: 'javascript/vanilla' },
					],
				},
				{
					label: 'Templates',
					items: [
						{ label: 'Default Templates', slug: 'templates/default' },
						{ label: 'Custom Templates', slug: 'templates/custom' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Display Tags', slug: 'reference/tags' },
						{ label: 'Styling & CSS', slug: 'reference/styling' },
						{ label: 'Blueprint Configuration', slug: 'reference/blueprint' },
						{ label: 'Configuration Options', slug: 'reference/configuration' },
						{ label: 'Database Setup', slug: 'reference/database' },
						{ label: 'Artisan Commands', slug: 'reference/commands' },
					],
				},
				{
					label: 'API',
					items: [
						{ label: 'Overview', slug: 'api/overview' },
						{ label: 'Toggle Like', slug: 'api/toggle' },
						{ label: 'Entry Stats', slug: 'api/entry-stats' },
						{ label: 'Global Stats', slug: 'api/global-stats' },
						{ label: 'Popular Entries', slug: 'api/popular' },
						{ label: 'Recent Activity', slug: 'api/activity' },
						{ label: 'Weekly Activity', slug: 'api/weekly' },
						{ label: 'Top Users', slug: 'api/top-users' },
						{ label: 'Combined Stats', slug: 'api/stats-all' },
					],
				},
				{
					label: 'Advanced',
					items: [
						{ label: 'How It Works', slug: 'advanced/architecture' },
						{ label: 'Static Caching', slug: 'advanced/caching' },
						{ label: 'Dashboard Widgets', slug: 'advanced/widgets' },
						{ label: 'Troubleshooting', slug: 'advanced/troubleshooting' },
                        { label: 'Translations', slug: 'advanced/translations' },
					],
				},
			],
			editLink: {
				baseUrl: 'https://github.com/mikomagni/simple-likes-docs/edit/main/',
			},
			lastUpdated: true,
		}),
	],
});
