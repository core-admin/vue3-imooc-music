<template>
  <div ref="rootRef" class="scroll">
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import useScroll from './useScroll'

export default defineComponent({
  name: 'Scroll',
  emits: ['scroll'],
  props: {
    click: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    const rootRef = ref(null)

    // scroll这个组件中上定义的attr属性被当做BScroll的配置项使用
    const scroll = useScroll(rootRef, props, emit)

    return {
      rootRef,
      scroll
    }
  }
})
</script>

<style scoped></style>
