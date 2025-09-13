<script setup lang="ts">
import type { FeedEntry, FeedGroup } from '~/types/feed'
import type { Arch } from '~/utils/icon'
import VueDraggable from 'vuedraggable'
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
const expandedEntries = ref<Record<string, { expanded: boolean, entry: FeedEntry }>>({})

// 删除确认状态
const deleteConfirmations = ref<Record<string, boolean>>({})

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
	const key = `${groupIndex}-${entryIndex}`
	deleteConfirmations.value[key] = true
}

function confirmRemoveEntry(groupIndex: number, entryIndex: number) {
	const group = groups.value[groupIndex]
	if (group?.entries) {
		group.entries.splice(entryIndex, 1)
	}

	// 清理确认状态和展开状态
	const key = `${groupIndex}-${entryIndex}`
	delete deleteConfirmations.value[key]

	// 如果删除的是当前展开的条目，也需要清理expandedEntries中的引用
	if (expandedEntries.value[key]) {
		delete expandedEntries.value[key]
	}
}

function cancelRemoveEntry(groupIndex: number, entryIndex: number) {
	const key = `${groupIndex}-${entryIndex}`
	delete deleteConfirmations.value[key]
}

async function saveFeeds() {
	try {
		const response: any = await $fetch('/api/feeds-admin', {
			method: 'POST',
			body: groups.value,
		})

		// 简单的成功提示（不使用FeedMessage组件）
		if (response.success) {
			// 保存成功，无需额外提示
		}
		else {
			console.error(`保存失败: ${response.error}`)
		}
	}
	catch (error: any) {
		console.error(`保存失败: ${error.message || error}`)
	}
}

// 切换友链条目展开状态
function toggleEntry(groupIndex: number, entryIndex: number) {
	const key = `${groupIndex}-${entryIndex}`
	const entry = groups.value[groupIndex]?.entries[entryIndex]

	if (entry) {
		if (expandedEntries.value[key]?.expanded) {
			// 如果已展开，则关闭
			expandedEntries.value[key].expanded = false
		}
		else {
			// 如果未展开，则展开
			expandedEntries.value[key] = {
				expanded: true,
				entry,
			}
		}
	}
}

// 检查友链条目是否展开
function isEntryExpanded(groupIndex: number, entryIndex: number) {
	const key = `${groupIndex}-${entryIndex}`
	return !!expandedEntries.value[key]?.expanded
}

// 更新条目数据
function updateEntry(groupIndex: number, entryIndex: number, field: string, value: any) {
	const entry = groups.value[groupIndex]?.entries[entryIndex]
	if (entry) {
		(entry as any)[field] = value

		// 同步更新expandedEntries中的数据
		const key = `${groupIndex}-${entryIndex}`
		if (expandedEntries.value[key]) {
			expandedEntries.value[key].entry = entry
		}
	}
}

// 更新技术架构字段
function updateArchs(groupIndex: number, entryIndex: number, value: string) {
	const entry = groups.value[groupIndex]?.entries[entryIndex]
	if (entry) {
		const trimmedValue = value.trim()
		if (trimmedValue) {
			entry.archs = trimmedValue.split(',').map(a => a.trim() as Arch).filter(a => a)
		}
		else {
			entry.archs = undefined
		}

		// 同步更新expandedEntries中的数据
		const key = `${groupIndex}-${entryIndex}`
		if (expandedEntries.value[key]) {
			expandedEntries.value[key].entry = entry
		}
	}
}
</script>

