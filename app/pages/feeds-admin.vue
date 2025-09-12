<script setup lang="ts">
import type { FeedEntry, FeedGroup } from '~/types/feed'
import type { Arch } from '~/utils/icon'
import feeds from '~/feeds'

definePageMeta({
	middleware: [
		function () {
			if (process.server) {
				return
			}

			// 仅在本地开发环境下可用
			const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
			if (!isLocalhost) {
				throw createError({
					statusCode: 403,
					message: 'Feeds admin is only available on localhost',
				})
			}
		},
	],
})

useHead({
	title: '友链管理',
})

const groups = ref<FeedGroup[]>(JSON.parse(JSON.stringify(feeds)))
// 用于跟踪每个友链条目的展开状态
const expandedEntries = ref<Record<string, boolean>>({})

function addGroup() {
	groups.value.push({
		name: '新分组',
		entries: [],
	})
}

function removeGroup(index: number) {
	if (typeof window !== 'undefined' && window.confirm?.('确定要删除这个分组吗？')) {
		groups.value.splice(index, 1)
	}
}

function addEntry(groupIndex: number) {
	const newEntry: FeedEntry = {
		author: '',
		link: '',
		icon: '',
		avatar: '',
		date: new Date().toISOString().split('T')[0] as string,
	}

	const group = groups.value[groupIndex]
	if (group) {
		if (!group.entries) {
			group.entries = []
		}
		group.entries.push(newEntry)
	}
}

function removeEntry(groupIndex: number, entryIndex: number) {
	if (typeof window !== 'undefined' && window.confirm?.('确定要删除这个友链吗？')) {
		const group = groups.value[groupIndex]
		if (group?.entries) {
			group.entries.splice(entryIndex, 1)
		}
	}
}

async function saveFeeds() {
	try {
		const response: any = await $fetch('/api/feeds-admin', {
			method: 'POST',
			body: groups.value,
		})

		if (typeof window !== 'undefined') {
			if (response.success) {
				window.alert?.('保存成功!')
			}
			else {
				window.alert?.(`保存失败: ${response.error}`)
			}
		}
	}
	catch (error) {
		if (typeof window !== 'undefined') {
			window.alert?.(`保存失败: ${error}`)
		}
	}
}

function exportFeeds() {
	if (typeof window === 'undefined')
		return

	const dataStr = JSON.stringify(groups.value, null, 2)
	const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

	const exportFileDefaultName = 'feeds-export.json'

	const linkElement = document.createElement('a')
	linkElement.setAttribute('href', dataUri)
	linkElement.setAttribute('download', exportFileDefaultName)
	linkElement.style.display = 'none'
	document.body.appendChild(linkElement)
	linkElement.click()
	document.body.removeChild(linkElement)
}

// 移动分组
function moveGroupUp(index: number) {
	if (index > 0) {
		const temp = groups.value[index]!
		groups.value[index] = groups.value[index - 1]!
		groups.value[index - 1] = temp
	}
}

function moveGroupDown(index: number) {
	if (index < groups.value.length - 1) {
		const temp = groups.value[index]!
		groups.value[index] = groups.value[index + 1]!
		groups.value[index + 1] = temp
	}
}

// 移动条目
function moveEntryUp(groupIndex: number, entryIndex: number) {
	const group = groups.value[groupIndex]
	const entries = group?.entries
	if (group && entries && entryIndex > 0) {
		const temp = entries[entryIndex]!
		entries[entryIndex] = entries[entryIndex - 1]!
		entries[entryIndex - 1] = temp
	}
}

function moveEntryDown(groupIndex: number, entryIndex: number) {
	const group = groups.value[groupIndex]
	const entries = group?.entries
	if (group && entries && entryIndex < entries.length - 1) {
		const temp = entries[entryIndex]!
		entries[entryIndex] = entries[entryIndex + 1]!
		entries[entryIndex + 1] = temp
	}
}

// 切换友链条目展开状态
function toggleEntry(groupIndex: number, entryIndex: number) {
	const key = `${groupIndex}-${entryIndex}`
	expandedEntries.value[key] = !expandedEntries.value[key]
}

// 检查友链条目是否展开
function isEntryExpanded(groupIndex: number, entryIndex: number) {
	const key = `${groupIndex}-${entryIndex}`
	return !!expandedEntries.value[key]
}
</script>

