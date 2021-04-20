import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

const createLoadingLikeDirective = Component => {
  const relativeCls = 'g-relative'

  // 通过指令插入的loading需要保证被挂载的元素时一个非static元素（如果是需要添加一个定位属性）
  // 因为loading组件的实现是一个定位元素
  function append(el) {
    const name = Component.name
    const style = getComputedStyle(el)
    if (!['absolute', 'fixed', 'relative'].includes(style.position)) {
      addClass(el, relativeCls)
    }

    el.appendChild(el[name].instance.$el)
  }

  function remove(el) {
    const name = Component.name
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }

  return {
    mounted(el, binding) {
      const app = createApp(Component)
      const instance = app.mount(document.createElement('div'))
      const name = Component.name
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance

      // 使用指定的动态参数来修改title（动态参数用来给指令传参）
      const title = binding.arg
      if (typeof title !== 'undefined') {
        instance.setTitle(title)
      }

      if (binding.value) {
        append(el)
      }
    },
    updated(el, binding) {
      const name = Component.name
      const title = binding.arg
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }

      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }
}

export default createLoadingLikeDirective
