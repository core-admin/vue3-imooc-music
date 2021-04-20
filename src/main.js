import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from '@/components/base/loading/directive'
import noResultDirective from '@/components/base/no-result/directive'

// 引入全局样式文件
import '@/assets/scss/index.scss'

const app = createApp(App)
app.use(router)
app.use(store)

app.use(lazyPlugin, {
  loading: require('@/assets/images/default.png')
})

app.directive('loading', loadingDirective)
app.directive('no-result', noResultDirective)

app.mount('#app')
