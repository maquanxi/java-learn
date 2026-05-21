Component({
  properties: {
    item: { type: Object, value: {} }
  },
  methods: {
    onFavorite() {
      this.triggerEvent('favorite', this.data.item)
    }
  }
})
