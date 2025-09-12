<script setup lang="ts">
const appConfig = useAppConfig()
const layoutStore = useLayoutStore()
layoutStore.setAside(['toc'])

const { data: cookiesContent } = await useAsyncData('/cookies', () => queryCollection('content').path('/cookies').first())

useSeoMeta({
	title: 'Cookie政策',
	ogType: 'article',
	description: `${appConfig.title}的Cookie政策，说明本网站如何使用Cookie技术。`,
})
</script>

<template>
<div class="mobile-only">
	<ZhiluHeader to="/" suffix="Cookie政策" />
</div>

<template v-if="cookiesContent">
	<!-- 使用 float-in 动画会导致搜索跳转不准确 -->
	<ContentRenderer
		class="article"
		:class="getPostTypeClassName(cookiesContent?.type, { prefix: 'md' })"
		:value="cookiesContent"
		tag="article"
	/>
</template>

<ZError
	v-else
	icon="solar:confounded-square-bold-duotone"
	title="内容为空或页面不存在"
/>
</template>
