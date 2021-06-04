import { save, remove, clear } from '@/assets/js/arrayStore'
import { SEARCH_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'

export default function useSearchHistory() {
  const store = useStore()
  const maxLen = 30

  function saveSearch(query) {
    const searches = save(SEARCH_KEY, query, item => item === query, maxLen)
    store.commit('setSearchHistory', searches)
  }

  function deleteSearch(query) {
    const searches = remove(SEARCH_KEY, item => item === query)
    store.commit('setSearchHistory', searches)
  }

  function clearSearch() {
    const searches = clear(SEARCH_KEY)
    store.commit('setSearchHistory', searches)
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch
  }
}
