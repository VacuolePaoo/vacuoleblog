<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
<ZWidget card title="专栏">
	<div class="category-list">
		<a
			v-for="(item, key) in appConfig.article.categories"
			:key="key"
			class="category-item"
			:href="`/archive?category=${encodeURIComponent(key)}`"
			:style="{ '--category-color': item.color }"
		>
			<Icon :name="item.icon" class="category-icon" />
			<span class="category-name">{{ key }}</span>
			<span class="category-arrow">
				<Icon name="ph:arrow-right-bold" />
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
}

.category-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem;
	border-radius: 0.5rem;
	color: var(--c-text-2);
	text-decoration: none;
	transition: all 0.2s;

	&:hover {
		color: var(--category-color, var(--c-primary));
		background-color: var(--c-bg-soft);
	}
}

.category-icon {
	font-size: 1.2em;
}

.category-name {
	flex: 1;
}
</style>
