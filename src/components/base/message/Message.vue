<template>
  <teleport to="body">
    <transition name="slide-down">
      <div class="message" v-show="visible" @click="hide">
        <slot></slot>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: 'Message',
  props: {
    delay: {
      type: Number,
      default: 2000
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'closed'],
  data() {
    return {
      visible: this.modelValue
    }
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        this.show()
      } else {
        this.hide()
      }
    },
    visible(val) {
      this.$emit('update:modelValue', val)
    }
  },
  mounted() {
    if (this.modelValue) {
      this.show()
    }
  },
  methods: {
    show() {
      this.visible = true
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hide()
      }, this.delay)
    },
    hide() {
      clearTimeout(this.timer)
      this.visible = false
      this.timerHide && clearTimeout(this.timerHide)
      this.timerHide = setTimeout(() => {
        this.$emit('closed')
      }, this.delay)
    }
  }
}
</script>

<style scoped lang="scss">
.message {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 400;
  background: $color-dialog-background;

  &.slide-down-enter-active,
  &.slide-down-leave-active {
    transition: all 0.3s;
  }

  &.slide-down-enter-from,
  &.slide-down-leave-to {
    transform: translate3d(0, -100%, 0);
  }
}
</style>
