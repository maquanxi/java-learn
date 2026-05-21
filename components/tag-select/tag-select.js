Component({
  properties: {
    options: { type: Array, value: [] },
    value: { type: Array, value: [] }
  },
  data: { selectedMap: {} },
  observers: {
    value(list) {
      const selectedMap = {}
      ;(list || []).forEach((item) => { selectedMap[item] = true })
      this.setData({ selectedMap })
    }
  },
  methods: {
    toggle(e) {
      const value = e.currentTarget.dataset.value
      const list = this.data.value.slice()
      const index = list.indexOf(value)
      if (index >= 0) list.splice(index, 1)
      else list.push(value)
      this.triggerEvent('change', list)
    }
  }
})
