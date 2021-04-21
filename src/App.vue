<template>
  <m-header></m-header>
  <Tab />
  <router-view />
  <player />
</template>

<script>
import MHeader from '@/components/header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'

export default {
  name: 'App',
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style lang="scss"></style>
