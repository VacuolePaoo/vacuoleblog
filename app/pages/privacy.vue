<script setup lang="ts">
const appConfig = useAppConfig()
const layoutStore = useLayoutStore()
layoutStore.setAside(['toc'])

const { data: privacyContent } = await useAsyncData('/privacy', () => queryCollection('content').path('/privacy').first())

useSeoMeta({
	title: '隐私政策',
	ogType: 'article',
	description: `${appConfig.title}的隐私政策，说明本网站如何收集和使用用户信息。`,
})
</script>

<template>
<div class="mobile-only">
	<ZhiluHeader to="/" suffix="隐私政策" />
</div>

<template v-if="privacyContent">
	<!-- 使用 float-in 动画会导致搜索跳转不准确 -->
	<ContentRenderer
		class="article"
		:class="getPostTypeClassName(privacyContent?.type, { prefix: 'md' })"
		:value="privacyContent"
		tag="article"
	/>
</template>

<ZError
	v-else
	icon="solar:confounded-square-bold-duotone"
	title="内容为空或页面不存在"
/>
</template>
