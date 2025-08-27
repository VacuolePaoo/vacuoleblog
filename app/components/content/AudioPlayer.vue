<script setup lang="ts">
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

const hasMetingProps = computed(() => {
	return props.server && props.type && props.id
})

onMounted(() => {
	// 检查是否已经加载了APlayer
	if (typeof window !== 'undefined' && (window as any).APlayer) {
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
		if (hasMetingProps.value) {
			initializeMeting()
		}
		else {
			initializePlayer()
		}
	}
})

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
		// 创建MetingJS实例
		const MetingJS = (window as any).MetingJS
		// 实例化以触发更新
		void new MetingJS()
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
<div ref="playerContainer" class="audio-player" />
</template>
