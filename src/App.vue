<template>
  <m-header></m-header>
  <Tab />
  <router-view />
</template>

<script>
import MHeader from '@/components/header/header'
import Tab from '@/components/tab/tab'

export default {
  name: 'App',
  components: {
    MHeader,
    Tab
  }
}
</script>

<style lang="scss"></style>
