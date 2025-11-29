<script setup lang="ts">
interface Props {
  /**
   * 背景图片URL
   */
  bgImg?: string
}

const props = defineProps<Props>()
</script>

<template>
<ZWidget 
  card 
  title="订阅" 
  :bg-img="bgImg"
  class="wechat-card"
>
  <div class="qrcode-placeholder">
    <Icon name="ph:qr-code" class="qrcode-icon" />
    <div class="qrcode-text">二维码区域</div>
  </div>
</ZWidget>
</template>

<style lang="scss" scoped>
.wechat-card {
  :deep(.widget-header) {
    margin-bottom: 0.2em;
  }
}

.qrcode-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1em;
  border-radius: 0.5em;
  background-color: var(--c-bg-soft);
  color: var(--c-text-2);
}

.qrcode-icon {
  font-size: 2em;
  margin-bottom: 0.5em;
}

.qrcode-text {
  font-size: 0.9em;
}
</style>