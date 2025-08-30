<script setup lang="ts">
import { getPostDate } from '~/utils/time'
import { getImgUrl } from '../utils/img'

const appConfig = useAppConfig()
useSeoMeta({
	title: '即刻短文',
	description: `${appConfig.title}的说说页面，记录生活中的点点滴滴。`,
})

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'blog-log'])

// 定义说说数据类型
interface Moment {
	text: string
	image: string[]
	time: number
	views: string | null
}

// 获取说说数据
const { data: moments, pending, error } = await useAsyncData(
	'moments',
	async () => {
		try {
			const response = await fetch('https://api1.vacu.top')
			const data = await response.json()

			// 确保数据存在且有ChannelMessageData字段
			if (!data || !data.ChannelMessageData || !Array.isArray(data.ChannelMessageData)) {
				console.warn('返回数据格式不正确:', data)
				return []
			}

			// 过滤掉 views 为 null 的说说
			const filteredMoments: Moment[] = data.ChannelMessageData.filter(
				(moment: any) => moment.views !== null && moment.views !== undefined,
			)

			// 按时间倒序排列（最新的在前面）
			return filteredMoments.sort((a: Moment, b: Moment) => b.time - a.time)
		}
		catch (err) {
			console.error('获取说说数据失败:', err)
			return []
		}
	},
	{
		default: () => [],
	},
)
</script>

<template>
<div class="moment-page">
	<div class="moment-header text-center">
		<h1>说说</h1>
		<p>记录生活中的点点滴滴</p>
	</div>

	<div v-if="pending" class="loading text-center">
		<Icon name="svg-spinners:bars-scale-fade" />
		<span>加载中...</span>
	</div>

	<div v-else-if="error" class="error text-center">
		<Icon name="ph:x-circle-bold" />
		<span>加载失败，请稍后重试</span>
	</div>

	<div v-else-if="moments && moments.length > 0" class="moment-list">
		<TransitionGroup name="moment-float-in">
			<div
				v-for="(moment, index) in moments"
				:key="index"
				class="moment-item card"
			>
				<div class="moment-content">
					<div class="moment-meta">
						<div class="moment-avatar">
							<img
								:src="appConfig.author.avatar"
								:alt="appConfig.author.name"
								width="32"
								height="32"
							>
						</div>
						<div class="moment-info">
							<div class="moment-author">{{ appConfig.author.name }}</div>
							<div class="moment-time">{{ getPostDate(new Date(moment.time)) }}</div>
						</div>
						<div class="moment-views">
							<Icon name="ph:eye-bold" />
							{{ moment.views }}
						</div>
					</div>

					<div v-if="moment.text" class="moment-text">
						{{ moment.text }}
					</div>

					<div v-if="moment.image && moment.image.length > 0" class="moment-images">
						<div
							v-for="(img, index) in moment.image"
							:key="index"
							class="moment-image"
						>
							<img :src="getImgUrl(img, true)" :alt="`图片${index + 1}`" loading="lazy">
						</div>
					</div>
				</div>
			</div>
		</TransitionGroup>
	</div>

	<div v-else class="empty text-center">
		<Icon name="ph:chat-centered-dots-bold" />
		<span>暂无说说内容</span>
	</div>
</div>
</template>

<style lang="scss" scoped>
.moment-page {
	margin: 1rem;
}

.moment-header {
	margin-bottom: 1rem;
	text-align: center;

	h1 {
		font-size: 1.8rem;
		margin-bottom: 0.25rem;
	}

	p {
		color: var(--c-text-2);
		font-size: 0.9rem;
	}
}

.loading, .error, .empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 2rem 1rem;
	gap: 0.8rem;

	.iconify {
		font-size: 2.5rem;
		opacity: 0.5;
	}

	span {
		font-size: 1rem;
	}
}

.error {
	color: var(--c-danger);
}

.moment-list {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.moment-item {
	transition: all 0.3s ease;
	animation: float-in 0.3s ease;

	&:hover {
		transform: translateY(-2px);
	}
}

.moment-content {
	padding: 1rem;
}

.moment-meta {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin-bottom: 0.75rem;
}

.moment-avatar {
	img {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		object-fit: cover;
	}
}

.moment-info {
	flex: 1;

	.moment-author {
		font-weight: 600;
		margin-bottom: 0.1rem;
		font-size: 0.95rem;
	}

	.moment-time {
		font-size: 0.8rem;
		color: var(--c-text-2);
	}
}

.moment-views {
	display: flex;
	align-items: center;
	gap: 0.25rem;
	font-size: 0.8rem;
	color: var(--c-text-2);
}

.moment-text {
	margin-bottom: 0.75rem;
	line-height: 1.5;
	white-space: pre-wrap;
	word-break: break-word;
	font-size: 0.95rem;
}

.moment-images {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
	gap: 0.4rem;
}

.moment-image {
	img {
		width: 100%;
		height: 120px;
		object-fit: cover;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: transform 0.2s;

		&:hover {
			transform: scale(1.03);
		}
	}
}

.moment-float-in-enter-active {
	transition: all 0.3s ease;
}

.moment-float-in-enter-from {
	opacity: 0;
	transform: translateY(15px);
}

.moment-float-in-enter-to {
	opacity: 1;
	transform: translateY(0);
}

@media (max-width: 768px) {
	.moment-content {
		padding: 0.75rem;
	}

	.moment-images {
		grid-template-columns: repeat(2, 1fr);
		gap: 0.3rem;
	}
	
	.moment-image img {
		height: 100px;
	}
}
</style>