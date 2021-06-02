<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input class="input-inner" :placeholder="placeholder" v-model="query" />
    <i v-show="query" class="icon-dismiss" @click="query = ''"></i>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { debounce } from 'throttle-debounce'

export default defineComponent({
  name: 'SearchInput',
  props: {
    modelValue: String,
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      query: this.modelValue
    }
  },
  created() {
    this.$watch(
      'query',
      debounce(300, newQuery => {
        this.$emit('update:modelValue', newQuery.trim())
      })
    )

    this.$watch('modelValue', val => (this.query = val))
  }
})
</script>

<style lang="scss" scoped>
.search-input {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 32px;
  background: $color-highlight-background;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: $color-text-d;
  }
  .input-inner {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: $color-text-d;
  }
}
</style>
