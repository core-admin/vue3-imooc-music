import { PLAY_MODE } from '@/assets/js/constant'
import { FAVORITE_KEY, SEARCH_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/arrayStore'

const state = {
  // 顺序播放列表
  sequenceList: [],
  // 播放器真正要播放的列表
  playlist: [],
  // 播放状态
  playing: false,
  // 播放模式（3种）
  playMode: PLAY_MODE.sequence,
  // 当前播放索引
  currentIndex: 0,
  // 播放器状态（全屏/收缩）
  fullScreen: false,
  // 收藏歌曲列表
  favoriteList: load(FAVORITE_KEY),
  searchHistory: load(SEARCH_KEY)
}

export default state
