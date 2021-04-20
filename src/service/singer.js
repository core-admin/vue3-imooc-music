import { get } from '@/service/base'

export const getSingerList = () => get('/api/getSingerList')

export const getSingerDetail = singer => get('/api/getSingerDetail', { mid: singer.mid })
