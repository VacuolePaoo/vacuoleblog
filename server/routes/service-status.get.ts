import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
	try {
		const response = await $fetch('https://api2.vacu.top')
		return response
	}
	catch (error) {
		console.error('获取服务状态失败:', error)
		throw createError({
			statusCode: 500,
			statusMessage: '无法获取服务状态信息',
		})
	}
})
