<script setup lang="ts">
const appConfig = useAppConfig()
useSeoMeta({
	title: '留言',
	description: appConfig.description,
})

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'comm-group'])
</script>

<template>
<div class="comment-page">
	<div class="comment-container">
		<PostComment />
	</div>
</div>
</template>

<style lang="scss" scoped>
.comment-page {
	padding: 2rem 1rem;
	animation: float-in 0.3s backwards;
}

.comment-container {
	max-width: 800px;
	margin: 0 auto;
}
</style>
