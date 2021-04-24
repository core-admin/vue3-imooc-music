import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric({ songReady, currentTime }) {
  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  // 歌词解析包实例化数据
  const currentLyric = ref(null)
  // 歌曲播放所在的歌词行数
  const currentLineNum = ref(0)
  // 歌词的包装scroll组件
  const lyricScrollRef = ref(null)
  // 承载每一条歌词dom元素的父元素
  const lyricListRef = ref(null)

  // 存音乐展示的文本
  const pureMusicLyric = ref('')
  // 缩略版歌词 一行展示的
  const playingLyric = ref('')

  function handleLyric({ lineNum, txt }) {
    // 所在行索引
    currentLineNum.value = lineNum
    // 当前所在行的数据
    playingLyric.value = txt

    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value

    if (!listEl) return

    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  // 播放歌词
  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  watch(currentSong, async newSong => {
    if (!newSong.url || !newSong.id) return

    // 切换歌曲的时候 防止自动播放 先暂停
    // 同时 当切换多首歌曲的时候 歌词列表会出现上下横跳问题，就是因为当切换歌曲时会触发playLyric 而此时新的lyric还未被加载进来重新赋值 导致光使用 stopLyric() 进行暂停是没用的 暂停的可能是上一次还没被重新赋值前的lyric对象
    stopLyric()
    // 清理掉 让playLyric方法执行的时候 自动进入非空判断
    currentLyric.value = null
    // 重置数据
    pureMusicLyric.value = ''
    playingLyric.value = ''

    const lyric = await getLyric(newSong)

    // 优化：缓存歌词
    // newSong.lyric = lyric
    // vuex不允许直接修改 因为他是一个对象引用 他改了 vuex中其他用到这个引用的也会做出相应修改 vuex不允许这么做

    store.commit('addSongLyric', { song: newSong, lyric })

    // 当执行完getLyric获取歌词数据后 歌曲可能会发生变化（如：快速切换歌曲）
    // 当切换完毕后 由于getLyric是一个异步过程 返回过来的歌词数据就可能存在于歌曲不匹配的情况
    if (currentSong.value.lyric !== lyric) return

    currentLyric.value = new Lyric(lyric, handleLyric)

    const hasLyric = currentLyric.value.lines.length
    if (hasLyric) {
      if (songReady.value) {
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/^\[(\d{2}):(\d{2}):(\d{2})]/g, '')
    }
  })

  return {
    currentSong,
    currentLyric,
    currentLineNum,
    playLyric,
    stopLyric,
    lyricScrollRef,
    lyricListRef,
    pureMusicLyric,
    playingLyric
  }
}
