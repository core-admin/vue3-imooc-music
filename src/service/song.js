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

// song可能是在歌手列表中创建的或者歌单列表中创建的
// 所以song这个对象会存在不同的情况 但是对应的mid是相同的 歌曲也是相同的
const lyricMap = {}

export const getLyric = song => {
  if (song.lyric) return Promise.resolve(song.lyric)

  const mid = song.mid
  const lyric = lyricMap[mid]

  if (lyric) return Promise.resolve(lyric)

  return get('/api/getLyric', { mid }).then(result => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[mid] = lyric
    return lyric
  })
}
