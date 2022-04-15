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
    // The commodity operation base unit defaults to goodsID and skU is skuID when skU is true
    sku: {
      type: Boolean,
      detault: false
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
        // One or more commodity IDS (Goods_ID or SKU_ID)
        ids: []
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
      let _index
      if (this.sku) {
        _index = this.selectedList.findIndex(_item => _item.sku_id === item.sku_id)
      } else {
        _index = this.selectedList.findIndex(_item => _item.goods_id === item.goods_id)
      }
      if (_index !== -1) {
        this.selectedList.splice(_index, 1)
      } else {
        const { limit } = this
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
        const $sel = this.$selectedList
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
      return this.sku ? this.selectedList.findIndex(item => item.sku_id === goods.sku_id) !== -1 : this.selectedList.findIndex(item => item.goods_id === goods.goods_id) !== -1
    },
    /** Multiple itemsidThe input field has changed*/
    handleGoodsIdsChange(ids) {
      if (!ids.length) return
      const last_id = ids[ids.length - 1]
      if (!RegExp.integer.test(last_id)) {
        this.$message.error('productIDShould be positive integer！')
        ids.pop()
        this.$set(this.params, 'ids', ids)
      }
    },
    /** Find Multiple Items*/
    handleSearchMultipleGoods() {
      const { ids } = this.params
      if (ids.length) {
        this.GET_GoodsByGoodsIds(ids).then(response => { this.goodsList = response })
      } else {
        this.GET_GoodsList(true)
      }
    },
    /** Get a list of items*/
    GET_GoodsList(clean = false) {
      this.loading = true
      !!clean && (this.params.page_no = 1)
      const { params } = this
      const _params = {}
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
        const data = response.data
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
          resolve(response)
        }).catch(reject)
      })
    }
  }
}