<template>
<div class="feeds-admin">
	<div class="header">
		<h1>友链数据管理</h1>
		<div class="actions">
			<button class="btn-primary" @click="addGroup">
				<Icon name="ph:plus-bold" /> 添加分组
			</button>
			<button class="btn-success" @click="saveFeeds">
				<Icon name="ph:inbox-bold" /> 保存
			</button>
			<button class="btn-info" @click="exportFeeds">
				<Icon name="ph:download-bold" /> 导出
			</button>
		</div>
	</div>

	<div v-for="(group, groupIndex) in groups" :key="groupIndex" class="group">
		<div class="group-header">
			<div class="group-title">
				<input v-model="group.name" placeholder="分组名" class="group-name-input">
				<input v-model="group.desc" placeholder="分组描述（可选）" class="group-desc-input">
			</div>
			<div class="group-actions">
				<button :disabled="groupIndex === 0" class="btn-icon" @click="moveGroupUp(groupIndex)">
					<Icon name="ph:arrow-up-bold" />
				</button>
				<button :disabled="groupIndex === groups.length - 1" class="btn-icon" @click="moveGroupDown(groupIndex)">
					<Icon name="ph:arrow-down-bold" />
				</button>
				<button class="btn-danger" @click="removeGroup(groupIndex)">
					<Icon name="ph:trash-bold" /> 删除分组
				</button>
			</div>
		</div>

		<div class="entries">
			<div
				v-for="(entry, entryIndex) in group.entries"
				:key="entryIndex"
				class="entry"
			>
				<div class="entry-header" @click="toggleEntry(groupIndex, entryIndex)">
					<div v-if="entry.avatar" class="avatar-preview">
						<img :src="entry.avatar" :alt="entry.author" @error="entry.avatar = ''">
					</div>
					<div class="entry-title">
						<input
							v-model="entry.author"
							placeholder="作者（必填）"
							class="author-input"
							required
						>
						<input
							v-model="entry.link"
							type="url"
							placeholder="博客链接（必填）"
							class="link-input"
							required
						>
					</div>
					<div class="entry-actions">
						<button
							:disabled="entryIndex === 0"
							class="btn-icon"
							@click.stop="moveEntryUp(groupIndex, entryIndex)"
						>
							<Icon name="ph:arrow-up-bold" />
						</button>
						<button
							:disabled="entryIndex === (group.entries?.length ?? 0) - 1"
							class="btn-icon"
							@click.stop="moveEntryDown(groupIndex, entryIndex)"
						>
							<Icon name="ph:arrow-down-bold" />
						</button>
						<button
							class="btn-danger btn-icon"
							@click.stop="removeEntry(groupIndex, entryIndex)"
						>
							<Icon name="ph:trash-bold" />
						</button>
						<div class="expand-indicator">
							<Icon :name="isEntryExpanded(groupIndex, entryIndex) ? 'ph:caret-up-bold' : 'ph:caret-down-bold'" />
						</div>
					</div>
				</div>

				<div v-show="isEntryExpanded(groupIndex, entryIndex)" class="entry-details">
					<div class="detail-row">
						<label>网站昵称</label>
						<input v-model="entry.sitenick" placeholder="可选">
					</div>

					<div class="detail-row">
						<label>网站标题</label>
						<input v-model="entry.title" placeholder="可选">
					</div>

					<div class="detail-row">
						<label>描述</label>
						<input v-model="entry.desc" placeholder="可选">
					</div>

					<div class="detail-row">
						<label>订阅源</label>
						<input v-model="entry.feed" type="url" placeholder="可选">
					</div>

					<div class="detail-row">
						<label>图标</label>
						<div class="input-with-preview">
							<input v-model="entry.icon" type="url" placeholder="网站图标链接">
							<div v-if="entry.icon" class="icon-preview">
								<img :src="entry.icon" :alt="`${entry.author} icon`" @error="entry.icon = ''">
							</div>
						</div>
					</div>

					<div class="detail-row">
						<label>头像</label>
						<div class="input-with-preview">
							<input v-model="entry.avatar" type="url" placeholder="博主头像链接">
							<div v-if="entry.avatar" class="icon-preview">
								<img :src="entry.avatar" :alt="`${entry.author} avatar`" @error="entry.avatar = ''">
							</div>
						</div>
					</div>

					<div class="detail-row">
						<label>技术架构</label>
						<input
							:value="entry.archs?.join(', ') ?? ''"
							placeholder="可选，多个用逗号分隔"
							@input="(e) => {
								const target = e.target as HTMLInputElement
								const value = target.value.trim()
								if (value) {
									entry.archs = value.split(',').map(a => a.trim() as Arch).filter(a => a)
								}
								else {
									entry.archs = undefined
								}
							}"
						>
					</div>

					<div class="detail-row">
						<label>日期</label>
						<input v-model="entry.date" type="date" required>
					</div>

					<div class="detail-row">
						<label>备注</label>
						<input v-model="entry.comment" placeholder="可选">
					</div>

					<div class="detail-row">
						<label>错误信息</label>
						<input v-model="entry.error" placeholder="可选">
					</div>
				</div>
			</div>
		</div>

		<div class="entry-actions-footer">
			<button class="btn-secondary" @click="addEntry(groupIndex)">
				<Icon name="ph:plus-bold" /> 添加友链
			</button>
		</div>
	</div>
</div>
</template>

<style lang="scss" scoped>
// 样式已移至 ~/assets/css/feeds-admin.scss
</style>
