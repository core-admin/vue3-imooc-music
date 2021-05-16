import { ref, watch, computed, nextTick } from 'vue'

// 处理定位的标题的内容

const useFixed = props => {
  const TITLE_HEIGHT = 30

  const groupRef = ref(null)
  const listHeights = ref([])
  const scrollY = ref(0)
  // 当前滚动的位置落到了哪个区间的索引
  const currentIndex = ref(0)
  // 当前组的下一个组的顶部 与 容器顶部的一个距离
  const distance = ref(0)

  const fixedTitle = computed(() => {
    // scrollY是可能出现负值的 滚动到顶部继续往下拖拽会有继续下拉效果（出现负值的原因）
    if (scrollY.value < 0) {
      return ''
    }

    // 根据currentIndex去数据中取到对应下标数据的标题
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = distanceVal > 0 && distanceVal < TITLE_HEIGHT ? distanceVal - TITLE_HEIGHT : 0

    return {
      transform: `translate3d(0, ${diff}px, 0)`
    }
  })

  watch(
    () => props.data,
    async () => {
      // 等待dom初始化完成 再进行计算
      await nextTick()
      calculate()
    }
  )

  watch(scrollY, newY => {
    const listHeightsVal = listHeights.value

    // 刚开始push了一个0，多一位 所以 len - 1
    for (let i = 0, len = listHeightsVal.length - 1; i < len; i++) {
      // 取区间的顶部与底部做一个对比（上一个与下一个区间）
      const heightTop = listHeightsVal[i]
      // 如果len不减一的话 当遍历到最后一个的时候 i + 1 就取不到值了 为undefined
      const heightBottom = listHeightsVal[i + 1]

      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
      }
    }
  })

  const calculate = () => {
    // 获取歌手对应的li dom集合
    const list = groupRef.value.children
    // 每一个li的高度的数字集合
    const listHeightsVal = listHeights.value
    // 会多次调用 每次调用前重置下
    listHeightsVal.length = 0
    let height = 0

    // 处理计算区间高度
    listHeightsVal.push(height)

    list.forEach(groupItem => {
      height += groupItem.clientHeight
      listHeightsVal.push(height)
    })
  }

  const onScroll = position => {
    scrollY.value = -position.y
  }

  return {
    groupRef,
    currentIndex,
    fixedTitle,
    fixedStyle,
    onScroll
  }
}

export default useFixed
