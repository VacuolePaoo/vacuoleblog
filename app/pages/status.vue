<script setup lang="ts">
import { formatDuration, intervalToDuration } from 'date-fns'

// 定义服务状态类型
interface ServiceHistory {
	checkedAt: string
	status: 'UP' | 'DOWN'
	httpStatus: number
	responseTime: number
}

interface ServiceStatus {
	website: string
	url: string
	history: ServiceHistory[]
}

const appConfig = useAppConfig()
useSeoMeta({
	title: '服务状态',
	description: `查看${appConfig.title}相关服务的实时状态。`,
})

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'blog-tech', 'comm-group'])

// 计算服务状态
function getServiceStatus(history: ServiceHistory[]) {
	if (!history.length)
		return 'unknown'
	const latest = history[history.length - 1]
	return latest?.status === 'UP' ? 'operational' : 'outage'
}

// 计算正常运行时间
function calculateUptime(history: ServiceHistory[]) {
	if (!history.length)
		return 0
	const upCount = history.filter(item => item.status === 'UP').length
	return upCount / history.length
}

// 计算平均响应时间
function calculateAvgResponseTime(history: ServiceHistory[]) {
	if (!history.length)
		return 0
	const totalResponseTime = history.reduce((sum, item) => sum + item.responseTime, 0)
	return Math.round(totalResponseTime / history.length)
}

// 格式化最后检查时间
function formatLastChecked(checkedAt?: string) {
	if (!checkedAt)
		return '从未'

	const date = new Date(checkedAt)
	const duration = intervalToDuration({ start: date, end: new Date() })
	const formatted = formatDuration(duration, { format: ['days', 'hours', 'minutes'] })
	return formatted ? `${formatted}前` : '刚刚'
}

// 获取最近N次状态检查记录用于可视化展示
function getRecentHistory(history: ServiceHistory[], count = 20) {
	if (!history.length)
		return []
	// 取最近的记录，如果不足则返回全部
	return history.slice(-count)
}

// 状态描述映射
const statusDescriptions = {
	operational: '正常运行',
	degraded: '性能下降',
	outage: '服务中断',
	unknown: '未知状态',
}

// 状态标签类名映射
function statusClass(status: string) {
	switch (status) {
		case 'operational':
			return 'status-operational'
		case 'degraded':
			return 'status-degraded'
		case 'outage':
			return 'status-outage'
		case 'unknown':
		default:
			return 'status-unknown'
	}
}

// 获取服务状态数据
const { data: services, pending, refresh, error } = await useAsyncData(
	'service-status',
	async () => {
		try {
			// 使用服务端API代理请求，绕过CORS限制
			const response = await $fetch('/service-status')
			return response as ServiceStatus[]
		}
		catch (err) {
			console.warn('无法获取服务状态:', err)
			return []
		}
	},
	{
		server: false,
	},
)

// 手动刷新数据
async function refreshStatus() {
	await refresh()
}
</script>

<template>
<div class="status-page">
	<div class="page-header">
		<h1 class="page-title">
			服务状态
		</h1>
		<p>查看所有服务的实时运行状态</p>
	</div>

	<div v-if="pending && !services" class="loading-state">
		<div class="loading-spinner" />
		<p>正在加载服务状态...</p>
	</div>

	<div v-else-if="error" class="error-state">
		<Icon name="ph:warning-circle" />
		<h3>获取服务状态失败</h3>
		<p>暂时无法获取服务状态信息，请稍后再试。</p>
		<button @click="refreshStatus">
			重试
		</button>
	</div>

	<div v-else-if="services" class="services-list">
		<div
			v-for="service in services"
			:key="service.url"
			class="service-card"
		>
			<div class="service-header">
				<h2 class="service-title">
					{{ service.website }}
				</h2>
				<span
					class="status-badge"
					:class="statusClass(getServiceStatus(service.history))"
				>
					{{ statusDescriptions[getServiceStatus(service.history)] }}
				</span>
			</div>

			<p class="service-url">
				{{ service.url }}
			</p>

			<!-- 状态历史可视化 -->
			<div class="status-history">
				<div
					v-for="(record, index) in getRecentHistory(service.history)"
					:key="index"
					class="status-block"
					:class="`status-${record.status.toLowerCase()}`"
					:title="`检查时间: ${new Date(record.checkedAt).toLocaleString()}\n状态: ${record.status}\n响应时间: ${record.responseTime}ms`"
				/>
			</div>

			<div class="service-metrics">
				<div class="metric">
					<span class="metric-label">正常运行时间</span>
					<span class="metric-value">{{ (calculateUptime(service.history) * 100).toFixed(2) }}%</span>
				</div>

				<div class="metric">
					<span class="metric-label">平均响应时间</span>
					<span class="metric-value">{{ calculateAvgResponseTime(service.history) }}ms</span>
				</div>

				<div class="metric">
					<span class="metric-label">最后检查</span>
					<span class="metric-value">
						{{ formatLastChecked(service.history[service.history.length - 1]?.checkedAt) }}
					</span>
				</div>
			</div>
		</div>
	</div>

	<div v-if="services && services.length === 0" class="empty-state">
		<Icon name="ph:warning-bold" class="warning-icon" />
		<h3 class="empty-title">
			暂无服务信息
		</h3>
		<p class="empty-description">
			当前没有配置服务信息，或请求失败。
		</p>
	</div>
