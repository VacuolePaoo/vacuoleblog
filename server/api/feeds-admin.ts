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

	const body = await readBody(event)

	try {
		// 构建文件内容
		let fileContent = `import type { FeedGroup } from '~/types/feed'
import { getFavicon, getGhAvatar, getGhIcon, getQqAvatar, QqAvatarSize } from './utils/img'

export default [\n`

		// 处理每个分组
		for (const group of body) {
			fileContent += '  {\n'

			// 添加分组名称
			fileContent += `    name: ${JSON.stringify(group.name)},\n`

			// 添加分组描述（如果有）
			if (group.desc) {
				fileContent += `    desc: ${JSON.stringify(group.desc)},\n`
			}

			// 添加 entries 数组开始
			fileContent += '    // @keep-sorted { "keys": ["date"] }\n'
			fileContent += '    entries: [\n'

			// 处理每个条目
			for (const entry of group.entries) {
				fileContent += '      {\n'

				// 添加必需字段
				fileContent += `        author: ${JSON.stringify(entry.author)},\n`
				fileContent += `        link: ${JSON.stringify(entry.link)},\n`
				fileContent += `        icon: ${JSON.stringify(entry.icon)},\n`
				fileContent += `        avatar: ${JSON.stringify(entry.avatar)},\n`
				fileContent += `        date: ${JSON.stringify(entry.date)},\n`

				// 添加可选字段
				if (entry.sitenick) {
					fileContent += `        sitenick: ${JSON.stringify(entry.sitenick)},\n`
				}

				if (entry.title) {
					fileContent += `        title: ${JSON.stringify(entry.title)},\n`
				}

				if (entry.desc) {
					fileContent += `        desc: ${JSON.stringify(entry.desc)},\n`
				}

				if (entry.feed) {
					fileContent += `        feed: ${JSON.stringify(entry.feed)},\n`
				}

				if (entry.archs && entry.archs.length > 0) {
					fileContent += `        archs: ${JSON.stringify(entry.archs)},\n`
				}

				if (entry.comment) {
					fileContent += `        comment: ${JSON.stringify(entry.comment)},\n`
				}

				if (entry.error) {
					fileContent += `        error: ${JSON.stringify(entry.error)},\n`
				}

				fileContent += '      },\n'
			}

			// 结束 entries 数组
			fileContent += '    ],\n'

			// 结束分组对象
			fileContent += '  },\n'
		}

		// 结束整个数组
		fileContent += '] satisfies FeedGroup[]\n'

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
			error: error.message,
		}
	}
})
