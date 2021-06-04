import { createRouter, createWebHashHistory } from 'vue-router'

const Recommend = () => import('@/views/Recommend' /* webpackChunkName: "Recommend" */)
const Singer = () => import('@/views/Singer' /* webpackChunkName: "Singer" */)
const TopList = () => import('@/views/TopList' /* webpackChunkName: "TopList" */)
const Search = () => import('@/views/Search' /* webpackChunkName: "Search" */)
const SingerDetail = () => import('@/views/SingerDetail' /* webpackChunkName: "SingerDetail" */)
const Album = () => import('@/views/Album' /* webpackChunkName: "Album" */)
const TopDetail = () => import('@/views/TopDetail' /* webpackChunkName: "TopDetail" */)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
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
    component: TopList,
    children: [
      {
        path: ':id',
        component: TopDetail
      }
    ]
  },
  {
    path: '/search',
    component: Search,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