</div>
</template>

<style lang="scss" scoped>
// 页面容器
.status-page {
	margin: 1rem;
}

// 页面头部
.page-header {
	margin: 2rem 0 1rem;

	.page-title {
		margin-bottom: 0.5rem;
		font-size: 1.8rem;
	}
}

// 加载、错误和空状态容器
.loading-state,
.error-state,
.empty-state {
	padding: 3rem 1rem;
	text-align: center;

	.loading-spinner {
		width: 2rem;
		height: 2rem;
		margin: 0 auto 1rem;
		border: 2px solid var(--c-border);
		border-top-color: var(--c-primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	.warning-icon {
		font-size: 2rem;
	}

	.empty-title {
		margin: 1rem 0 0.5rem;
	}

	.empty-description {
		margin-bottom: 1rem;
		color: var(--c-text-2);
	}
}

// 服务列表容器
.services-list {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

// 单个服务卡片
.service-card {
	display: block;
	position: relative;
	overflow: hidden;
	padding: 1.5rem;
	border: 1px solid var(--c-border);
	border-radius: 0.8rem;
	box-shadow: 0 4px 20px var(--v-card-shadow);
	background-color: var(--ld-bg-card);
	z-index: 0;

	// 服务卡片头部
	.service-header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.service-title {
			font-size: 1.3rem;
		}
	}

	// 服务URL
	.service-url {
		margin-bottom: 1rem;
		word-break: break-all;
		color: var(--c-text-3);
	}

	// 状态历史可视化
	.status-history {
		display: flex;
		gap: 2px;
		margin-bottom: 1rem;
		padding: 0.5rem;
		border-radius: 4px;
		background-color: var(--c-bg-2);
	}

	.status-block {
		flex: 1;
		height: 20px;
		min-width: 6px;
		border-radius: 2px;
		cursor: help;
	}

	.status-up {
		background-color: #4CAF50;
	}

	.status-down {
		background-color: #F44336;
	}

	.status-timeout {
		background-color: #FF9800;
	}

	// 服务指标网格
	.service-metrics {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	}

	// 单个指标项
	.metric {
		display: flex;
		flex-direction: column;

		.metric-label {
			margin-bottom: 0.25rem;
		}
	}
}

// 状态徽章
.status-badge {
	padding: 0.25rem 0.75rem;
	border-radius: 10rem;
	font-size: 0.85rem;
	font-weight: bold;
}

// 正常运行状态徽章
.status-operational {
	background: rgb(76 175 80 / 15%);
	color: #4CAF50;
}

// 性能下降状态徽章
.status-degraded {
	background: rgb(255 152 0 / 15%);
	color: #FF9800;
}

// 服务中断状态徽章
.status-outage {
	background: rgb(244 67 54 / 15%);
	color: #F44336;
}

// 未知状态徽章
.status-unknown {
	background: rgb(158 158 158 / 15%);
	color: #9E9E9E;
}

// 旋转动画
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

// 响应式设计 - 移动端适配
@media (max-width: 768px) {
	.status-page {
		margin: 0.5rem;
	}

	.service-card {
		padding: 1rem;
	}

	.service-header {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.service-metrics {
		grid-template-columns: 1fr;
	}
}
</style>
