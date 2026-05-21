Component({
  properties: {
    loading: {
      type: Boolean,
      value: false
    },
    text: {
      type: String,
      value: '加载中...'
    },
    skeleton: {
      type: Boolean,
      value: false
    },
    skeletonCount: {
      type: Number,
      value: 3
    },
    showAvatar: {
      type: Boolean,
      value: true
    }
  }
})
