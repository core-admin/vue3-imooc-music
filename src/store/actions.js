import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

// 正常播放
export const selectPlay = ({ commit }, { list, index }) => {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlaylist', list)
  commit('setPlayingState', true)
  commit('setPlayMode', true)
  commit('setCurrentIndex', index)
  commit('setFullScreen', true)
}

// 随机播放
export const randomPlay = ({ commit }, list) => {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlaylist', shuffle(list))
  commit('setPlayingState', true)
  commit('setPlayMode', true)
  commit('setCurrentIndex', 0)
  commit('setFullScreen', true)
}
