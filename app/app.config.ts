import type { Nav, NavItem } from '~/types/nav'
import blogConfig from '~~/blog.config'
import { version } from '~~/package.json'

// 图标查询：https://yesicon.app/ph
// 图标插件：https://marketplace.visualstudio.com/items?itemName=antfu.iconify

// @keep-sorted
export default defineAppConfig({
	// 将 blog.config 中的配置项复制到 appConfig，方便调用
	...blogConfig,
	component: {
		alert: {
			/** 默认使用卡片风格还是扁平风格 */
			defaultStyle: 'card' as 'card' | 'flat',
		},

		codeblock: {
			/** 代码块触发折叠的行数 */
			triggerRows: 32,
			/** 代码块折叠后的行数 */
			collapsedRows: 16,
		},

		/** 文章开头摘要 */
		excerpt: {
			animation: true,
			caret: '_',
		},

		stats: {
			/** 归档页面每年标题对应的年龄 */
			birthYear: 2009,
			/** blog-stats widget 的预置文本 */
			wordCount: '114514',
		},
	},

	// @keep-sorted
	footer: {
		/** 页脚版权信息，支持 <br> 换行等 HTML 标签 */
		copyright: `© ${new Date().getFullYear()} ${blogConfig.author.name} Made with ❤️ `,
		/** 侧边栏底部图标导航 */
		iconNav: [
			{ icon: 'ph:house-bold', text: '个人主页', url: blogConfig.author.homepage },
			{ icon: 'ri:bilibili-fill', text: 'Bilibili：液泡pao', url: 'https://space.bilibili.com/518590350' },
			{ icon: 'ph:discord-logo-bold', text: 'Discord绳梯社区 | 600+用户', url: 'https://dc.vacu.top' },
			{ icon: 'ph:github-logo-bold', text: 'GitHub: VacuolePaoo', url: 'https://github.com/VacuolePaoo' },
			{ icon: 'ph:rss-simple-bold', text: 'Atom订阅', url: '/atom.xml' },
			// { icon: 'ph:subway-bold', text: '开往', url: 'https://www.travellings.cn/go-by-clouds.html' },
		] satisfies NavItem[],
		/** 页脚站点地图 */
		nav: [
			{
				title: 'Explore',
				items: [
					{ icon: 'ph:subway-bold', text: '开往', url: 'https://www.travellings.cn/go-by-clouds.html' },
					{ icon: 'ph:binoculars-bold', text: 'BlogFinder', url: 'https://bf.zzxworld.com/' },
					{ icon: 'ph:flying-saucer-bold', text: '异次元旅行', url: 'https://travel.moe/go.html?travel=on' },
				],
			},
			{
				title: 'Contact Me',
				items: [
					{ icon: 'ph:envelope-simple-bold', text: blogConfig.author.email, url: `mailto:${blogConfig.author.email}` },
					{ icon: 'ph:github-logo-bold', text: 'Github', url: 'https://github.com/VacuolePaoo' },
					{ icon: 'ant-design:bilibili-outlined', text: 'Bilibili', url: 'https://space.bilibili.com/518590350' },
					{ icon: 'ph:discord-logo-bold', text: 'LadderHub', url: 'https://dc.vacu.top' },
				],
			},
			{
				title: 'More',
				items: [
					{ icon: 'ph:info-bold', text: '关于本站', url: '/blog' },
					{ icon: 'ph:bell-simple-bold', text: '订阅', url: '/feed' },
				],
			},
		] satisfies Nav,
	},

	/** 左侧栏顶部 Logo */
	header: {
		logo: 'https://s2.loli.net/2025/08/05/vW2pnGsJOAd6qEX.jpg',
		/** 展示标题文本，否则展示纯 Logo */
		showTitle: true,
		subtitle: blogConfig.subtitle,
		emojiTail: ['\\o\/', '🙌', '😭', '🙌', '\\o\/'],
	},

	/** 左侧栏导航 */
	nav: [
		{
			title: '',
			items: [
				{ icon: 'ph:files-bold', text: '文章', url: '/' },
				{ icon: 'ph:link-bold', text: '友链', url: '/link' },
				{ icon: 'ph:archive-bold', text: '归档', url: '/archive' },
				// { icon: 'ph:quotes-bold', text: '即刻短文', url: '/moment' },
			],
		},
	] satisfies Nav,

	pagination: {
		perPage: 10,
		/** 默认排序方式，需要是 this.article.order 中的键名 */
		sortOrder: 'date' as const,
		/** 允许（普通/预览/归档）文章列表正序，开启后排序方式左侧图标可切换顺序 */
		allowAscending: false,
	},

	themes: {
		light: {
			icon: 'ph:sun-bold',
			tip: '素光',
		},
		system: {
			icon: 'ph:lego-smiley-bold',
			tip: '顺仪',
		},
		dark: {
			icon: 'ph:moon-bold',
			tip: '暗域',
		},
	},
})
