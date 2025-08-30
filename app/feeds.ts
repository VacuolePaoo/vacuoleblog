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
				avatar: 'https://vblog-image.s3.bitiful.net/2025/08/62387f110258b89dbbcb002f05978a19.jpg',
				archs: ['Hexo', 'Netlify'],
				date: '2025-08-29',
				comment: '同龄好友，技术大佬。',
			},
		],
	},
] satisfies FeedGroup[]
