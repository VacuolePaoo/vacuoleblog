<script setup lang="ts">
import blogConfig from '~~/blog.config'

const appConfig = useAppConfig()

// 过滤掉默认分类
const filteredCategories = computed(() => {
	const categories = { ...appConfig.article.categories }
	delete categories[blogConfig.defaultCategory]
	return categories
})
</script>

<template>
<ZWidget card title="专栏">
	<div class="category-list">
		<a
			v-for="(item, key) in filteredCategories"
			:key="key"
			class="category-item"
			:href="`/archive?category=${encodeURIComponent(key)}`"
			:style="{ '--category-color': item.color }"
		>
			<Icon :name="item.icon" class="category-icon" />
			<span class="category-name">{{ key }}</span>
			<span class="category-arrow">
				<Icon class="category-arrow-icon" name="ph:arrow-right-bold" />
			</span>
		</a>
	</div>
</ZWidget>
</template>

<style lang="scss" scoped>
.category-list {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	padding-top: 0.4rem;
	padding-bottom: 0.4rem;
}

.category-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem;
	border-radius: 0.5rem;
	text-decoration: none;
	color: var(--c-text-2);
	transition: all 0.2s;

	&:hover {
		background-color: var(--c-bg-soft);
		color: var(--category-color, var(--c-primary));
	}
}

.category-icon {
	font-size: 1.2em;
}

.category-name {
	flex: 1;
}

.category-arrow-icon {
	opacity: 0;
	margin-right: 0.6rem;
	transform: translateX(-4px);
	transition: transform 0.3s ease;
}

.category-item:hover .category-arrow-icon {
	opacity: 1;
	transform: translateX(0);
}
</style>
