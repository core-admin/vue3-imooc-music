<template>
  <m-header></m-header>
  <Tab />
  <router-view :style="viewStyle" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>

  <router-view :style="viewStyle" name="user" v-slot="{ Component }">
    <transition appear name="slide">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
  <player />
</template>

<script>
import MHeader from '@/components/header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/Player'
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    MHeader,
    Tab,
    Player
  },
  computed: {
    ...mapState(['playlist']),
    viewStyle() {
      const bottom = this.playlist.length ? '60px' : 0
      return { bottom }
    }
  }
}
</script>

<style lang="scss"></style>
