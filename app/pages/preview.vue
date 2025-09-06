<script setup lang="ts">
const appConfig = useAppConfig()
useSeoMeta({
	title: '预览',
	description: `${appConfig.title}的文章预览。`,
})
const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-log'])

const { data: listRaw } = useArticleIndex('previews/%')
const { listSorted, isAscending, sortOrder } = useArticleSort(listRaw)
const { category, categories, listCategorized } = useCategory(listSorted)
</script>

<template>
<div class="preview">
	<div class="preview-header">
		<h1>
			<ZRawLink class="mobile-only" to="/" title="返回首页">
				<Icon name="ph:caret-left-bold" />
			</ZRawLink>🚧施工中🚧
		</h1>
		<ZOrderToggle
			v-model:is-ascending="isAscending"
			v-model:sort-order="sortOrder"
			v-model:category="category"
			:categories
		/>
	</div>
	<p>勇敢的人探索世界。这里是一些还未发布的文章。</p>

	<menu>
		<ZArticle
			v-for="article in listCategorized"
			:key="article.path"
			v-bind="article"
			:to="article.path"
			:use-updated="sortOrder === 'updated'"
		/>
	</menu>
</div>
</template>

<style lang="scss" scoped>
.preview {
	margin: 1rem;
}

.preview-header {
	display: flex;
	align-items: center;
	justify-content: space-between;

	h1 {
		mask-image: linear-gradient(#FFF, transparent);
	}
}
</style>
