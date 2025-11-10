import { ofetch } from 'ofetch'

interface Moment {
	text: string
	image: string[]
	time: number
	views: string | null
}

export default defineCachedEventHandler(async (_event) => {
	try {
		// 设置5秒超时
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 5000)

		const response = await ofetch('https://api1.vacu.top', {
			signal: controller.signal,
		})

		clearTimeout(timeoutId)

		// 确保数据存在且有ChannelMessageData字段
		if (!response || !response.ChannelMessageData || !Array.isArray(response.ChannelMessageData)) {
			console.warn('返回数据格式不正确:', response)
			return []
		}

		// 过滤掉 views 为 null 的说说
		const filteredMoments: Moment[] = response.ChannelMessageData.filter(
			(moment: any) => {
				return moment.views !== null && moment.views !== undefined
			},
		)

		// 按时间倒序排列（最新的在前面）
		return filteredMoments.sort((a: Moment, b: Moment) => {
			return b.time - a.time
		})
	}
	catch (err) {
		console.error('获取说说数据失败:', err)
		// 返回空数组而不是抛出错误
		return []
	}
}, {
	maxAge: 60 * 5, // 5分钟缓存
})
