<template>
  <div
    ref="rootRef"
    class="suggest"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer" @click="selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li class="suggest-item" v-for="song in songs" :key="song.id" @click="selectSong(song)">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text"> {{ song.singer }}-{{ song.name }} </p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script>
// 在此处尝试使用vue3最新语法 script setup进行开发，发现设置的指令上使用的变量未生效（坑！！！）
import { defineComponent, ref, watch, computed, nextTick } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'
import usePullUpLoad from './usePullUpLoad'

export default defineComponent({
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select-song', 'select-singer'],
  setup(props, { emit }) {
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)

    const loadingText = ref('')
    const noResultText = ref('抱歉，暂无搜索结果')

    const loading = computed(() => {
      return !singer.value && !songs.value.length
    })
    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value
    })

    async function searchFirst() {
      if (!props.query) {
        return
      }
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true

      const res = await search(props.query, page.value, props.showSinger)
      songs.value = await processSongs(res.songs)
      singer.value = res.singer
      hasMore.value = res.hasMore
      await nextTick()
      await makeItScrollable()
    }

    watch(
      () => props.query,
      newQuery => {
        if (!newQuery) {
          return
        }
        searchFirst()
      }
    )

    // 首次请求不希望用户触发上拉加载 且 自动填充一屏数据的时候也不可以触发上拉加载
    // 避免触发多个loading的效果
    const manualLoading = ref(false)
    const preventPullUpload = computed(() => loading.value || manualLoading.value)

    const { isPullUpLoad, rootRef, scroll } = usePullUpLoad(searchMore, preventPullUpload)

    const pullUpLoading = computed(
      () => manualLoading.value || (isPullUpLoad.value && hasMore.value)
    )

    async function searchMore() {
      if (!hasMore.value || !props.query) {
        return
      }
      page.value++
      const res = await search(props.query, page.value, props.showSinger)
      songs.value = songs.value.concat(res.songs)
      songs.value = songs.value.concat(await processSongs(res.songs))
      hasMore.value = res.hasMore
      await nextTick()
      await makeItScrollable()
    }

    // 对不满足一屏的数据做出处理 让数据满足一屏显示
    async function makeItScrollable() {
      // 不可滚动（容器的高度大于内容的高度）
      if (scroll.value.maxScrollY >= -1) {
        manualLoading.value = true
        await searchMore()
        manualLoading.value = false
      }
    }

    function selectSong(song) {
      emit('select-song', song)
    }

    function selectSinger(singer) {
      emit('select-singer', singer)
    }

    return {
      singer,
      songs,
      hasMore,
      page,
      loadingText,
      noResultText,
      loading,
      noResult,
      isPullUpLoad,
      rootRef,
      pullUpLoading,
      selectSinger,
      selectSong
    }
  }
})
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^='icon-'] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
