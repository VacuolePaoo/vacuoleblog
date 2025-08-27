<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

interface Audio {
	name: string
	artist: string
	url: string
	cover?: string
	lrc?: string
	type?: 'normal' | 'hls' | 'flv'
	[key: string]: any
}

interface MetingProps {
	server: 'netease' | 'tencent' | 'kugou' | 'xiami' | 'baidu'
	type: 'song' | 'playlist' | 'album' | 'search' | 'artist'
	id: string | number
}

interface AudioPlayerProps {
	audio?: Audio | Audio[]

	// MetingJS props
	server?: MetingProps['server']
	type?: MetingProps['type']
	id?: MetingProps['id']

	mini?: boolean
	autoplay?: boolean
	theme?: string
	loop?: 'all' | 'one' | 'none'
	order?: 'list' | 'random'
	preload?: 'none' | 'metadata' | 'auto'
	volume?: number
	mutex?: boolean
	lrcType?: 0 | 1 | 2 | 3
	listFolded?: boolean
	listMaxHeight?: number
	storageName?: string
}

const props = withDefaults(defineProps<AudioPlayerProps>(), {
	mini: false,
	autoplay: false,
	theme: '#b7daff',
	loop: 'none',
	order: 'list',
	preload: 'auto',
	volume: 0.7,
	mutex: true,
	lrcType: 0,
	listFolded: false,
	listMaxHeight: 250,
	storageName: 'aplayer-setting',
})

const playerContainer = ref<HTMLElement | null>(null)
let aplayerInstance: any = null

// 添加状态跟踪
const isLibraryLoaded = ref(false)
const isMetingLoaded = ref(false)
const isLoading = ref(true) // 添加加载状态
const playerHeight = ref(94) // 默认高度

const hasMetingProps = computed(() => {
	return props.server && props.type && props.id
})

onMounted(() => {
	// 检查是否已经加载了APlayer
	if (typeof window !== 'undefined' && (window as any).APlayer) {
		isLibraryLoaded.value = true
		loadMetingJS()
		return
	}

	// 动态加载APlayer CSS和JS
	useHead({
		link: [
			{
				rel: 'stylesheet',
				href: 'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css',
			},
		],
		script: [
			{
				src: 'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js',
				onload: () => {
					isLibraryLoaded.value = true
					loadMetingJS()
				},
			},
		],
	})
})

function loadMetingJS() {
	if (!hasMetingProps.value) {
		initializePlayer()
		return
	}

	// 检查是否已经加载了MetingJS
	if (typeof window !== 'undefined' && (window as any).MetingJS) {
		isMetingLoaded.value = true
		initializeMeting()
		return
	}

	// 加载MetingJS
	useHead({
		script: [
			{
				src: 'https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js',
				onload: () => {
					isMetingLoaded.value = true
					initializeMeting()
				},
			},
		],
	})
}

// 监听库加载状态变化
watch([isLibraryLoaded, isMetingLoaded], ([libLoaded, metingLoaded]) => {
	if (libLoaded && (!hasMetingProps.value || metingLoaded)) {
		isLoading.value = false
		if (hasMetingProps.value) {
			initializeMeting()
		}
		else {
			initializePlayer()
		}
	}
})

// 动态调整播放器高度
function adjustPlayerHeight() {
	if (!playerContainer.value) {
		return
	}

	// 使用 nextTick 确保 DOM 已更新
	nextTick(() => {
		const aplayerElement = playerContainer.value?.querySelector('.aplayer')
		if (aplayerElement) {
			// 获取实际高度
			const actualHeight = aplayerElement.clientHeight
			if (actualHeight > 0) {
				playerHeight.value = actualHeight
			}
			else {
				// 如果无法获取实际高度，使用预设值
				playerHeight.value = props.type === 'playlist'
					? (props.listMaxHeight ? props.listMaxHeight + 100 : 350)
					: 94
			}
		}
		else {
			// 如果没有找到 aplayer 元素，使用默认高度
			playerHeight.value = props.type === 'playlist'
				? (props.listMaxHeight ? props.listMaxHeight + 100 : 350)
				: 94
		}
	})
}

