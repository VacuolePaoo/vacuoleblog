<script setup lang="ts">
import { getPostDate } from '~/utils/time'

// 定义说说数据类型
interface Moment {
	text: string
	image: string[]
	time: number
	views: string | null
}

// 格式化文本，将换行符转换为 <br> 标签
function formatText(text: string) {
	return text.replace(/\n/g, '<br>')
}

// 提取哔哩哔哩视频ID
function extractBilibiliId(text: string) {
	const match = text.match(/https?:\/\/(www\.)?bilibili\.com\/video\/(BV\w+)/)
	return match ? match[2] : null
}

// 移除文本中的哔哩哔哩链接
function removeBilibiliLink(text: string) {
	return text.replace(/https?:\/\/(www\.)?bilibili\.com\/video\/(BV\w+)/g, '').trim()
}

const appConfig = useAppConfig()
useSeoMeta({
	title: '即刻短文',
	description: `${appConfig.title}的说说页面，记录生活中的点点滴滴。`,
})

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'blog-log'])

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
			return []
		}
	},
)
</script>

<template>
<div class="moment-page">
	<div v-if="pending" class="loading text-center">
		<Icon name="ph:hourglass-medium-bold" />
		<span>正在拉取TGTalk数据...</span>
	</div>

	<div v-else-if="error" class="error text-center">
		<Icon name="ph:chat-slash-bold" />
		<span>加载失败，请稍后重试</span>
	</div>

	<div v-else-if="moments && moments.length > 0" class="moment-list">
		<TransitionGroup name="moment-float-in">
			<div
				v-for="(moment, index) in moments"
				:key="index"
				class="moment-item moment-card"
				:style="{ '--delay': `${index * 0.05}s` }"
			>
				<div class="moment-content">
					<!-- 文本内容 -->
					<div v-if="moment.text && !extractBilibiliId(moment.text)" class="moment-text" v-html="formatText(moment.text)" />
					<!-- 有视频时的文本内容 -->
					<div v-else-if="moment.text && extractBilibiliId(moment.text)" class="moment-text" v-html="formatText(removeBilibiliLink(moment.text))" />

					<!-- 哔哩哔哩视频 -->
					<div v-if="extractBilibiliId(moment.text)" class="moment-video">
						<VideoEmbed
							:id="extractBilibiliId(moment.text) || ''"
							type="bilibili"
							:ratio="16 / 9"
						/>
					</div>

					<!-- 图片内容 -->
					<div v-if="moment.image && moment.image.length > 0 && !extractBilibiliId(moment.text)" class="moment-images">
						<div
							v-for="(img, imgIndex) in moment.image"
							:key="imgIndex"
							class="moment-image"
						>
							<Pic :src="img" :caption="`图片${imgIndex + 1}`" :zoom="true" />
						</div>
					</div>
					<!-- 时间 -->
					<div class="moment-time">
						{{ getPostDate(new Date(moment.time)) }}
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
// 页面容器样式
.moment-page {
	padding: 2rem 1rem;
	animation: float-in 0.3s backwards;
}

// 加载、错误和空状态的通用样式
.loading, .error, .empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.8rem;
	padding: 2rem 1rem;

	// 状态图标样式
	.iconify {
		opacity: 0.5;
		font-size: 2.5rem;
	}

	// 状态文本样式
	span {
		font-size: 1rem;
	}
}

// 错误状态的特殊样式
.error {
	color: var(--c-danger);
}

// 说说列表容器样式
.moment-list {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

// 单个说说项目样式
.moment-item {
	transition: all 0.3s ease;
	animation: float-in 0.3s var(--delay) backwards;
}

.moment-card {
	display: block;
	position: relative;
	overflow: hidden;
	border: 1px solid var(--c-border);
	border-radius: 0.8rem;
	box-shadow: 0 4px 20px var(--v-card-shadow);
	background: no-repeat 100% / 400%;
	background-color: var(--ld-bg-card);
	z-index: 0;

	&::before {
		content: "";
		position: absolute;
		inset: 2px;
		transition: all 1s;
		z-index: -1;
	}

	&:hover, &.active {
		background-position: 0;

		&::before {
			transition: all 0.2s;
		}
	}
}

// 说说内容区域样式
.moment-content {
	padding: 1.2rem 1.4rem;
}

// 说说文本内容样式
.moment-text {
	margin-bottom: 0.5rem;
	font-size: 16px;
	line-height: 1.5;
	white-space: pre-wrap;
	word-wrap: break-word;
}

// 图片列表容器样式
.moment-images {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
	gap: 0.4rem;
	margin-bottom: 0.75rem;
}

// 单张图片容器样式
.moment-image {
	img {
		width: 24px;
		transition: transform 0.2s;
		object-fit: cover;

		&:hover {
			transform: scale(1.03);
		}
	}
}

// 发布时间样式
.moment-time {
	font-size: 12px;
	color: var(--c-text-2);

	// text-align: right;
}

// 说说项目入场动画样式
.moment-float-in {
	&-enter-active {
		transition: all 0.3s ease;
	}

	&-enter-from {
		opacity: 0;
		transform: translateY(15px);
	}

	&-enter-to {
		opacity: 1;
		transform: translateY(0);
	}
}

// 移动端响应式样式
@media (max-width: 768px) {
	.moment-content {
		padding: 1rem;
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
