import { get } from './base'

export const getTopList = () => {
  return get('/api/getTopList')
}

export const getTopDetail = top => {
  return get('/api/getTopDetail', {
    id: top.id,
    period: top.period
  })
}