// 定期检查播放器高度
function watchPlayerHeight() {
	const interval = setInterval(() => {
		adjustPlayerHeight()
	}, 1000)

	// 组件销毁时清除定时器
	onUnmounted(() => {
		clearInterval(interval)
	})

	return interval
}

function initializeMeting() {
	if (!playerContainer.value) {
		return
	}

	// 清空容器
	playerContainer.value.innerHTML = ''

	// 创建Meting元素
	const metingElement = document.createElement('meting-js')
	metingElement.setAttribute('server', props.server!)
	metingElement.setAttribute('type', props.type!)
	// 确保id是字符串类型
	metingElement.setAttribute('id', String(props.id!))

	// 设置APlayer选项
	const aplayerOptions = {
		mini: props.mini,
		autoplay: props.autoplay,
		theme: props.theme,
		loop: props.loop,
		order: props.order,
		preload: props.preload,
		volume: props.volume,
		mutex: props.mutex,
		lrcType: props.lrcType,
		listFolded: props.listFolded,
		listMaxHeight: props.listMaxHeight,
		storageName: props.storageName,
	}

	// 将选项添加为属性
	Object.entries(aplayerOptions).forEach(([key, value]) => {
		if (value !== undefined) {
			metingElement.setAttribute(`:${key}`, JSON.stringify(value))
		}
	})

	playerContainer.value.appendChild(metingElement)

	// 触发MetingJS更新
	if (typeof window !== 'undefined' && (window as any).MetingJS) {
		const MetingJS = (window as any).MetingJS
		// 实例化以触发更新
		void new MetingJS()
	}

	// 监听播放器加载完成事件并调整高度
	if (props.type === 'playlist') {
		// 等待DOM更新后调整高度
		setTimeout(() => {
			adjustPlayerHeight()
			// 启动定期检查
			watchPlayerHeight()
		}, 100)
	}
}

function initializePlayer() {
	// 确保DOM元素和APlayer库都已加载
	if (typeof window === 'undefined'
		|| !(window as any).APlayer
		|| !playerContainer.value) {
		return
	}

	try {
		// 如果已经存在实例，先销毁
		if (aplayerInstance) {
			aplayerInstance.destroy()
		}

		const APlayer = (window as any).APlayer
		const options: any = {
			container: playerContainer.value,
			mini: props.mini,
			autoplay: props.autoplay,
			theme: props.theme,
			loop: props.loop,
			order: props.order,
			preload: props.preload,
			volume: props.volume,
			mutex: props.mutex,
			lrcType: props.lrcType,
			listFolded: props.listFolded,
			listMaxHeight: `${props.listMaxHeight}px`,
			storageName: props.storageName,
			audio: Array.isArray(props.audio) ? props.audio : [props.audio],
		}

		aplayerInstance = new APlayer(options)

		// 监听播放列表展开事件
		if (props.type === 'playlist') {
			// 等待播放器初始化完成
			setTimeout(() => {
				adjustPlayerHeight()
				// 启动定期检查
				watchPlayerHeight()
			}, 100)
		}
	}
	catch (error) {
		console.error('Failed to initialize APlayer:', error)
	}
}

onUnmounted(() => {
	if (aplayerInstance) {
		aplayerInstance.destroy()
		aplayerInstance = null
	}
})
</script>

<template>
<div class="audio-player-wrapper">
	<div class="audio-player-placeholder" :style="{ minHeight: `${playerHeight}px` }">
		<div v-show="isLoading" class="loading-text">
			加载中...
		</div>
		<div ref="playerContainer" class="audio-player-container" />
	</div>
</div>
</template>

<style lang="scss" scoped>
.audio-player-wrapper {
	width: 100%;
}

.audio-player-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	width: 100%;
	box-sizing: border-box;
	border: 1px solid var(--c-border);
	background-color: var(--c-bg-2);
	transition: min-height 0.3s ease;
}

.loading-text {
	margin-bottom: 10px;
}

.audio-player-container {
	width: 100%;
}
</style>
