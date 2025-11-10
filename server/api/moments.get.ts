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

		// 过滤掉 views 为 null 的说说，并按时间倒序排列（最新的在前面）
		const filteredMoments: Moment[] = response.ChannelMessageData
			.filter((moment: any) => moment.views !== null && moment.views !== undefined)
			.sort((a: Moment, b: Moment) => b.time - a.time)

		return filteredMoments
	}
	catch (err) {
		console.error('获取说说数据失败:', err)
		// 返回空数组而不是抛出错误
		return []
	}
}, {
	maxAge: 60 * 10, // 将缓存时间从5分钟增加到10分钟，减少API请求频率
})
