<template>
  <div ref="rootRef" class="scroll">
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import useScroll from './useScroll'

export default defineComponent({
  name: 'scroll',
  props: {
    click: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const rootRef = ref(null)
    useScroll(rootRef, props)

    return {
      rootRef
    }
  }
})
</script>

<style scoped></style>
