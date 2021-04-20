import { get } from './base'

export const processSongs = songs => {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', { mid: songs.map(song => song.mid) }).then(res => {
    // 以歌曲的 mid 为 key，存储歌曲 URL
    const map = res.map

    return songs
      .map(song => ({
        ...song,
        url: map[song.mid]
      }))
      .filter(song => song.url.indexOf('vkey') > -1) // 只有url中包含vkey的才代表当前歌曲是一个可播放的
  })
}
