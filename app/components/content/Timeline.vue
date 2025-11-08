<script lang="tsx" setup>
const slots = defineSlots<{
	default: () => VNode[]
}>()

function render() {
	const slotContent = slots.default()
	if (!slotContent)
		return <span>时间线为空</span>

	return slotContent.map((node: VNode) => {
		// WARN: 此处使用了非标准的 v-slot:default
		const textContent: string = (node.children as any)?.default?.()[0].children || ''
		const match = textContent?.match?.(/^\{(?<caption>.*)\}$/)
		return match?.groups
			? <dt class="timeline-caption">{match.groups.caption}</dt>
			: <dd class="timeline-body card">{node}</dd>
	})
}
</script>

<template>
<dl class="timeline">
	<render />
</dl>
</template>

<style lang="scss" scoped>
.timeline {
	position: relative;
	padding-inline-start: 1.5rem;
	font-size: 0.9rem;

	&::before {
		content: "";
		position: absolute;
		inset: 0.5rem auto 0;
		inset-inline-start: 0.5rem;
		width: 0.25rem;
		background-color: var(--c-bg-soft);
		border-radius: 0.125rem;
	}

	:deep() {
		.timeline-caption {
			opacity: 0.8;
			font-size: 0.9rem;
			position: relative;
			margin-bottom: 0.5rem;
			margin-top: 1rem;

			&:first-child {
				margin-top: 0;
			}

			&::before {
				content: "";
				position: absolute;
				inset-inline-start: -1.2rem;
				width: 0.75rem;
				height: 0.75rem;
				margin-top: 0.3rem;
				border-radius: 50%;
				background-color: var(--c-text-2);
				border: 2px solid var(--c-bg-1);
				z-index: 1;
			}
		}

		.timeline-body {
			overflow: hidden;
			width: fit-content;
			margin-bottom: 1rem;
			padding: 0 1rem;
			transition: all 0.2s;

			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 0.5rem 1rem var(--ld-shadow);
			}
		}
	}
}
</style>
