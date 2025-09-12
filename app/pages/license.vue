<script setup lang="ts">
const appConfig = useAppConfig()
const layoutStore = useLayoutStore()
layoutStore.setAside(['toc'])

const { data: licenseContent } = await useAsyncData('/license', () => queryCollection('content').path('/license').first())

useSeoMeta({
	title: '许可协议',
	ogType: 'article',
	description: `${appConfig.title}的许可协议，说明本网站内容的使用条款。`,
})
</script>

<template>
<div class="mobile-only">
	<ZhiluHeader to="/" suffix="许可协议" />
</div>

<template v-if="licenseContent">
	<!-- 使用 float-in 动画会导致搜索跳转不准确 -->
	<ContentRenderer
		class="article"
		:class="getPostTypeClassName(licenseContent?.type, { prefix: 'md' })"
		:value="licenseContent"
		tag="article"
	/>
</template>

<ZError
	v-else
	icon="solar:confounded-square-bold-duotone"
	title="内容为空或页面不存在"
/>
</template>