<template>
<div class="feeds-admin">
	<div v-for="(group, groupIndex) in groups" :key="groupIndex" class="group">
		<h2 class="group-title">
			{{ group.name }}
		</h2>
		<div class="entries">
			<!-- 友链卡片 -->
			<VueDraggable
				v-model="group.entries"
				handle=".drag-handle"
				ghost-class="ghost"
				drag-class="drag"
				item-key="link"
			>
				<template #item="{ element: entry, index: entryIndex }">
					<div
						class="entry-card"
						@click="toggleEntry(groupIndex, entryIndex)"
					>
						<div class="entry-header">
							<div class="drag-handle">
								<Icon name="ph:list-bold" />
							</div>
							<div v-if="entry.avatar" class="avatar-preview">
								<img :src="entry.avatar" :alt="entry.author" @error="updateEntry(groupIndex, entryIndex, 'avatar', '')">
							</div>
							<div class="entry-title">
								<span class="author-display">{{ entry.author }}</span>
								<span class="link-display">{{ entry.link }}</span>
							</div>
						</div>
					</div>
				</template>
			</VueDraggable>

			<!-- 展开的编辑器 -->
			<div
				v-for="(entry, entryIndex) in group.entries"
				v-show="isEntryExpanded(groupIndex, entryIndex)"
				:key="`editor-${entryIndex}`"
				class="entry-editor"
			>
				<!-- 删除确认 -->
				<div v-if="deleteConfirmations[`${groupIndex}-${entryIndex}`]" class="delete-confirmation">
					<p>确定要删除这个友链吗？</p>
					<div class="confirmation-actions">
						<button class="btn-danger" @click="confirmRemoveEntry(groupIndex, entryIndex)">
							确定
						</button>
						<button class="btn-secondary" @click="cancelRemoveEntry(groupIndex, entryIndex)">
							取消
						</button>
					</div>
				</div>

				<div class="entry-details">
					<div class="detail-row">
						<label>作者（必填）</label>
						<input
							:value="entry.author"
							placeholder="作者"
							required
							@input="(e: Event) => updateEntry(groupIndex, entryIndex, 'author', (e.target as HTMLInputElement).value)"
						>
					</div>

					<div class="detail-row">
						<label>博客链接（必填）</label>
						<input
							:value="entry.link"
							type="url"
							placeholder="博客链接"
							required
							@input="(e: Event) => updateEntry(groupIndex, entryIndex, 'link', (e.target as HTMLInputElement).value)"
						>
					</div>

					<div class="detail-row">
						<label>网站昵称</label>
						<input
							:value="entry.sitenick"
							placeholder="可选"
							@input="(e: Event) => updateEntry(groupIndex, entryIndex, 'sitenick', (e.target as HTMLInputElement).value)"
						>
					</div>

					<div class="detail-row">
						<label>网站标题</label>
						<input
							:value="entry.title"
							placeholder="可选"
							@input="(e: Event) => updateEntry(groupIndex, entryIndex, 'title', (e.target as HTMLInputElement).value)"
						>
					</div>

					<div class="detail-row">
						<label>描述</label>
						<input
							:value="entry.desc"
							placeholder="可选"
							@input="(e: Event) => updateEntry(groupIndex, entryIndex, 'desc', (e.target as HTMLInputElement).value)"
						>
					</div>

					<div class="detail-row">
						<label>订阅源</label>
						<input
							:value="entry.feed"
							type="url"
							placeholder="可选"
							@input="(e: Event) => updateEntry(groupIndex, entryIndex, 'feed', (e.target as HTMLInputElement).value)"
						>
					</div>

					<div class="detail-row">
						<label>图标</label>
						<div class="input-with-preview">
							<input
								:value="entry.icon"
								type="url"
								placeholder="网站图标链接"
								@input="(e: Event) => updateEntry(groupIndex, entryIndex, 'icon', (e.target as HTMLInputElement).value)"
							>
							<div v-if="entry.icon" class="icon-preview">
								<img :src="entry.icon" :alt="`${entry.author} icon`" @error="updateEntry(groupIndex, entryIndex, 'icon', '')">
							</div>
						</div>
					</div>

					<div class="detail-row">
						<label>头像</label>
						<div class="input-with-preview">
							<input
								:value="entry.avatar"
								type="url"
								placeholder="博主头像链接"
								@input="(e: Event) => updateEntry(groupIndex, entryIndex, 'avatar', (e.target as HTMLInputElement).value)"
							>
							<div v-if="entry.avatar" class="icon-preview">
								<img :src="entry.avatar" :alt="`${entry.author} avatar`" @error="updateEntry(groupIndex, entryIndex, 'avatar', '')">
							</div>
						</div>
					</div>

					<div class="detail-row">
						<label>技术架构</label>
						<input
							:value="entry.archs?.join(', ') ?? ''"
							placeholder="可选，多个用逗号分隔"
							@input="(e: Event) => updateArchs(groupIndex, entryIndex, (e.target as HTMLInputElement).value)"
						>
					</div>

					<div class="detail-row">
						<label>日期</label>
						<input
							:value="entry.date"
							type="date"
							required
							@input="(e: Event) => updateEntry(groupIndex, entryIndex, 'date', (e.target as HTMLInputElement).value)"
						>
					</div>

					<div class="detail-row">
						<label>备注</label>
						<input
							:value="entry.comment"
							placeholder="可选"
							@input="(e: Event) => updateEntry(groupIndex, entryIndex, 'comment', (e.target as HTMLInputElement).value)"
						>
					</div>

					<div class="detail-row">
						<label>错误信息</label>
						<input
							:value="entry.error"
							placeholder="可选"
							@input="(e: Event) => updateEntry(groupIndex, entryIndex, 'error', (e.target as HTMLInputElement).value)"
						>
					</div>

					<div class="detail-actions">
						<button
							class="btn-danger btn-icon"
							@click.stop="removeEntry(groupIndex, entryIndex)"
						>
							<Icon name="ph:trash-bold" /> 删除
						</button>
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
	<div class="actions">
		<button class="btn-primary" @click="saveFeeds">
			<Icon name="ph:floppy-disk-bold" /> 保存
		</button>
	</div>
</div>
</template>

<style lang="scss" scoped>
// 样式已移至 ~/assets/css/feeds-admin.scss
</style>
