<template>
  <div class="chat-app" @click="dismissAnyShow">
    <div class="chat-container">
      <div v-if="isSeller" class="left-chat">
        <div class="user-info">
          <div class="face-user">
            <div v-if="user.face" class="img-face-user" :style="{backgroundImage: `url(${user.face})`}"></div>
            <div class="info-user">
              <div class="name-user ellipsis">{{ user.name }}</div>
            </div>
          </div>
          <div class="search-user">
            <input v-model="search_keyword" placeholder="Searching for Recent Contacts" class="search-input-user">
          </div>
        </div>
        <div class="friend-list">
          <div
            v-for="item in showFriends"
            :key="item['friends_id']"
            class="friend-item"
            :class="{active: receiver_id === item['friends_id']}"
            @click="handleClickFriend(item)"
          >
            <div class="face-friend" :style="{backgroundImage: `url(${item.face})`}"></div>
            <div class="name-friend ellipsis">{{ item.name }}</div>
            <div v-if="item['un_read_num'] > 0" class="unread-friend">{{ item['un_read_num'] }}</div>
          </div>
        </div>
      </div>
      <div class="right-chat">
        <div class="head-right">
          <div v-if="currentChat" class="wrapper-head">
            <div class="face-head" :style="{backgroundImage: `url(${currentChat.face})`}"></div>
            <div class="info-head">
              <p class="name-info-head">
                {{ currentChat.name }}
              </p>
              <p class="desc-info-head"></p>
            </div>
          </div>
        </div>
        <div class="body-right">
          <div class="chat-right">
            <div ref="chat-content" class="list-chat">
              <div v-if="chatHistoryParams.loading" class="load-more no-data">Loading data...</div>
              <div v-else-if="currentChat || !isSeller" class="load-more" :class="{'no-data': chatHistoryParams.no_data}" @click="handleLoadMoreHistory">
                {{ chatHistoryParams.no_data ? 'There is no chat history' : 'Click to load more' }}
              </div>
              <div v-else class="load-more no-data">Please select a dialogue on the left</div>
              <chat-message-item
                v-for="(item, index) in chatHistories"
                :key="index"
                :message="item"
                :sender="user"
                :receiver="currentChat"
                :get-emoji-path="getEmojiPath"
                :click-message="handleClickMessage"
                :unix-to-date="unixToDate"
                :preview-image="handlePreviewImage"
              />
            </div>
            <div v-if="new_message_tip" class="scroll-tip" @click="chatContentScrollTo">
              <i class="scroll-tip-icon"></i>
              <span>There is new information</span>
            </div>
            <div class="input-chat">
              <div class="toolbar-input-chat">
                <div class="btn-toolbar emoji" @click.stop="show_emoji_box = true"></div>
                <div class="btn-toolbar image" @click="handleClickTool('image')">
                  <input
                    type="file"
                    id="image-upload-input"
                    class="btn-toolbar-input"
                    accept="image/jpg,image/jpeg,image/png,image/webp,image/bmp,image/gif"
                    @change="handleToolbarFileChange"
                  >
                </div>
                <div class="btn-toolbar video" @click="handleClickTool('video')">
                  <input
                    type="file"
                    id="video-upload-input"
                    class="btn-toolbar-input"
                    accept="video/mp4,video/flv"
                    @change="handleToolbarFileChange"
                  >
                </div>
              </div>
              <div class="textarea-chat" @keydown.enter="handleSendContent">
                <p id="textarea-input" contenteditable="true" class="textarea-input"></p>
              </div>
              <div class="send-chat">
                <div class="send-btn">
                  <div class="btn-send" @click="handleSendContent(1)">send</div>
                  <i class="send-btn-arrow" @click.stop="show_enter_key_picker = true"></i>
                  <ul v-show="show_enter_key_picker" class="send-keys">
                    <li class="send-key" :class="{active: enter_key === 1}" @click="enter_key = 1">According to theEntersend</li>
                    <li class="send-key" :class="{active: enter_key === 2}" @click="enter_key = 2">According to theCtrl+Entersend</li>
                  </ul>
                </div>
              </div>
              <div class="emoji-chat">
                <chat-app-emoji v-show="show_emoji_box" @select="handleEmojiSelect" />
              </div>
            </div>
          </div>
          <div class="actions-right">
            <div class="tabs-actions">
              <div v-if="currentAskGoods || isSeller" class="tab-actions ellipsis" :class="{active: current_tab === 0}" @click="current_tab = 0">
                {{ currentAskGoods ? 'Is consulting' : (isSeller ? 'Shop goods' : 'Browsing history') }}
              </div>
              <div class="tab-actions ellipsis" :class="{active: current_tab === 1}" @click="current_tab = 1">
                {{ isSeller ? 'Member of the order' : 'Orders' }}
              </div>
            </div>
            <div class="content-actions">
              <div v-show="current_tab === 0" class="history-actions">
                <div v-if="currentAskGoods" class="history-goods">
                  <a :href="`/goods/${currentAskGoods['goods_id']}`" target="_blank" class="history-goods-link">
                    <img :src="currentAskGoods['thumbnail']" alt="" class="history-goods-image">
                    <span class="history-goods-name">{{ currentAskGoods['goods_name'] }}</span>
                  </a>
                  <div class="send-btn" @click="sendMessage(currentAskGoods['goods_id'], 'GOODS')">send</div>
                </div>
                <div v-if="currentAskGoods" class="tab-actions active">Browsing history</div>
                <div v-for="item in goodsList" :key="item['goods_id']" class="history-goods">
                  <a :href="`${domains['buyer_pc']}/goods/${item['goods_id']}`" target="_blank" class="history-goods-link">
                    <img :src="item['goods_img']" alt="" class="history-goods-image">
                    <span class="history-goods-name">{{ item['goods_name'] }}</span>
                  </a>
                  <div class="send-btn" @click="sendMessage(item['goods_id'], 'GOODS')">send</div>
                </div>
                <div
                  class="tip-load-more"
                  :class="{disabled: goodsListParams.loading || goodsListParams.no_data}"
                  @click="handleLoadMoreGoods"
                >
                  <span v-if="goodsListParams.loading">In the load...</span>
                  <span v-else-if="goodsListParams.no_data">No more...</span>
                  <span v-else>To load more</span>
                </div>
              </div>
              <div v-show="current_tab === 1" class="orders-actions">
                <div v-for="item in orders" :key="item['order_id']" class="item-order">
                  <div class="title-order">
                    <span class="id-order">The order number：{{ item.sn }}</span>
                    <span class="status-order send-btn" @click="sendMessage(item['sn'], 'ORDER')">send</span>
                  </div>
                  <ul class="products-order" @click="handleClickOrder(item)">
                    <li v-for="sku in item.sku_list" :key="sku['sku_id']" class="item-products">
                      <div class="image-product">
                        <img :src="sku['goods_image']" alt="" class="img-product">
                      </div>
                      <div class="info-product">
                        <p :title="sku['name']" class="name-product">{{ sku['name'] }}</p>
                        <div class="status-order">{{ item['order_status_text'] }}</div>
                      </div>
                    </li>
                  </ul>
                  <div class="other-order">
                    <p class="price-order">
                      <span>Amount：</span>
                      <span class="price">￥{{ item['order_amount'] }}</span>
                    </p>
                    <div>
                      <span class="date-order">{{ unixToDate(item.create_time) }}</span>
                    </div>
                  </div>
                </div>
                <div
                  class="tip-load-more"
                  :class="{disabled: orderParams.loading || orderParams.no_data || (isSeller && !receiver_id)}"
                  @click="handleLoadMoreOrder"
                >
                  <span v-if="orderParams.loading">In the load...</span>
                  <span v-else-if="orderParams.no_data">No more...</span>
                  <span v-else>{{ (!isSeller || receiver_id) ? 'To load more' : 'Please select a dialogue on the left' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <viewer ref="viewer" :images="viewerImages" style="display: none">
      <img v-for="src in viewerImages" :src="src" :key="src" alt="" />
    </viewer>
  </div>
</template>

<script>
import apiMixin from './apiMixin'
import emojiMixin from './emojiMixin'
import ChatAppEmoji from './ChatAppEmoji'
import ChatMessageItem from './ChatMessageItem'
import { MessageBox } from 'element-ui'

export default {
  name: 'ChatApp',
  components: { ChatAppEmoji, ChatMessageItem },
  props: {
    user: {
      type: Object,
      required: true
    },
    apis: {
      type: Object,
      required: true
    },
    domains: {
      type: Object,
      required: true
    },
    request: {
      type: Function,
      required: true
    },
    // Chat type
    type: {
      type: String,
      required: true
    }
  },
  mixins: [apiMixin, emojiMixin],
  data() {
    return {
      receiver_id: '',
      goods_id: '',
      search_keyword: '',
      current_chat: '',
      current_tab: 0,
      show_emoji_box: false,
      show_enter_key_picker: false,
      enter_key: 1,
      new_message_tip: false,
      show_resource_picker: false,
      resource_picker_type: 'image',
      viewerImages: []
    }
  },
  computed: {
    // Who you are Chatting with
    currentChat() {
      if (!this.isSeller) {
        const { site } = this.$store.getters
        return {
          face: site.logo,
          name: site.site_name
        }
      }
      const friend = this.friends.filter(item => item['friends_id'] === this.receiver_id)[0]
      return friend || ''
    },
    // Goods being consulted
    currentAskGoods() {
      return this.askGoods
    },
    // Input box node
    contentEl() {
      return document.getElementById('textarea-input')
    },
    // List of friends shown [filtered by search keyword]
    showFriends() {
      const { search_keyword, friends } = this
      if (!search_keyword.trim()) return friends
      return friends.filter(item => item.name.indexOf(search_keyword) !== -1)
    },
    // Whether it is the merchant end
    isSeller() {
      return this.type === 'seller'
    }
  },
  created() {
    const { shop_id, goods_id } = this.$route.query
    this.receiver_id = shop_id
    this.goods_id = goods_id
  },
  mounted() {
    if (!document) return
    if (!this.isSeller) this.current_tab = 1
    this.$refs['chat-content'].addEventListener('scroll', this.chatBoxScrollListener)
    this.initPasteScreenshot()
  },
  methods: {
    /**
     * Choose a friend
     * @param item
     */
    handleClickFriend(item) {
      this.receiver_id = item['friends_id']
      this.current_tab = 0
      this.removeUnreadNum()
      this.currentChat.un_read_num = 0
      this.init()
      this.chatContentScrollTo()
    },
    /**
     * Send a message
     */
    handleSendContent(event) {
      if (this.isSeller && !this.receiver_id) return
      if (event !== 1) {
        if (this.enter_key === 1) {
          event.preventDefault()
        } else {
          if (!event.ctrlKey) return
        }
      }

      if (!this.contentEl.innerHTML.trim()) return
      const emojiEls = this.contentEl.querySelectorAll('.emoji-img')
      emojiEls.forEach(item => (item.src = ''))
      const content = this.contentEl.innerHTML
      this.sendMessage(content.trim(), 'TEXT')
      this.$nextTick(() => {
        this.contentEl.innerHTML = ''
      })
    },
    /**
     * chooseemoji
     * @param item
     */
    handleEmojiSelect(item) {
      this.contentEl.innerHTML += `<img src="${this.getEmojiPath(item)}" alt="${item}" class="emoji-img">`
      this.show_emoji_box = false
    },
    /**
     * Hide all boxes
     */
    dismissAnyShow() {
      this.show_emoji_box = false
      this.show_enter_key_picker = false
    },
    /**
     * The chat window scrolls to the bottom
     */
    chatContentScrollTo(offset) {
      this.$nextTick(() => {
        const $content = this.$refs['chat-content']
        $content.scrollTop = typeof offset !== 'number' ? $content.scrollHeight : offset
        this.new_message_tip = false
      })
    },
    /**
     * Load more chats
     */
    async handleLoadMoreHistory() {
      if (this.chatHistoryParams.loading || this.chatHistoryParams.no_data) return
      this.chatHistoryParams.page_no += 1
      this.getChatHistory()
    },
    /**
     * Chat area scroll monitor
     * @param event
     */
    chatBoxScrollListener(event) {
      const $el = event.target
      if ($el.scrollHeight - $el.scrollTop === $el.offsetHeight) {
        this.new_message_tip = false
      }
    },
    /**
     * Select picture or video
     * @param type
     */
    handleClickTool(type) {
      if (this.isSeller && !this.receiver_id) return
      document.getElementById(`${type}-upload-input`).click()
      // if (this.isSeller) {
      //   this.resource_picker_type = type
      //   this.show_resource_picker = true
      // } else {
      //   document.getElementById(`${type}-upload-input`).click()
      // }
    },
    /**
     * File changes
     * @param event
     */
    async handleToolbarFileChange(event) {
      const { files } = event.target
      const file = files[0]
      if (!file) return
      const type = /image\//.test(file.type) ? 'IMAGES' : 'VIDEO'
      const res = await this.uploadFile(file)
      await this.sendMessage(res.url, type)
    },
    /**
     * O clock news
     * @param message
     */
    handleClickMessage(message) {
      if (message.type === 'ORDER') {
        this.handleClickOrder(message)
      } else if (message.type === 'GOODS') {
        window.open(this.domains['buyer_pc'] + `/goods/${message['goods_id']}`)
      }
    },
    /**
     * View order Details
     */
    handleClickOrder(item) {
      const { order_sn, sn } = item
      let url = this.isSeller
        ? `/order/detail/${order_sn || sn}`
        : `/member/my-order/detail?order_sn=${order_sn || sn}`
      window.open(url)
    },
    /**
     * Loading more items
     */
    handleLoadMoreGoods() {
      if (this.goodsListParams.no_data) return
      this.goodsListParams.page_no += 1
      this.getGoodsList()
    },
    /**
     * Load more orders
     */
    handleLoadMoreOrder() {
      if (this.orderParams.no_data || (this.isSeller && !this.receiver_id)) return
      this.orderParams.page_no += 1
      this.getOrders()
    },
    /**
     * Formatted date
     * @param unix
     * @param format
     * @returns {string}
     */
    unixToDate(unix, format) {
      let _format = format || 'yyyy-MM-dd hh:mm:ss'
      const d = new Date(unix * 1000)
      const o = {
        'M+': d.getMonth() + 1,
        'd+': d.getDate(),
        'h+': d.getHours(),
        'm+': d.getMinutes(),
        's+': d.getSeconds(),
        'q+': Math.floor((d.getMonth() + 3) / 3),
        S: d.getMilliseconds()
      }
      if (/(y+)/.test(_format)) _format = _format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (const k in o) if (new RegExp('(' + k + ')').test(_format)) _format = _format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      return _format
    },
    /**
     * The material picker confirms the selection
     * @param items
     */
    handleResourcePickerConfirm(items) {
      if (items.length) {
        const type = this.resource_picker_type === 'image' ? 'IMAGES' : 'VIDEO'
        this.sendMessage(items[0]['resource_url'], type)
      }
    },
    /**
     * The preview image
     * @param message
     */
    handlePreviewImage(message) {
      this.viewerImages = [message.url]
      this.$refs['viewer']['$viewer']['show']()
    },
    /**
     * Initialize the stickboard listener
     */
    initPasteScreenshot() {
      this.contentEl.addEventListener('paste', async(event) => {
        let paste = (event.clipboardData || window.clipboardData)
        if (paste.files.length !== 0) {
          const file = paste.files[0]
          if (file.type.indexOf('image/') === -1) return
          event.preventDefault()
          if (this.isSeller && !this.receiver_id) {
            return this.$message.error('Please select a dialogue！')
          }
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = (e) => {
            const h = this.$createElement
            const src = e.target.result
            MessageBox({
              title: 'Whether to send pictures？',
              message: h('img',
                {
                  style: { 'max-width': '390px', 'max-height': '390px' },
                  attrs: { src }
                }
              ),
              showCancelButton: true,
              confirmButtonText: 'save',
              cancelButtonText: 'cancel'
            }).then(async() => {
              const res = await this.uploadFile(file)
              await this.sendMessage(res.url, 'IMAGES')
            })
          }
        }
      })
    }
  },
  beforeDestroy() {
    if (!document) return
    this.$refs['chat-content'].removeEventListener('scroll', this.chatBoxScrollListener)
  }
}
</script>

<style lang="scss" scoped>
@import "./styles";
</style>
