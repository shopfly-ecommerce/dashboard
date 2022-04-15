export default {
  data() {
    return {
      // A friend
      friend_timer: null,
      friends: [],
      // The order
      orders: [],
      orderParams: {
        page_no: 1,
        page_size: 10,
        no_data: false,
        loading: false
      },
      // Browsing history of products or products of this store
      goodsList: [],
      goodsListParams: {
        page_no: 1,
        page_size: 10,
        no_data: false,
        loading: false
      },
      // Goods being consulted
      askGoods: '',
      // Chat record
      chatHistories: [],
      chatHistoryParams: {
        page_no: 1,
        page_size: 10,
        no_data: false,
        loading: false
      },
      new_message_timer: null
    }
  },
  mounted() {
    this.init()
    this.getFriends()
    this.getGoodsList()
    if (this.goods_id) {
      this.getGoodsDetail()
    }
  },
  methods: {
    async init() {
      if (this.isSeller && !this.receiver_id) return
      this.createSession()
      this.orders = []
      this.orderParams.no_data = false
      this.orderParams.page_no = 1
      this.chatHistories = []
      this.chatHistoryParams.no_data = false
      this.chatHistoryParams.page_no = 1
      this.getOrders()
      await this.getNewMessage()
      this.chatContentScrollTo()
    },
    /**
     * Get a list of friends
     */
    getFriends() {
      clearTimeout(this.friend_timer)
      this.request({
        url: this.apis['im'] + `/${this.type}/im/friends-list`,
        method: 'get',
        loading: false,
        needToken: true
      }).then(res => {
        const currentChat = res.filter(item => item['friends_id'] === this.receiver_id)[0]
        if (currentChat) {
          currentChat.un_read_num = 0
        }
        this.friends = res
      }).finally(() => {
        if (!this.isSeller) return
        this.friend_timer = setTimeout(this.getFriends, 3000)
      })
    },
    /**
     * Get order list
     */
    getOrders() {
      this.orderParams.loading = true
      const params = JSON.parse(JSON.stringify(this.orderParams))
      delete params.no_data
      delete params.loading
      let url = this.isSeller
        ? `${this.apis['seller']}/seller/trade/orders?member_id=${this.receiver_id}`
        : `${this.apis['buyer']}/trade/orders`
      this.request({
        url,
        method: 'get',
        loading: false,
        needToken: true,
        params
      }).then(res => {
        const data = res.data
        if (params.page_no === 1) {
          this.orders = data
        } else {
          this.orders.push(...data)
        }
        this.orderParams.no_data = data.length < params.page_size
      }).finally(() => {
        this.orderParams.loading = false
      })
    },

    /**
     * Create a dialogue
     * @returns {*}
     */
    createSession() {
      let url = this.apis['im'] + `/${this.type}/im/session`
      if (this.receiver_id) {
        url += `/${this.receiver_id}`
      }
      return this.request({
        url,
        method: 'post',
        loading: false,
        needToken: true
      })
    },

    /**
     * Get a list of items
     * If it is on the merchant side, get the list of goods in the store
     * Otherwise, obtain the browsing history of member products
     * b2cNo browsing history, no access
     */
    getGoodsList() {
      if (!this.isSeller) return
      this.goodsListParams.loading = true
      const params = JSON.parse(JSON.stringify(this.goodsListParams))
      delete params.no_data
      delete params.loading
      let url = this.isSeller
        ? `${this.apis['seller']}/seller/goods`
        : `${this.apis['buyer']}/members/history/list-page`
      this.request({
        url,
        method: 'get',
        loading: false,
        needToken: true,
        params
      }).then(res => {
        const data = []
        if (this.isSeller) {
          res.data.forEach(item => data.push({ ...item, goods_img: item.thumbnail }))
        } else {
          res.data.forEach(item => data.push(item))
        }
        if (params.page_no === 1) {
          this.goodsList = data
        } else {
          this.goodsList.push(...data)
        }
        this.goodsListParams.no_data = data.length < params.page_size
      }).finally(() => {
        this.goodsListParams.loading = false
      })
    },

    /**
     * Obtain product details
     */
    getGoodsDetail() {
      if (!this.goods_id) return
      this.request({
        url: this.apis['buyer'] + `/goods/${this.goods_id}`,
        loading: false
      }).then(res => {
        this.askGoods = res
      })
    },

    /**
     * Gets chat logs for loading more
     */
    getChatHistory() {
      this.chatHistoryParams.loading = true
      const params = JSON.parse(JSON.stringify(this.chatHistoryParams))
      if (this.receiver_id) {
        params.receiver_id = this.receiver_id
      }
      delete params.no_data
      delete params.loading
      this.request({
        url: this.apis['im'] + `/${this.type}/im/history`,
        method: 'get',
        loading: false,
        needToken: true,
        params
      }).then(res => {
        const data = res.data
        this.chatHistories.splice(0, 0, ...data)
        this.chatHistoryParams.no_data = data.length < params.page_size
      }).finally(() => {
        this.chatHistoryParams.loading = false
      })
    },

    /**
     * Send a message
     * @param content
     * @param type
     * @returns {Promise<*>}
     */
    async sendMessage(content, type) {
      const data = { content }
      if (this.isSeller && !this.receiver_id) return
      if (this.receiver_id) {
        data.receiver_id = this.receiver_id
      }
      const res = await this.request({
        url: this.apis['im'] + `/${this.type}/im/message/${type}`,
        method: 'post',
        loading: false,
        needToken: true,
        data
      })
      this.chatHistories.push(res)
      this.removeUnreadNum()
      this.chatContentScrollTo()
      return Promise.resolve(res)
    },
    /**
     * Remove unread messages
     * @returns {*}
     */
    removeUnreadNum() {
      let params = {}
      if (this.receiver_id) {
        params.sender_id = this.receiver_id
      }
      return this.request({
        url: this.apis['im'] + `/${this.type}/im/unread-num`,
        method: 'delete',
        loading: false,
        needToken: true,
        params
      })
    },
    /**
     * Get new messages, poll
     * @returns {Promise<void>}
     */
    getNewMessage() {
      clearTimeout(this.new_message_timer)
      return new Promise(resolve => {
        let params = {}
        if (this.receiver_id) {
          params.receiver_id = this.receiver_id
        }
        this.request({
          url: this.apis['im'] + `/${this.type}/im/history`,
          method: 'get',
          loading: false,
          needToken: true,
          params
        }).then(res => {
          let num = 0
          res.data.forEach(item => {
            if (!this.chatHistories.map(_item => _item['msg_id']).includes(item['msg_id'])) {
              this.chatHistories.push(item)
              num++
            }
          })
          const repIndex = this.chatHistories.findIndex(item => !item['msg_id'])
          if (repIndex !== -1) this.chatHistories.splice(repIndex, 1)
          if (num !== 0) {
            const $el = this.$refs['chat-content']
            if ($el.scrollHeight - $el.scrollTop >= $el.offsetHeight + 10) {
              this.new_message_tip = true
            } else {
              this.chatContentScrollTo()
            }
          }
        }).finally(() => {
          this.new_message_timer = setTimeout(this.getNewMessage, 2000)
          resolve()
        })
      })
    },
    /**
     * File upload
     * @param file
     */
    uploadFile(file) {
      return new Promise(resolve => {
        const formData = new FormData()
        formData.append('file', file)
        this.request({
          url: this.apis['base'] + `/uploaders`,
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: formData
        }).then(res => {
          resolve(res)
        })
      })
    }
  }
}
