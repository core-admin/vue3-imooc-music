<template>
  <teleport to="body">
    <transition name="list-fade">
      <div class="playlist" v-show="visible && playlist.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click="changeMode"></i>
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <scroll ref="scrollRef" class="list-content">
            <transition-group ref="listRef" name="list" tag="ul">
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click="selectItem(song)"
              >
                <i class="current" :class="getCurrentIcon(song)"></i>
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click.stop="toggleFavorite">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span class="delete" @click.stop="removeSong(song)" :class="{ disable: removing }">
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-add">
            <div class="add" @click="showAddSong">
              <i class="icon-add"></i>
              <span class="text">添加歌曲到队列</span>
            </div>
          </div>
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
        </div>

        <add-song ref="addSongRef"></add-song>
      </div>
    </transition>
  </teleport>

  <Confirm
    ref="confirmRef"
    text="是否清空播放列表"
    confirm-btn-text="清空"
    @confirm="confirmClear"
  />
</template>

<script>
import Scroll from '@/components/base/scroll/scroll'
import Confirm from '@/components/base/confirm/Confirm'

import { defineComponent, ref, computed, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import useMode from './useMode'
import useFavorite from './useFavorite'
import AddSong from '@/components/add-song/AddSong'

export default defineComponent({
  name: 'Playlist',
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  setup() {
    const store = useStore()
    const visible = ref(false)
    const playlist = computed(() => store.state.playlist)
    const sequenceList = computed(() => store.state.sequenceList)
    const currentSong = computed(() => store.getters.currentSong)

    const { modeIcon, modeText, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    function getCurrentIcon(song) {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }

    function hide() {
      visible.value = false
    }

    function show() {
      visible.value = true
      nextTick(() => {
        refreshScroll()
        scrollToCurrent()
      })
    }

    const scrollRef = ref(null)

    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }

    const listRef = ref(null)

    function scrollToCurrent() {
      const index = sequenceList.value.findIndex(song => song.id === currentSong.value.id)
      if (index === -1) return
      const target = listRef.value.$el.children[index]
      scrollRef.value.scroll.scrollToElement(target, 300)
    }

    function selectItem(song) {
      const index = playlist.value.findIndex(v => song.id === v.id)
      store.commit('setCurrentIndex', index)
      store.commit('setPlayingState', true)
    }

    watch(currentSong, async newSong => {
      if (!visible.value || !newSong.id) {
        return
      }
      await nextTick()
      scrollToCurrent()
    })

    const removing = ref(false)

    function removeSong(song) {
      if (removing.value) {
        return
      }
      removing.value = true
      store.dispatch('removeSong', song)
      // 等待删除动画结束后 删除按钮才能再次点击
      if (playlist.value.length === 0) {
        hide()
      }
      setTimeout(() => (removing.value = false), 300)
    }

    const confirmRef = ref(null)

    function showConfirm() {
      confirmRef.value.show()
    }

    function confirmClear() {
      hide()
      store.dispatch('clearSongList')
    }

    const addSongRef = ref(null)
    function showAddSong() {
      addSongRef.value.show()
    }

    return {
      visible,
      playlist,
      sequenceList,
      currentSong,
      modeIcon,
      modeText,
      changeMode,
      getFavoriteIcon,
      toggleFavorite,
      getCurrentIcon,
      hide,
      show,
      scrollRef,
      listRef,
      selectItem,
      removing,
      removeSong,
      confirmRef,
      showConfirm,
      confirmClear,
      addSongRef,
      showAddSong
    }
  }
})
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;

  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .clear {
          @include extend-click();

          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }

        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;

          .icon-favorite {
            color: $color-sub-theme;
          }
        }

        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }

    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }

        .text {
          font-size: $font-size-small;
        }
      }
    }

    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
