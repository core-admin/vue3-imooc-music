<template>
  <div class="progress-bar" ref="progressBarRef">
    <!-- 底色条 背景 -->
    <div class="bar-inner">
      <!-- 实时显示的进度条 -->
      <div class="progress" ref="progress" :style="progressStyle"></div>
      <!-- 进度点 -->
      <div class="progress-btn-wrapper" :style="btnStyle">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue'

const progressBtnWidth = 16

export default defineComponent({
  name: 'ProgressBar',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const offset = ref(0)
    const progressBarRef = ref(null)

    const progressStyle = computed(() => {
      return `width: ${offset.value}px`
    })

    const btnStyle = computed(() => {
      return `transform: translate3d(${offset.value}px, 0, 0)`
    })

    watch(
      () => props.progress,
      newProgress => {
        const barWidth = progressBarRef.value.clientWidth - progressBtnWidth
        offset.value = barWidth * newProgress
      }
    )

    return {
      offset,
      progressBarRef,
      progressStyle,
      btnStyle
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
        left: 7px;
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
