import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import PullUp from '@better-scroll/pull-up'
import { ref, onMounted, onUnmounted } from 'vue'

BScroll.use(PullUp)
BScroll.use(ObserveDOM)

export default function usePullUpLoad(requestData) {
  const scroll = ref(null)
  const rootRef = ref(null)
  const isPullUpLoad = ref(false)

  onMounted(() => {
    const scrollVal = (scroll.value = new BScroll(rootRef.value, {
      pullUpLoad: true, // 实现上拉加载能力
      observeDOM: true,
      click: true
    }))

    scrollVal.on('pullingUp', pullingUpHandler)

    async function pullingUpHandler() {
      isPullUpLoad.value = true
      await requestData()
      scrollVal.finishPullUp()
      isPullUpLoad.value = false
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  return {
    scroll,
    rootRef,
    isPullUpLoad
  }
}
