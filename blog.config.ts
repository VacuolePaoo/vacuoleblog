import type { FeedEntry } from './app/types/feed'

export { zhCN as dateLocale } from 'date-fns/locale/zh-CN'

// 存储 nuxt.config 和 app.config 共用的配置
// 此处为启动时需要的配置，启动后可变配置位于 app/app.config.ts
const blogConfig = {
	title: '液泡部落格',
	subtitle: '三尺书生，一介微命',
	// 长 description 利好于 SEO
	description: '液泡VacuolePao的个人博客，分享技术与生活。“折腾不止，摸鱼生活——摸门🙏🏻”。液泡是一名开源爱好者，结识了许多志同道合的朋友。这个博客记录了他在生活和技术学习中的点滴经历，充满启发与思考。网站界面简洁美观，内容丰富实用，人气互动活跃，涵盖了编程、生活、学习等多个领域，为读者提供了卓越的阅读体验。',
	author: {
		name: '液泡',
		avatar: 'https://www.helloimg.com/i/2025/08/31/68b33a598f1fd.jpg',
		email: 'hi@vacu.top',
		homepage: 'https://www.vacu.top',
	},
	copyright: {
		abbr: 'CC BY-NC-SA 4.0',
		name: '署名-非商业性使用-相同方式共享 4.0 国际',
		url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans',
	},
	favicon: '/assets/favicon.ico',
	language: 'zh-CN',
	timeEstablished: '2022-07-19',
	timezone: 'Asia/Shanghai',
	url: 'https://blog.vacu.top',

// 存储 nuxt.config 和 app.config 共用的配置
// 此处为启动时需要的配置，启动后可变配置位于 app/app.config.ts
// @keep-sorted
const blogConfig = {
	...basicConfig,

	article: {
		categories: {
			[basicConfig.defaultCategory]: { icon: 'ph:folder-dotted-bold' },
			经验分享: { icon: 'ph:mouse-bold', color: '#3af' },
			杂谈: { icon: 'ph:chat-bold', color: '#3ba' },
			生活: { icon: 'ph:shooting-star-bold', color: '#f77' },
			代码: { icon: 'ph:code-bold', color: '#77f' },
		},
		defaultCategoryIcon: 'ph:folder-bold',
		/** 分类排序方式，键为排序字段，值为显示名称 */
		order: {
			date: '创建日期',
			updated: '更新日期',
			// title: '标题',
		},
		/** 使用 pnpm new 新建文章时自动生成自定义链接（permalink/abbrlink） */
		useRandomPremalink: false,
		/** 隐藏基于文件路由（不是自定义链接）的 URL /post 路径前缀 */
		hidePostPrefix: true,
		/** 禁止搜索引擎收录的路径 */
		robotsNotIndex: ['/preview', '/previews/*'],
	},

	// 在 URL 中隐藏的路径前缀
	hideContentPrefixes: ['/posts'],

	imageDomains: [
		// 自动启用本域名的 Nuxt Image
		'www.zhilu.site',
		'7.isyangs.cn',
		'image.qingshuiot.cn',
		'www.helloimg.com',
	],

	// 禁止搜索引擎收录的路径
	robotsNotIndex: ['/preview', '/previews/*'],

	/** 向 <head> 中添加脚本 */
	scripts: [
		// 自己网站的 Cloudflare Insights 统计服务
		{ 'src': 'https://static.cloudflareinsights.com/beacon.min.js', 'data-cf-beacon': '{"token": "338fdafcb6e54510a0a59dfcf78ff79e"}', 'defer': true },
		// Twikoo 评论系统
		{ src: 'https://lib.baomitu.com/twikoo/1.6.44/twikoo.min.js', defer: true },
		// Umami
		{ 'src': 'https://cors.s121.top/https://cloud.umami.is/script.js', 'data-website-id': '1a3c2e77-3310-4e7a-af8f-e93c85cc9ada', 'defer': true },
		{ 'src': 'https://cloud.umami.is/script.js', 'data-website-id': '1a3c2e77-3310-4e7a-af8f-e93c85cc9ada', 'defer': true },
	],

	/** 自己部署的 Twikoo 服务 */
	twikoo: {
		envId: 'https://vacuoletwikoo.netlify.app/.netlify/functions/twikoo',
		preload: 'https://vacuoletwikoo.netlify.app/.netlify/functions/twikoo',
	},
}

/** 用于生成 OPML 和友链页面配置 */
export const myFeed: FeedEntry = {
	author: blogConfig.author.name,
	sitenick: '部落格',
	title: blogConfig.title,
	desc: blogConfig.subtitle || blogConfig.description,
	link: blogConfig.url,
	feed: new URL('/atom.xml', blogConfig.url).toString(),
	icon: blogConfig.favicon,
	avatar: blogConfig.author.avatar,
	archs: ['Nuxt', 'Netlify'],
	date: blogConfig.timeEstablished,
	comment: '高中牲畜，技术好友，爱好折腾。',
}

export default blogConfig
