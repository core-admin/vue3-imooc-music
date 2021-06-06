import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from '@/components/base/loading/directive'
import noResultDirective from '@/components/base/no-result/directive'

// 引入全局样式文件
import '@/assets/scss/index.scss'

import { load, saveAll } from '@/assets/js/arrayStore'
import { FAVORITE_KEY, PLAY_KEY } from '@/assets/js/constant'
import { processSongs } from '@/service/song'

// 由于歌曲的播放地址会有过期问题 所以每次进入应用的时候 通过请求接口的方式刷新本地缓存数据歌曲的最新播放地址
const favoriteSongs = load(FAVORITE_KEY)
if (favoriteSongs.length > 0) {
  processSongs(favoriteSongs).then(songs => {
    store.commit('setFavoriteList', songs)
    saveAll(FAVORITE_KEY, songs)
  })
}

const historySongs = load(PLAY_KEY)
if (historySongs.length > 0) {
  processSongs(favoriteSongs).then(songs => {
    store.commit('setPlayHistory', songs)
    saveAll(PLAY_KEY, songs)
  })
}

const app = createApp(App)
app.use(router)
app.use(store)

app.use(lazyPlugin, {
  loading: require('@/assets/images/default.png')
})

app.directive('loading', loadingDirective)
app.directive('no-result', noResultDirective)

app.mount('#app')
