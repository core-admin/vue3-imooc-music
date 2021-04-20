import { createRouter, createWebHashHistory } from 'vue-router'

const Recommend = () => import('@/views/Recommend' /* webpackChunkName: "Recommend" */)
const Singer = () => import('@/views/Singer' /* webpackChunkName: "Singer" */)
const TopList = () => import('@/views/TopList' /* webpackChunkName: "TopList" */)
const Search = () => import('@/views/Search' /* webpackChunkName: "Search" */)
const SingerDetail = () => import('@/views/SingerDetail' /* webpackChunkName: "SingerDetail" */)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/top-list',
    component: TopList
  },
  {
    path: '/search',
    component: Search
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
