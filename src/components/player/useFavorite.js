import { useStore } from 'vuex'
import { computed } from 'vue'
import { remove, save } from '@/assets/js/arrayStore'
import { FAVORITE_KEY } from '@/assets/js/constant'

export default function useFavorite() {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  const maxLen = 100

  const getFavoriteIcon = song => {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  const toggleFavorite = song => {
    let list
    const compare = item => item.id === song.id
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare)
    } else {
      list = save(FAVORITE_KEY, song, compare, maxLen)
    }
    store.commit('setFavoriteList', list)
  }

  const isFavorite = song => !!favoriteList.value.find(item => item.id === song.id)

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
