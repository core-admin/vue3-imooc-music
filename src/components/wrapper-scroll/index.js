import Scroll from '@/components/base/scroll/scroll'
import { h, mergeProps, withCtx, renderSlot, ref, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'

// withCtx函数 保证上下文正确的
// renderSlot 渲染插槽的辅助函数

export default {
  name: 'WrapScroll',
  props: Scroll.props,
  emits: Scroll.emits,
  // render(ctx, _cache, $props, $setup)
  render(ctx) {
    return h(
      Scroll,
      mergeProps(ctx.$props, {
        onScroll: $event => {
          ctx.$emit('scroll', $event)
        },
        ref: 'scrollRef'
      }),
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, 'default')]
        })
      }
    )
  },
  setup() {
    const scrollRef = ref(null)
    const store = useStore()
    const playlist = computed(() => store.state.playlist)
    const scroll = computed(() => {
      return scrollRef.value.scroll
    })

    watch(playlist, async () => {
      await nextTick()
      scroll.value.refresh()
    })

    return {
      scrollRef,
      playlist,
      scroll
    }
  }
}
