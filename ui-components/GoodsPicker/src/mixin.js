/**
 * Created by Andste on 2018/5/28.
 */

import request from '@/utils/request'
import { domain } from '~/ui-domain'
import { RegExp } from '~/ui-utils'

export default {
  props: {
    // Selector type, Background management: Admin, Business center: Seller
    type: {
      type: String,
      default: 'admin'
    },
    // Display dialog
    show: {
      type: Boolean,
      default: false
    },
    api: {
      type: String,
      default: 'seller/goods'
    },
    // Get multiple commodity apis
    multipleApi: {
      type: String,
      default: 'seller/goods/@ids/details'
    },
    // Classification of the API
    categoryApi: {
      type: String,
      default: 'seller/goods/categories/@id/children'
    },
    // Maximum number of options
    limit: {
      type: Number,
      default: 0
    },
    // The default data
    defaultData: {
      type: Array,
      default: () => ([])
    },
    // To rule out
    excludeData: {
      type: Array,
      default: () => ([])
    },
    // Type of goods [NORMAL: ordinary goods, POINT: integral goods]
    goodsType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      params: {
        page_no: 1,
        page_size: 10,
        // Commodity classification path
        category_path: '',
        // Shop name
        seller_name: '',
        // Type
        goods_type: this.goodsType,
        // One or more commodity ids
        goods_ids: []
      },
      /** Loading status*/
      loading: false,
      /** Products*/
      goodsList: [],
      /** The selected list*/
      selectedList: [],
      dialogVisible: this.show,
      // The front desk of the domain name
      buyerDomain: domain.buyer_pc
    }
  },
  watch: {
    show(newVal) {
      this.dialogVisible = newVal
      if (this.goodsList.length === 0 && newVal === true) {
        this.GET_GoodsList()
        this.$nextTick(() => {
          this.$selectedList = document.getElementById('goods-picker-selected-' + this._uid)
        })
      }
    },
    dialogVisible(newVal) {
      newVal === false && this.$emit('close')
    },
    'defaultData': 'defaultDataChanged'
  },
  computed: {
    /** Count the number of selections*/
    selectedNum() {
      return this.selectedList.filter(item => item).length
    }
  },
  filters: {
    formatPrice(price) {
      return '￥' + String(Number(price).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  methods: {
    /** confirm*/
    handleConfirm() {
      this.$emit('confirm', this.selectedList.filter(item => item))
      this.$emit('close')
      this.selectedList = []
    },
    /** To load more*/
    handleLoadMore() {
      if (this.loading) return
      this.params.page_no += 1
      this.GET_GoodsList()
    },
    /** Click on the goods【It could be a choice or a cancellation】 */
    handleClickItem(item, index) {
      let _index = this.selectedList.findIndex(_item => _item.goods_id === item.goods_id)
      if (_index !== -1) {
        this.selectedList.splice(_index, 1)
      } else {
        let { limit } = this
        if (limit > 0 && this.selectedList.filter(item => item).length >= limit) {
          this.$message.error('Exceeding the maximum number of options：' + this.limit)
          return
        }
        this.selectedList.push(item)
        this.scrollToBottom()
      }
    },
    /** Removes the item from the selected item*/
    handleRemoveItem(item, index) {
      this.selectedList.splice(index, 1)
    },
    /** Scroll to the bottom of the selected list*/
    scrollToBottom() {
      this.$nextTick(() => {
        let $sel = this.$selectedList
        $sel.scrollTop = $sel.scrollHeight
      })
    },
    /** When the default data changes*/
    defaultDataChanged(newVal) {
      this.selectedList = []
      if (newVal && newVal.length > 0) {
        this.GET_GoodsByGoodsIds(newVal).then(response => this.selectedList.push(...response))
      }
    },
    /** Calculates whether it has been selected*/
    isSelected(goods) {
      return this.selectedList.findIndex(item => item.goods_id === goods.goods_id) !== -1
    },
    /** Multiple itemsidThe input field has changed*/
    handleGoodsIdsChange(ids) {
      if (!ids.length) return
      let last_id = ids[ids.length - 1]
      if (!RegExp.integer.test(last_id)) {
        this.$message.error('productIDShould be positive integer！')
        ids.pop()
        this.$set(this.params, 'goods_ids', ids)
      }
    },
    /** Find Multiple Items*/
    handleSearchMultipleGoods() {
      let { goods_ids } = this.params
      if (goods_ids.length) {
        this.GET_GoodsByGoodsIds(goods_ids).then(response => this.goodsList = response)
      } else {
        this.GET_GoodsList(true)
      }
    },
    /** Get a list of items*/
    GET_GoodsList(clean = false) {
      this.loading = true
      !!clean && (this.params.page_no = 1)
      let { params } = this
      let _params = {}
      Object.keys(this.params).forEach(key => {
        if (String(this.params[key])) _params[key] = params[key]
      })
      request({
        url: this.api,
        method: 'get',
        loading: false,
        params: _params
      }).then(response => {
        this.loading = false
        let data = response.data
        data.map(item => {
          item.goods_image = item.thumbnail
          item.goods_price = item.price
          return item
        })
        // If clean is true, clear goodsList first
        !!clean && (this.goodsList = [])
        this.goodsList.push(...data)
      })
    },
    /** Obtain commodity information according to commodity number*/
    GET_GoodsByGoodsIds(ids) {
      ids = typeof ids === 'string'
        ? ids.replace(/，/g, ',')
        : ids.join(',')
      return new Promise((resolve, reject) => {
        request({
          url: this.multipleApi.replace('@ids', ids),
          method: 'get',
          loading: false
        }).then(response => {
          let data = response.map(item => {
            item.goods_image = item.thumbnail
            item.goods_price = item.price
            return item
          })
          resolve(data)
        }).catch(reject)
      })
    }
  }
}
