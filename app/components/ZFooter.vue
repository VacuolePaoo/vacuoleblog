<script setup lang="ts">
const appConfig = useAppConfig()

const hitokoto = ref('')
const showHitokoto = ref(false)
const footerVisible = ref(false)

// 获取一言
async function fetchHitokoto() {
	try {
		const response = await fetch('https://international.v1.hitokoto.cn/?encode=text')
		hitokoto.value = await response.text()
		showHitokoto.value = true
	}
	catch (error) {
		console.error('获取一言失败:', error)
		hitokoto.value = ' '
		showHitokoto.value = true
	}
}

// 创建 Intersection Observer
onMounted(() => {
	const footerElement = document.querySelector('.z-footer')
	if (!footerElement)
		return

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			// 当footer可见比例超过50%时，设置为可见
			footerVisible.value = entry.intersectionRatio > 0.5
		})
	}, {
		threshold: [0, 0.5, 1], // 在0%, 50%, 100%时触发回调
	})

	observer.observe(footerElement)

	// 组件卸载时停止观察
	onUnmounted(() => {
		observer.disconnect()
	})
})

// 页面加载时初始化
fetchHitokoto()
</script>

<template>
<footer class="z-footer" :class="{ visible: footerVisible }">
	<nav class="footer-nav">
		<div v-for="(group, groupIndex) in appConfig.footer.nav" :key="groupIndex" class="footer-nav-group">
			<h3 v-if="group.title">
				{{ group.title }}
			</h3>
			<menu>
				<li v-for="(item, itemIndex) in group.items" :key="itemIndex">
					<ZRawLink :to="item.url">
						<Icon :name="item.icon" />
						<span class="nav-text">{{ item.text }}</span>
					</ZRawLink>
				</li>
			</menu>
		</div>
	</nav>
	<p v-html="appConfig.footer.copyright" />
	<p class="hitokoto" :class="{ 'hitokoto-fade-in': showHitokoto }">
		{{ hitokoto }}
	</p>
</footer>
</template>

<style lang="scss" scoped>
.z-footer {
	opacity: 0.3;
	margin: 3rem 1rem;
	font-size: 0.9em;
	color: var(--c-text-2);
	transition: opacity 0.3s ease;

	// 当footer可见时透明度恢复为1
	&.visible {
		opacity: 1;
	}

	.footer-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 5vw clamp(2rem, 5%, 5vw);
		padding-block: 3rem;

		h3 {
			display: flex;
			align-items: center;
			gap: 0.5em;
			margin: 0.5em;
			font: inherit;
		}

		a {
			display: flex;
			align-items: center;
			gap: 0.3em;
			width: fit-content;
			padding: 0.3em 0.5em;
			border-radius: 0.5em;
			font-size: 0.9em;
			transition: background-color 0.2s, color 0.1s;

			&:hover {
				background-color: var(--c-bg-soft);
				color: var(--c-text);
			}
		}
	}

	p {
		margin: 0.5em;
	}

	.hitokoto-fade-in {
		animation: fade-in 0.5s ease-in-out;
	}

	.hitokoto {
		color: var(--c-text-3);
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
}
</style>
