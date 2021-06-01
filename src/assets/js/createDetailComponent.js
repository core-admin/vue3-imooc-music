import { defineComponent } from 'vue'
import MusicList from '@/components/music-list/MusicList'
import storage from 'good-storage'
import { processSongs } from '@/service/song'

export default function createDetailComponent(name, key, fetch) {
  return defineComponent({
    name,
    components: {
      MusicList
    },
    props: {
      data: Object
    },
    data() {
      return {
        songs: [],
        loading: false
      }
    },
    computed: {
      computedData() {
        let ret = null
        const data = this.data
        if (data) {
          ret = data
        } else {
          const cachedData = storage.session.get(key)
          if (cachedData && (cachedData.mid || cachedData.id + '') === this.$route.params.id) {
            ret = cachedData
          }
        }
        return ret
      },
      // 封面图
      pic() {
        const data = this.computedData
        return data && data.pic
      },
      title() {
        const data = this.computedData
        return data && (data.name || data.title)
      }
    },
    async created() {
      const computedData = this.computedData
      if (!computedData) {
        const path = this.$route.matched[0].path
        this.$router.replace(path)
        return
      }
      this.loading = true
      // 歌手对应的歌曲列表信息（ps：返回个歌曲的url是空的）
      const res = await fetch(computedData)
      // 返回处理后的带有歌曲url的歌曲列表
      this.songs = await processSongs(res.songs)
      this.loading = false
    }
  })
}
