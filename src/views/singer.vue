<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :data="singers" @select="selectSinger" />

    <router-view v-slot="{ Component }">
      <transition name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/index-list/IndexList'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default defineComponent({
  name: 'singer',
  components: {
    IndexList
  },
  data() {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  async created() {
    const { singers } = await getSingerList()
    this.singers = singers
  },
  methods: {
    selectSinger(singer) {
      this.selectedSinger = singer
      this.cacheSinger(singer)
      this.$router.push(`/singer/${singer.mid}`)
    },
    cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }
  }
})
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
