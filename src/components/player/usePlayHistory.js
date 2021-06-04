import { save, remove, clear } from '@/assets/js/arrayStore'
import { PLAY_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'

export default function useSearchHistory() {
  const store = useStore()
  const maxLen = 100

  function savePlay(song) {
    const songs = save(PLAY_KEY, song, item => item.id === song.id, maxLen)
    store.commit('setPlayHistory', songs)
  }

  return {
    savePlay
  }
}
