import type { FeedGroup } from '~/types/feed'
import { getFavicon, getGhAvatar, getGhIcon, getQqAvatar, QqAvatarSize } from './utils/img'

export default [
	{
		name: '相谈甚多',
		// @keep-sorted { "keys": ["date"] }
		entries: [
			{
				author: 'share121',
				link: 'https://s121.top/',
				icon: 'https://unavatar.webp.se/google/s121.top?s=32',
				avatar: 'https://s2.loli.net/2025/08/05/BlGVZfYgOuEqAL7.jpg',
				date: '2025-08-29',
				sitenick: '小派蒙',
				desc: '一个什么都可能会写的博客',
				archs: ['Hexo', 'Netlify'],
				comment: '同龄好友，技术大佬。',
			},
			{
				author: '纸鹿本鹿',
				link: 'https://blog.zhilu.site/',
				icon: 'https://www.zhilu.site/api/avatar.png',
				avatar: 'https://www.zhilu.site/api/avatar.png',
				date: '2025-09-14',
				sitenick: '摸鱼处',
				title: '纸鹿摸鱼处',
				desc: '纸鹿至麓不知路，支炉制露不止漉',
				archs: ['Nuxt', 'Vercel'],
			},
			{
				author: '纳西妲',
				link: 'https://nahida.im1',
				icon: 'https://nahida.im/favicon.ico',
				avatar: 'https://nahida.im/profile.png',
				date: '2025.05.30',
				sitenick: 'Nahida',
				desc: '为世界上一切美好而战！',
				feed: 'https://nahida.im/rss.xml',
				archs: ['Astro', 'Cloudflare'],
				comment: '来自Discord群组，曾经搞崩过服务器',
			},
		],
	},
	{
		name: '网上邻居',
		// @keep-sorted { "keys": ["date"] }
		entries: [
			{
				author: 'kzhik',
				link: 'https://www.kzhik.cn',
				icon: 'https://unavatar.webp.se/google/www.kzhik.cn?s=32',
				avatar: 'https://www.kzhik.cn/avatar.webp',
				date: '2025-09-01',
				title: 'kzhik’s website',
				desc: 'EXPLORE THE WORLD!',
				feed: 'https://www.kzhik.cn/resources/rss.xml',
				archs: ['Nuxt', '虚拟主机'],
				comment: '自主设计，交互有趣的独立博客。',
			},
			{
				author: '张洪Heo',
				link: 'https://blog.zhheo.com/',
				icon: 'https://img.zhheo.com/i/67d8fa75943e4.webp',
				avatar: 'https://img.zhheo.com/i/67d8fa75943e4.webp',
				date: '2025-11-01',
				title: '张洪Heo',
				desc: '分享设计与科技生活',
				archs: ['Hexo', '虚拟主机'],
			},
		],
	},
]
