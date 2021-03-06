import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

// 正常播放
export const selectPlay = ({ commit }, { list, index }) => {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlaylist', list)
  commit('setPlayingState', true)
  commit('setCurrentIndex', index)
  commit('setFullScreen', true)
}

// 随机播放
export const randomPlay = ({ commit }, list) => {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlaylist', shuffle(list))
  commit('setPlayingState', true)
  commit('setCurrentIndex', 0)
  commit('setFullScreen', true)
}

// 播放顺序发生改变
export const changeMode = ({ state, getters, commit }, mode) => {
  // 处理切换播放模式到随机模式时 由于列表切换(索引并未变)导致的歌曲也会切换
  const currentId = getters.currentSong.id

  // 切换到随机播放
  if (mode === PLAY_MODE.random) {
    commit('setPlaylist', shuffle(state.sequenceList))
  } else {
    commit('setPlaylist', state.sequenceList)
  }
  const index = state.playlist.findIndex(song => song.id === currentId)
  commit('setCurrentIndex', index)

  commit('setPlayMode', mode)
}

// 当处于随机播放时 切换歌曲 也是随机的
// 不按照随机列表中的歌曲进行上下切换 而是随机切换
// # 网易云的随机播放是随机切换下标 歌曲列表是固定的顺序
export const randomSelectionSong = ({ state, commit }) => {
  commit('setPlaylist', shuffle(state.sequenceList))
}

const findIndex = (list, song) => {
  return list.findIndex(item => item.id === song.id)
}

export const removeSong = ({ commit, state }, song) => {
  const sequenceList = state.sequenceList.slice()
  const playlist = state.playlist.slice()

  const seqIndex = findIndex(sequenceList, song)
  const playIndex = findIndex(playlist, song)
  if (playIndex < 0) {
    return
  }

  sequenceList.splice(seqIndex, 1)
  playlist.splice(playIndex, 1)

  let currentIndex = state.currentIndex
  if (playIndex < currentIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit('setSequenceList', sequenceList)
  commit('setPlaylist', playlist)
  commit('setCurrentIndex', currentIndex)
  if (playlist.length === 0) {
    commit('setPlayingState', false)
  }
}

export const clearSongList = ({ commit }) => {
  commit('setSequenceList', [])
  commit('setPlaylist', [])
  commit('setCurrentIndex', 0)
  commit('setPlayingState', false)
}

export const addSong = ({ commit, state }, song) => {
  const playlist = state.playlist.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  const playIndex = findIndex(playlist, song)

  // 如果播放列表中存在要添加个歌曲
  if (playIndex > -1) {
    currentIndex = playIndex
  } else {
    playlist.push(song)
    // 指向最后一首歌（要播放）
    currentIndex = playlist.length - 1
  }
  const sequenceIndex = findIndex(sequenceList, song)
  if (sequenceIndex === -1) {
    sequenceList.push(song)
  }
  commit('setSequenceList', sequenceList)
  commit('setPlaylist', playlist)
  commit('setCurrentIndex', currentIndex)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
}
