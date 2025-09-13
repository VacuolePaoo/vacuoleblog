import type { FeedGroup } from '~/types/feed'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

export default defineEventHandler(async (event) => {
	// 仅在服务端执行
	if (!process.server) {
		return {
			success: false,
			error: 'This API is only available on server',
		}
	}

	// 仅在开发环境下可用
	if (!import.meta.dev) {
		throw createError({
			statusCode: 403,
			message: 'Feeds admin API is only available in development mode',
		})
	}

	try {
		const body = await readBody(event)

		// 验证输入数据
		if (!Array.isArray(body)) {
			throw new TypeError('Invalid data format: expected array')
		}

		// 构建文件内容
		let fileContent = `import type { FeedGroup } from '~/types/feed'
import { getFavicon, getGhAvatar, getGhIcon, getQqAvatar, QqAvatarSize } from './utils/img'

export default [\n`

		// 处理每个分组
		for (const group of body) {
			if (!group || typeof group !== 'object') {
				continue
			}

			fileContent += '  {\n'

			// 添加分组名称（必需字段）
			if (typeof group.name === 'string') {
				fileContent += `    name: ${JSON.stringify(group.name)},\n`
			}
			else {
				throw new TypeError('Invalid group name')
			}

			// 添加分组描述（如果有）
			if (group.desc && typeof group.desc === 'string') {
				fileContent += `    desc: ${JSON.stringify(group.desc)},\n`
			}

			// 添加 entries 数组开始
			fileContent += '    // @keep-sorted { "keys": ["date"] }\n'
			fileContent += '    entries: [\n'

			// 处理每个条目
			if (Array.isArray(group.entries)) {
				for (const entry of group.entries) {
					if (!entry || typeof entry !== 'object') {
						continue
					}

					fileContent += '      {\n'

					// 添加必需字段
					if (typeof entry.author === 'string') {
						fileContent += `        author: ${JSON.stringify(entry.author)},\n`
					}
					else {
						throw new TypeError('Missing required field: author')
					}

					if (typeof entry.link === 'string') {
						fileContent += `        link: ${JSON.stringify(entry.link)},\n`
					}
					else {
						throw new TypeError('Missing required field: link')
					}

					fileContent += `        icon: ${JSON.stringify(entry.icon || '')},\n`
					fileContent += `        avatar: ${JSON.stringify(entry.avatar || '')},\n`

					if (typeof entry.date === 'string') {
						fileContent += `        date: ${JSON.stringify(entry.date)},\n`
					}
					else {
						throw new TypeError('Missing required field: date')
					}

					// 添加可选字段
					if (entry.sitenick && typeof entry.sitenick === 'string') {
						fileContent += `        sitenick: ${JSON.stringify(entry.sitenick)},\n`
					}

					if (entry.title && typeof entry.title === 'string') {
						fileContent += `        title: ${JSON.stringify(entry.title)},\n`
					}

					if (entry.desc && typeof entry.desc === 'string') {
						fileContent += `        desc: ${JSON.stringify(entry.desc)},\n`
					}

					if (entry.feed && typeof entry.feed === 'string') {
						fileContent += `        feed: ${JSON.stringify(entry.feed)},\n`
					}

					if (Array.isArray(entry.archs) && entry.archs.length > 0) {
						// 过滤并验证架构数据
						const validArchs = entry.archs.filter((arch: any) => typeof arch === 'string')
						if (validArchs.length > 0) {
							fileContent += `        archs: ${JSON.stringify(validArchs)},\n`
						}
					}

					if (entry.comment && typeof entry.comment === 'string') {
						fileContent += `        comment: ${JSON.stringify(entry.comment)},\n`
					}

					if (entry.error && typeof entry.error === 'string') {
						fileContent += `        error: ${JSON.stringify(entry.error)},\n`
					}

					fileContent += '      },\n'
				}
			}

			// 结束 entries 数组
			fileContent += '    ],\n'

			// 结束分组对象
			fileContent += '  },\n'
		}

		// 结束整个数组
		fileContent += ']\n'

		// 写入文件
		const filePath = join(process.cwd(), 'app', 'feeds.ts')
		writeFileSync(filePath, fileContent)

		return {
			success: true,
		}
	}
	catch (error: any) {
		return {
			success: false,
			error: error.message || 'Unknown error occurred',
		}
	}
})
