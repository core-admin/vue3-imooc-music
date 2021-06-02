import { get } from './base'

export const getHotKeys = () => get('/api/getHotKeys')

export const search = (query, page, showSinger) =>
  get('/api/search', {
    query,
    page,
    showSinger
  })
