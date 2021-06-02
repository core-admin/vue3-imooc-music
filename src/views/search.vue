<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query" />
    </div>
    <div class="search-content">
      <div class="hot-keys">
        <h1 class="title">热门搜索</h1>
        <ul>
          <li class="item" v-for="item in hotKeys" :key="item.id" @click="addQuery(item.key)">
            <span>{{ item.key }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import SearchInput from '@/components/search/SearchInput'
import Scroll from '@/components/wrapper-scroll'
import { getHotKeys } from '@/service/search'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default defineComponent({
  name: 'Search',
  components: {
    SearchInput,
    Scroll
  },
  setup() {
    const query = ref(null)

    const hotKeys = ref([])

    getHotKeys().then(res => (hotKeys.value = res.hotKeys))

    function addQuery(val) {
      query.value = val
    }

    return {
      query,
      hotKeys,
      addQuery
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
