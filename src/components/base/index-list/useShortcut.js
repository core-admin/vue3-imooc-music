import { ref, computed } from 'vue'

const useShortcut = (props, groupRef) => {
  const ANCHOR_HEIGHT = 20
  const scrollRef = ref(null)

  const shortcutList = computed(() => props.data.map(v => v.title))

  // 记录手指touch初始信息值
  const touch = {}

  const onShortcutTouchStart = e => {
    const anchorIndex = parseInt(e.target.dataset.index)

    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex

    scrollTo(anchorIndex)
  }

  const onShortcutTouchMove = e => {
    touch.y2 = e.touches[0].pageY
    // 手指实时移动的位置减去开始的位置就是手指y方向偏移的距离
    // 然后除以一个触发点的高度（右侧缩略导航li的一个高度）就是手指偏移了几个楼层 3.11 | 0 向下取整（Math.floor ）
    const delta = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0
    // 求出最终手指落到哪个点上（索引）开始的索引 + 偏移的索引
    const anchorIndex = touch.anchorIndex + delta

    scrollTo(anchorIndex)
  }

  const scrollTo = index => {
    /* 
      // 自己的逻辑处理
      const list = groupRef.value.children
      if (index < 0 || index >= list.length) {
        return
      }
      console.log(index)
      const targetEl = list[index]
      const scroll = scrollRef.value.scroll
      scroll.scrollToElement(targetEl, 0) 
    */

    /* 
      改进 让index处于 0 与 groupRef.value.children.length-1 之间这个范围
      
      限定最大值 最大不会超过 groupRef.value.children.length - 1
      Math.min(groupRef.value.children.length - 1, index)

      限定最小值
      Math.min(0, Max)
    */

    // 边界判断
    if (isNaN(index)) {
      return
    }

    index = Math.max(0, Math.min(groupRef.value.children.length - 1, index))
    const targetEl = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}

export default useShortcut
