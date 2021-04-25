<template>
  <div class="progress-bar" ref="progressBarRef" @click="onClick">
    <!-- 底色条 背景 -->
    <div class="bar-inner">
      <!-- 实时显示的进度条 -->
      <div class="progress" ref="progressRef" :style="progressStyle"></div>
      <!-- 进度点 -->
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue'

// const progressBtnWidth = 8

export default defineComponent({
  name: 'ProgressBar',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  // 手指拖拽中 与 手指拖拽完毕抬起
  emits: ['progress-changing', 'progress-changed'],
  setup(props, { emit }) {
    const offset = ref(0)
    const progressBarRef = ref(null)
    const progressRef = ref(null)

    const progressStyle = computed(() => {
      return `width: ${offset.value}px`
    })

    const btnStyle = computed(() => {
      // const barWidth = getBarWidth()
      // const btnTrackWidth = getBarWidth(progressBtnWidth)
      // const x = btnTrackWidth * (offset.value / barWidth)
      // return `transform: translate3d(${x}px, 0, 0)`

      return `transform: translate3d(${offset.value}px, 0, 0)`
    })

    watch(() => props.progress, setOffset)

    const getBarWidth = (progressBtnWidth = 0) =>
      progressBarRef.value?.clientWidth - progressBtnWidth || 0

    function setOffset(progress) {
      const barWidth = getBarWidth()
      offset.value = barWidth * progress
    }

    let touch = {}
    const onTouchStart = e => {
      touch.touchStartX = e.touches[0].pageX
      touch.startWidth = progressRef.value.clientWidth
    }

    const onTouchMove = e => {
      // 偏移量
      const delta = e.touches[0].pageX - touch.touchStartX
      const tempWidth = touch.startWidth + delta
      const barWidth = getBarWidth()
      const ratio = tempWidth / barWidth
      const progress = Math.max(0, Math.min(1, ratio))
      offset.value = barWidth * progress
      emit('progress-changing', progress)
    }

    const onTouchEnd = () => {
      const barWidth = getBarWidth()
      const progress = offset.value / barWidth
      touch = {}
      emit('progress-changed', progress)
    }

    const onClick = e => {
      const rect = progressBarRef.value.getBoundingClientRect().left
      const offsetWidth = e.pageX - rect
      const barWidth = getBarWidth()
      const progress = offsetWidth / barWidth
      emit('progress-changed', progress)
    }

    return {
      offset,
      progressBarRef,
      progressRef,
      progressStyle,
      btnStyle,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onClick,
      setOffset
    }
  }
})
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        /* left: 7px; */
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
