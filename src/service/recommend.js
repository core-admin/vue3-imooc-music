import { get } from '@/service/base'

export const getRecommend = () => {
  return get('/api/getRecommend')
}
