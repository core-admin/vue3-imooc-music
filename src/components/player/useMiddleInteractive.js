import { ref } from 'vue'

export default function useMiddleInteractive() {
  // cd | lyric
  const currentShow = ref('cd')
  const middleLStyle = ref(null)
  const middleRStyle = ref(null)

  const touch = {}
  let currentView = 'cd'

  function onMiddleTouchStart(e) {
    touch.touchStartX = e.touches[0].pageX
  }

  function onMiddleTouchMove(e) {
    const winWidth = window.innerWidth
    const deltaX = e.touches[0].pageX - touch.touchStartX
    const left = currentView === 'cd' ? 0 : -winWidth
    // 限定偏移范围 0 ~ -winWidth 之间
    const offsetWidth = Math.min(0, Math.max(-winWidth, left + deltaX))
    // 手指偏移相对屏幕宽度的百分比
    touch.percent = Math.abs(offsetWidth / window.innerWidth)
    if (currentView === 'cd') {
      if (touch.percent >= 0.35) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      // 此处比例是一个反比例 注意
      if (touch.percent <= 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }

    middleLStyle.value = {
      opacity: 1 - touch.percent,
      transitionDuration: '0ms'
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: '0ms'
    }
  }

  function onMiddleTouchEnd() {
    let opacity
    let offsetWidth

    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    const duration = 300

    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: 'cubic-bezier(.7, .3, .1, 1)'
    }

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: 'cubic-bezier(.7, .3, .1, 1)'
    }
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
