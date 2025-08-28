<script setup lang="ts">
function handleClick() {
	window.open('https://dc.vacu.top', '_blank')
}
</script>

<template>
<ZWidget card title="技术社区" bg-img="https://s2.loli.net/2025/08/05/zFqs6SLhpTBc7Vm.png" bg-right class="clickable-card" @click="handleClick">
	<div class="title" title="点击前往社区">
		LadderHub <br>
		绳梯社区
	</div>
</ZWidget>
</template>

<style lang="scss" scoped>
@font-face {
	font-family: ShuHei;
	src: url(/fonts/AlimamaShuhei.woff2);
}

.title {
	margin: 0.8rem;
	background-clip: text;
	background-image: linear-gradient(60deg, var(--c-accent) -30%, var(--c-primary), var(--c-text-1));
	background-position: 100% 0;
	background-size: 200%;
	font-size: 1.8em;
	font-family: ShuHei;
	letter-spacing: 0.05em;
	color: transparent;
	transition: background-position 0.2s;

	.widget:hover & {
		background-position: 0 0;
	}
}

.tip {
	margin: 0.2em 0;
	font-size: 0.9em;
}

:deep(.bg-img).bg-img.bg-img {
	opacity: 0.5;
}

.clickable-card {
	cursor: pointer;
}
</style>
