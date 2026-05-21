Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    extra: {
      type: String,
      value: ''
    },
    showFooter: {
      type: Boolean,
      value: false
    },
    customClass: {
      type: String,
      value: ''
    },
    clickable: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onTap() {
      if (this.properties.clickable) {
        this.triggerEvent('tap', {})
      }
    }
  }
})
