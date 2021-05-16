import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated
} from 'vue'

import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

export default function useMiniSlider() {
  const sliderWrapperRef = ref(null)
  const slider = ref(null)

  const store = useStore()
  const fullScreen = computed(() => store.state.fullScreen)
  const playlist = computed(() => store.state.playlist)
  const currentIndex = computed(() => store.state.currentIndex)

  const sliderShow = computed(() => !!playlist.value && !fullScreen.value)

  onMounted(() => {
    // dom渲染完毕后 且 播放器状态为mini版时才进行slider初始化
    // 且仅初始化一次
    let sliderVal
    watch(sliderShow, async newSliderShow => {
      if (newSliderShow) {
        await nextTick()
        // 防止watch多次执行 造成多次初始化操作
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })

          sliderVal.on('slidePageChanged', ({ pageX }) => {
            store.commit('setCurrentIndex', pageX)
            // 问题记录 当在播放列表中删除正在播放歌曲的前面歌曲时 会触发这个回调
            // 导致当歌曲暂停时 删除前面的歌曲歌曲状态改成了自动播放
            // store.commit('setPlayingState', true)
          })
        } else {
          sliderVal.refresh()
        }
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    watch(currentIndex, newIndex => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })

    // 当歌曲列表中歌曲删除时 slider需要重新刷新一遍 因为歌曲列表中的数据删除了
    // slider中还会存在没删除歌曲之前的dom
    watch(playlist, async newList => {
      // 歌曲列表清空后 不需要刷新
      if (sliderVal && sliderShow.value && newList.length) {
        // 数据的变化到dom的变化时存在一个时间的 需要等待数据响应到dom上
        await nextTick()
        sliderVal.refresh()
      }
    })
  })

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })

  return {
    slider,
    sliderWrapperRef
  }
}
