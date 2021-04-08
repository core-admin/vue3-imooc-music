<template>
  <div class="recommend">
    <Scroll class="recommend-content">
      <!-- scroll 仅会对第一个子元素进行滚动处理 需要包裹起来 -->
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <Slider v-if="sliders.length" :sliders="sliders" />
          </div>
        </div>

        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in albums" class="item" :key="item.id">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.pic" />
              </div>
              <div class="text">
                <h2 class="name">
                  {{ item.username }}
                </h2>
                <p class="title">
                  {{ item.title }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script>
import { getRecommend } from '@/service/recommend'
import Slider from '@/components/base/slider/slider'
import Scroll from '@/components/base/scroll/scroll'

export default {
  name: 'Home',
  components: {
    Slider,
    Scroll
  },
  data() {
    return {
      sliders: [],
      albums: []
    }
  },
  async created() {
    const res = await getRecommend()
    this.sliders = res.sliders
    this.albums = res.albums
  }
}
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
        }
        .name {
          margin-bottom: 10px;
          color: $color-text;
        }
        .title {
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
