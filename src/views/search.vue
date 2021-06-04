<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query" />
    </div>
    <scroll class="search-content" ref="scrollRef" v-show="!query">
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="item in hotKeys" :key="item.id" @click="addQuery(item.key)">
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteSearch"
          ></search-list>
        </div>
      </div>
    </scroll>

    <div class="search-result" v-show="query">
      <suggest :query="query" @select-song="selectSong" @select-singer="selectSinger" />
    </div>

    <router-view v-slot="{ Component }">
      <transition name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>

    <confirm
      ref="confirmRef"
      text="是否清空所有搜索历史"
      confirm-btn-text="清空"
      @confirm="clearSearch"
    >
    </confirm>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, nextTick } from 'vue'
import SearchInput from '@/components/search/SearchInput'
import Scroll from '@/components/wrapper-scroll'
import Suggest from '@/components/search/Suggest'
import SearchList from '@/components/base/search-list/SearchList'
import { getHotKeys } from '@/service/search'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
import useSearchHistory from '@/components/search/useSearchHistory'
import Confirm from '@/components/base/confirm/Confirm'

export default defineComponent({
  name: 'Search',
  components: {
    SearchInput,
    Scroll,
    Suggest,
    SearchList,
    Confirm
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    const query = ref(null)
    const hotKeys = ref([])
    const selectedSinger = ref(null)
    const { saveSearch, deleteSearch, clearSearch } = useSearchHistory()
    const searchHistory = computed(() => store.state.searchHistory)

    getHotKeys().then(res => (hotKeys.value = res.hotKeys))

    function addQuery(val) {
      query.value = val
    }

    function selectSong(song) {
      saveSearch(query.value)
      store.dispatch('addSong', song)
    }

    function selectSinger(singer) {
      saveSearch(query.value)
      selectedSinger.value = singer
      cacheSinger(singer)
      router.push(`/search/${singer.mid}`)
    }

    function cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }

    const confirmRef = ref(null)

    function showConfirm() {
      confirmRef.value.show()
    }

    const scrollRef = ref(null)
    watch(query, async query => {
      if (!query) {
        await nextTick()
        refreshScroll()
      }
    })

    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }

    return {
      query,
      hotKeys,
      selectedSinger,
      addQuery,
      selectSong,
      selectSinger,
      searchHistory,
      deleteSearch,
      clearSearch,
      confirmRef,
      showConfirm,
      scrollRef
    }
  }
})
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
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
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
