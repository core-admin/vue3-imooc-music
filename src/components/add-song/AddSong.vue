<template>
  <teleport to="body">
    <transition name="slide">
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="hide">
            <i class="icon-close"></i>
          </div>
        </div>
        <div class="search-input-wrapper">
          <search-input v-model="query" placeholder="搜索歌曲"></search-input>
        </div>
        <div v-show="!query">
          <switches :items="['最近播放', '搜索历史']" v-model="currentIndex"></switches>
          <div class="list-wrapper">
            <scroll v-if="currentIndex === 0" class="list-scroll" ref="scrollRef">
              <div class="list-inner">
                <song-list :songs="playHistory" @select="selectSongBySongList" />
              </div>
            </scroll>
            <scroll v-if="currentIndex === 1" class="list-scroll" ref="scrollRef">
              <div class="list-inner">
                <search-list :searches="searchHistory" :show-delete="false" @select="addQuery" />
              </div>
            </scroll>
          </div>
        </div>
        <!-- 搜索结果 -->
        <div class="search-result" v-show="query">
          <suggest :query="query" :show-singer="false" @select-song="selectSongBySuggest">
          </suggest>
        </div>
        <message ref="messageRef" :delay="3000" @closed="messageClosed">
          <div class="message-title">
            <i class="icon-ok"></i>
            <span class="text">{{ messageText }}</span>
          </div>
        </message>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { defineComponent, ref, computed, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import Scroll from '@/components/wrapper-scroll'
import SearchInput from '@/components/search/SearchInput'
import Suggest from '@/components/search/Suggest'
import SearchList from '@/components/base/search-list/SearchList'
import SongList from '@/components/base/song-list/SongList'
import Switches from '@/components/base/switches/Switches'
import Message from '@/components/base/message/Message'
import useSearchHistory from '@/components/search/useSearchHistory'

export default defineComponent({
  name: 'AddSong',
  components: {
    Scroll,
    SearchInput,
    Suggest,
    SearchList,
    SongList,
    Switches,
    Message
  },
  setup() {
    const store = useStore()
    const visible = ref(false)
    const query = ref('')
    const currentIndex = ref(0)
    const scrollRef = ref(null)
    const playHistory = computed(() => store.state.playHistory)
    const searchHistory = computed(() => store.state.searchHistory)

    const messageRef = ref(null)
    const messageVisible = ref(false)
    const addSongList = ref([])
    const messageText = computed(() => addSongList.value.length + '首歌曲已经添加到播放列表')

    function messageClosed() {
      addSongList.value = []
    }

    async function show() {
      visible.value = true
      await nextTick()
      refreshScroll()
    }

    function hide() {
      visible.value = false
    }

    // 最近播放列表点击回调
    function selectSongBySongList({ song }) {
      addSong(song)
      if (!addSongList.value.find(v => v.id === song.id)) {
        addSongList.value.push(song)
      }
      messageRef.value.show()
      // messageVisible.value = true
    }

    function addSong(song) {
      store.dispatch('addSong', song)
    }

    const { saveSearch } = useSearchHistory()
    // 搜索结果 点击回调
    function selectSongBySuggest(song) {
      addSong(song)
      saveSearch(query.value)
    }

    function addQuery(val) {
      query.value = val
    }

    watch(query, async val => {
      if (!val) {
        await nextTick()
        refreshScroll()
      }
    })

    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }

    return {
      visible,
      query,
      currentIndex,
      scrollRef,
      messageRef,
      messageVisible,
      playHistory,
      searchHistory,
      show,
      hide,
      selectSongBySongList,
      selectSongBySuggest,
      addQuery,
      messageClosed,
      messageText
    }
  }
})
</script>

<style lang="scss" scoped>
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background: $color-background;
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
  .search-input-wrapper {
    margin: 20px;
  }
  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}

.message-title {
  text-align: center;
  padding: 18px 0;
  font-size: 0;
  .icon-ok {
    font-size: $font-size-medium;
    color: $color-theme;
    margin-right: 4px;
  }
  .text {
    font-size: $font-size-medium;
    color: $color-text;
  }
}
</style>
