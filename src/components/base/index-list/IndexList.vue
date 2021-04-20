<template>
  <Srcoll class="index-list" ref="scrollRef" :probe-type="3" @scroll="onScroll">
    <ul ref="groupRef">
      <li class="group" v-for="group in data" :key="group.title">
        <h2 class="title">{{ group.title }}</h2>
        <ul>
          <li class="item" v-for="item in group.list" :key="item.id" @click="onItemClick(item)">
            <img class="avatar" v-lazy="item.pic" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>

    <!-- 固定的且会偏移的标题 -->
    <div class="fixed" v-show="fixedTitle" :style="fixedStyle">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>

    <!-- 右侧导航 -->
    <div
      v-if="shortcutList.length"
      class="shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop.prevent
    >
      <ul>
        <li
          class="item"
          :class="{ current: index === currentIndex }"
          :key="item"
          :data-index="index"
          v-for="(item, index) in shortcutList"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </Srcoll>
</template>

<script>
import Srcoll from '@/components/base/scroll/scroll'
import { defineComponent } from 'vue'
import useFixed from './useFixed'
import useShortcut from './useShortcut'

export default defineComponent({
  name: 'IndexList',
  components: {
    Srcoll
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  emits: ['select'],
  setup(props, { emit }) {
    const { groupRef, currentIndex, fixedTitle, fixedStyle, onScroll } = useFixed(props)

    const { shortcutList, scrollRef, onShortcutTouchStart, onShortcutTouchMove } = useShortcut(
      props,
      groupRef
    )

    const onItemClick = item => emit('select', item)

    return {
      groupRef,
      currentIndex,
      fixedTitle,
      fixedStyle,
      onScroll,

      shortcutList,
      scrollRef,
      onShortcutTouchStart,
      onShortcutTouchMove,

      onItemClick
    }
  }
})
</script>

<style lang="scss" scoped>
.index-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: $color-background;
  .group {
    padding-bottom: 30px;
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background-color: $color-highlight-background;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background-color: $color-highlight-background;
    }
  }

  .shortcut {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 22px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background-color: $color-background-d;
    font-family: Helvetica; // 英文字体推荐使用
    .item {
      padding: 4px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        color: $color-theme;
      }
    }
  }
}
</style>
