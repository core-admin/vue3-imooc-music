<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" />
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>

      <div class="bottom">
        <div class="operators">
          <div class="icon i-left">
            <i :class="modeIcon" @click="changeMode"></i>
          </div>
          <div class="icon i-left" :class="disabledCls">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon i-center" :class="disabledCls">
            <i :class="playIcon" @click="togglePlay"></i>
          </div>
          <div class="icon i-right" :class="disabledCls">
            <i class="icon-next" @click="next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-favorite"></i>
          </div>
        </div>
      </div>
    </div>

    <audio ref="audioRef" @pause="pause" @canplay="ready" @error="error"></audio>
  </div>
</template>

<script>
import { defineComponent, computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import useMode from './useMode'
import { PLAY_MODE } from '@/assets/js/constant'

export default defineComponent({
  name: 'player',
  props: ['test'],
  setup() {
    // ------ state ------
    const audioRef = ref(null)
    // 判断歌曲是否缓冲成功 可以播放
    const songReady = ref(false)

    // ------ vuex ------

    const store = useStore()
    // 播放器是否展开
    const fullScreen = computed(() => store.state.fullScreen)
    // 当前歌曲信息
    const currentSong = computed(() => store.getters.currentSong)
    // 播放状态
    const playing = computed(() => store.state.playing)
    // 歌曲索引
    const currentIndex = computed(() => store.state.currentIndex)
    // 播放列表
    const playlist = computed(() => store.state.playlist)

    // ------ hooks ------

    const { modeIcon, playMode, changeMode } = useMode()

    // computed
    const playIcon = computed(() => (playing.value ? 'icon-pause' : 'icon-play'))
    const disabledCls = computed(() => (songReady.value ? '' : 'disable'))

    // ------ watch ------

    watch(currentSong, newSong => {
      if (!newSong.id || !newSong.url) return

      songReady.value = false
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })

    watch(playing, newPlaying => {
      if (!songReady.value) return

      const audioEl = audioRef.value
      newPlaying ? audioEl.play() : audioEl.pause()
    })

    // ------ audio methods ------

    /* 
      监听原生audio控件暂停方法
      （可能存在设备待机 audio暂停播放导致写的程序没被监听到造成vuex数据错乱
    */
    const pause = () => store.commit('setPlayingState', false)

    // audio中存在了歌曲的缓冲数据 可以播放
    const ready = () => {
      if (songReady.value) return
      songReady.value = true
    }

    // 防止歌曲出现错误的情况下 造成所有歌曲都不能切换的问题
    const error = () => (songReady.value = true)

    // ------ methods ------

    const goBack = () => store.commit('setFullScreen', false)

    // 切换播放状态
    const togglePlay = () => {
      if (!songReady.value) return
      store.commit('setPlayingState', !playing.value)
    }

    // 循环播放当前歌曲
    const loop = () => {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
      // store.commit('setPlayingState', true)
    }

    const prev = () => {
      const list = playlist.value

      if (list.length === 0 || !songReady.value) return

      // 列表只有一首歌曲 执行循环播放
      if (list.length === 1) return loop()

      let index = currentIndex.value - 1

      if (index < 0) {
        index = list.length - 1
      }

      if (playMode.value === PLAY_MODE.random) {
        store.dispatch('randomSelectionSong')
      }

      store.commit('setCurrentIndex', index)

      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
    }

    const next = () => {
      const list = playlist.value
      if (list.length === 0 || !songReady.value) return

      if (list.length === 1) return loop()

      let index = currentIndex.value + 1

      if (index === list.length) {
        index = 0
      }

      if (playMode.value === PLAY_MODE.random) {
        store.dispatch('randomSelectionSong')
      }

      store.commit('setCurrentIndex', index)
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
    }

    return {
      // --- state ---
      audioRef,

      // --- vuex ---
      fullScreen,
      currentSong,

      // --- hook state ---
      modeIcon,
      changeMode,

      // --- computed ---
      playIcon,
      disabledCls,

      // --- method ---
      pause,
      ready,
      error,

      goBack,
      togglePlay,
      prev,
      next
    }
  }
})
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
