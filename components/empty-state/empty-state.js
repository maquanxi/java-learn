Component({
  properties: {
    icon: {
      type: String,
      value: '📋'
    },
    title: {
      type: String,
      value: '暂无数据'
    },
    description: {
      type: String,
      value: ''
    },
    showAction: {
      type: Boolean,
      value: false
    },
    actionText: {
      type: String,
      value: '去操作'
    },
    actionType: {
      type: String,
      value: 'primary' // primary | ghost
    }
  },

  methods: {
    onAction() {
      this.triggerEvent('action', {})
    }
  }
})
