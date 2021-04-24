import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

export default function useCd() {
  const store = useStore()
  const playing = computed(() => store.state.playing)

  const cdRef = ref(null)
  const cdImageRef = ref(null)

  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })

  /*
    暂停歌曲后 旋转动画的类名将被会移除 当再次播放时 类名再次添加 但是动画开始的位置
    就变成了起始位置 我们需要在暂停的时候 让添加动画的外层容器 选择到刚刚动画结束的位置
    用来解决暂停后再次播放 唱片旋转角度重置的问题
  */
  watch(playing, newPlaying => {
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  function syncTransform(wrapper, inner) {
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform

    // 拼接样式
    wrapper.style.transform =
      wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
  }

  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}
