<script setup lang="ts">
const appConfig = useAppConfig()
const layoutStore = useLayoutStore()
layoutStore.setAside([])

useSeoMeta({
	title: '订阅',
	description: `订阅${appConfig.title}的最新内容更新。`,
})

const wechatInfo = {
	title: '微信公众号',
	description: '关注我的微信公众号，获取最新的文章推送和精彩内容分享。',
	image: '/assets/qr.webp', // 公众号二维码图片路径
	tips: [
		'在微信内获取最新文章推送',
		'查看更多独家内容',
		'在公众号内互动与交流',
	],
}

const rssInfo = {
	title: 'RSS订阅',
	description: '通过RSS订阅获取博客最新文章更新，适用于各种RSS阅读器。',
	feeds: [
		{
			name: 'Atom订阅',
			url: '/atom.xml',
			description: '完整的Atom订阅源，支持现代RSS阅读器',
		},
	],
	tips: [
		'通过RSS阅读器获取最新文章',
		'自定义阅读体验',
		'支持所有主流RSS客户端',
	],
}
</script>

<template>
<div class="mobile-only">
	<ZhiluHeader to="/" suffix="订阅" />
</div>

<div class="subscribe-page">
	<div class="cards-container">
		<!-- 微信公众号订阅卡片 -->
		<div class="subscribe-card wechat-card">
			<div class="card-header">
				<h2>{{ wechatInfo.title }}</h2>
				<p class="card-description">
					{{ wechatInfo.description }}
				</p>
			</div>

			<div class="card-content">
				<div class="qr-code">
					<NuxtImg
						:src="wechatInfo.image"
						:alt="`${appConfig.title}微信公众号二维码`"
						width="200"
						height="200"
						class="qr-image"
					/>
				</div>

				<ul class="tips-list">
					<li v-for="(tip, index) in wechatInfo.tips" :key="index">
						<Icon name="ph:check-circle-fill" class="tip-icon" />
						{{ tip }}
					</li>
				</ul>
			</div>
		</div>

		<!-- RSS订阅卡片 -->
		<div class="subscribe-card rss-card">
			<div class="card-header">
				<h2>{{ rssInfo.title }}</h2>
				<p class="card-description">
					{{ rssInfo.description }}
				</p>
			</div>

			<div class="card-content">
				<div class="feed-links">
					<div
						v-for="(feed, index) in rssInfo.feeds"
						:key="index"
						class="feed-item"
					>
						<ZRawLink
							:to="feed.url"
							class="feed-link"
							target="_blank"
						>
							<Icon name="ph:rss-simple-bold" class="feed-icon" />
							<div class="feed-info">
								<span class="feed-name">{{ feed.name }}</span>
								<span class="feed-desc">{{ feed.description }}</span>
							</div>
							<Icon name="ph:arrow-right-bold" class="arrow-icon" />
						</ZRawLink>
					</div>
				</div>

				<ul class="tips-list">
					<li v-for="(tip, index) in rssInfo.tips" :key="index">
						<Icon name="ph:check-circle-fill" class="tip-icon" />
						{{ tip }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>
</template>

<style lang="scss" scoped>
.subscribe-page {
	margin: 1rem;
	padding: 1rem 0;

	.cards-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 1rem;
		}
	}

	.subscribe-card {
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
		border: 1px solid var(--c-border);
		border-radius: 0.8rem;
		box-shadow: 0 0.1em 0.2em var(--ld-shadow);
		background-color: var(--c-bg);
		transition: all 0.2s;

		&:hover {
			box-shadow: 0 0.5em 1em var(--ld-shadow);
		}

		&.wechat-card {
			color: var(--c-text-1);

			.card-header h2 {
				color: #2ECC71;
			}

			.card-description {
				color: var(--c-text-2);
			}

			.tip-icon {
				color: #2ECC71;
			}

			.feed-link {
				background: rgba(#2ECC71, 0.1);
				color: var(--c-text-1);

				&:hover {
					background: rgba(#2ECC71, 0.2);
				}

				.feed-icon {
					color: #2ECC71;
				}
			}
		}

		&.rss-card {
			color: var(--c-text-1);

			.card-header h2 {
				color: #F39C12;
			}

			.card-description {
				color: var(--c-text-2);
			}

			.tip-icon {
				color: #F39C12;
			}

			.feed-link {
				border: 1px solid transparent;
				background: rgba(#F39C12, 0.1);
				color: var(--c-text-1);
				transition: all 0.3s ease;

				&:hover {
					border-color: rgba(#F39C12, 0.3);
					background: rgba(#F39C12, 0.2);
				}

				.feed-icon {
					color: #F39C12;
				}
			}
		}
	}

	.card-header {
		margin-bottom: 1.5rem;

		h2 {
			margin-bottom: 0.5rem;
			font-size: 2rem;
			font-weight: 700;
		}
	}

	.card-description {
		opacity: 0.9;
		font-size: 1rem;
		line-height: 1.5;
	}

	.card-content {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;

		.qr-code {
			margin-bottom: 1.5rem;
			text-align: center;

			.qr-image {
				height: auto;
				max-width: 100%;
				padding: 0.5rem;
				border-radius: 0.5rem;
				box-shadow: 0 0.1em 0.2em var(--ld-shadow);
				background: white;
			}
		}

		.feed-links {
			margin-bottom: 1.5rem;

			.feed-item {
				margin-bottom: 1rem;

				&:last-child {
					margin-bottom: 0;
				}

				.feed-link {
					display: flex;
					align-items: center;
					padding: 1rem;
					border-radius: 0.5rem;
					text-decoration: none;
					transition: background 0.3s ease;

					.feed-icon {
						margin-right: 1rem;
						font-size: 1.5rem;
					}

					.feed-info {
						flex: 1;

						.feed-name {
							display: block;
							margin-bottom: 0.2rem;
							font-size: 1.1rem;
							font-weight: 600;
						}

						.feed-desc {
							opacity: 0.9;
							font-size: 0.9rem;
						}
					}

					.arrow-icon {
						font-size: 1.2rem;
					}
				}
			}
		}

		.tips-list {
			margin: 0;
			margin-top: auto;
			padding: 0;
			list-style: none;

			li {
				display: flex;
				align-items: center;
				margin-bottom: 0.8rem;
				font-size: 0.95rem;

				&:last-child {
					margin-bottom: 0;
				}

				.tip-icon {
					margin-right: 0.8rem;
					font-size: 1.2rem;
				}
			}
		}
	}
}
</style>
