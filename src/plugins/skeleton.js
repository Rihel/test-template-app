// 简陋骨架屏

import Vue from 'vue'
import Skeleton from '@/components/skeleton.vue'
const Mask = Vue.extend(Skeleton)

Vue.directive('skeleton', {
  inserted: function(el, {value}) {
    const mask = new Mask({
      el: document.createElement('div')
    })

    el.instance = mask
    el.mask = mask.$el
    mask.$data.visible = value

    for (let i = 0; i < el.children.length; i++) {
      el.children[i].classList.add('skeleton-none')
    }

    el.appendChild(mask.$el)
  },
  update: function(el, {value}) {
    if (el.instance.$data.visible === value) return
    el.instance.$data.visible = value
    for (let i = 0; i < el.children.length; i++) {
      el.children[i].classList.remove('skeleton-none')
    }

    el.removeChild(el.mask)
  }
})
