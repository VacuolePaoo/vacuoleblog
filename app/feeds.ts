import type { FeedGroup } from '~/types/feed'
import { getFavicon, getGhAvatar, getGhIcon, getQqAvatar, QqAvatarSize } from './utils/img'

export default [
	{
		name: '相谈甚多',
		desc: '',
		// @keep-sorted { "keys": ["date"] }
		entries: [
			// {
			// 	author: 'GuuGuai',
			// 	sitenick: '杂记本',
			// 	title: '古怪杂记本',
			// 	desc: '一个什么都可能会写的博客',
			// 	link: 'https://gug.thisis.host/',
			// 	feed: 'https://gug.thisis.host/atom.xml',
			// 	icon: getFavicon('gug.thisis.host'),
			// 	avatar: 'https://cdn.libravatar.org/avatar/646331bff8f19a0e05679c3cc0fc54d6?s=160',
			// 	archs: ['Hexo', 'Netlify'],
			// 	date: '2024-01-29',
			// 	comment: '高中同学，技术好友，爱好番剧/折腾。',
			// },
			{
				author: 'share121',
				sitenick: '小派蒙',
				desc: '一个什么都可能会写的博客',
				link: 'https://s121.top/',
				icon: getFavicon('s121.top'),
				avatar: 'https://www.helloimg.com/i/2025/09/05/68baf804edb2a.jpg',
				archs: ['Hexo', 'Netlify'],
				date: '2025-08-29',
				comment: '同龄好友，技术大佬。',
			},
			{
				author: '纳西妲',
				sitenick: 'Nahida',
				desc: '为世界上一切美好而战！',
				link: 'https://nahida.im',
				feed: 'https://nahida.im/rss.xml',
				icon: 'https://nahida.im/favicon.ico',
				avatar: 'https://nahida.im/profile.png',
				archs: ['Astro', 'Cloudflare'],
				date: '2025.05.30',
				comment: '来自Discord群组，曾经搞崩过服务器',
			},
		],
	},
	{
		name: '网上邻居',
		entries: [
			{
				author: 'kzhik',
				desc: 'EXPLORE THE WORLD!',
				link: 'https://www.kzhik.cn',
				title: 'kzhik’s website',
				avatar: 'https://www.kzhik.cn/avatar.webp',
				icon: getFavicon('www.kzhik.cn'),
				date: '2025-09-01',
				archs: ['Nuxt', '虚拟主机'],
				comment: '自主设计，交互有趣的独立博客。',
				feed: 'https://www.kzhik.cn/resources/rss.xml',
			},
			{
				author: 'PlatyHsu',
				sitenick: 'neverland',
				desc: 'Editor. Currently at SSPAI.',
				link: 'https://hsu.cy/',
				feed: 'https://hsu.cy/feed.xml',
				icon: getFavicon('hsu.cy'),
				avatar: 'https://cdnfile.sspai.com/2024/01/19/2e1141e8de2022c94ea9dd8b805f877c.png?imageMogr2/auto-orient/thumbnail/!200x200r/gravity/center/crop/200x200/format/webp/ignore-error/1',
				archs: ['Hugo', 'Cloudflare'],
				date: '2025-09-03',
				comment: '长期记录多领域内容，涵盖数码产品软件配置、文艺作品品论等，兼具技术实践与观点分享。',
			},
		],
	},
] satisfies FeedGroup[]
