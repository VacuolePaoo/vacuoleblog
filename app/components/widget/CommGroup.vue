<script setup lang="ts">
function handleClick() {
	window.open('https://dc.vacu.top', '_blank')
}
</script>

<template>
<ZWidget card title="技术社区" bg-img="https://s2.loli.net/2025/08/05/zFqs6SLhpTBc7Vm.png" bg-right class="clickable-card" @click="handleClick">
	<div class="title" title="点击前往社区">
		<span class="original">LadderHub <br>绳梯社区</span>
		<span class="hover">加入 <br>Discord</span>
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
	position: relative;
	font-size: 1.8em;
	font-family: ShuHei;
	letter-spacing: 0.05em;

	overflow: hidden;
	mask-image: linear-gradient(
		to bottom,
		transparent 0%,
		black 15%,
		black 85%,
		transparent 100%
	);
	-webkit-mask-image: linear-gradient(
		to bottom,
		transparent 0%,
		black 15%,
		black 85%,
		transparent 100%
	);
	
	span {
		display: block;
		background-clip: text;
		background-image: linear-gradient(60deg, var(--c-accent) -30%, var(--c-primary), var(--c-text-1));
		background-position: 100% 0;
		background-size: 200%;
		color: transparent;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.original {
		transform: translateY(0);
	}

	.hover {
		position: absolute;
		top: 0;
		left: 0;
		transform: translateY(100%);
	}

	.widget:hover & {
		.original {
			transform: translateY(-100%);
		}
		.hover {
			transform: translateY(0);
		}
		span {
			background-position: 0 0;
		}
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
