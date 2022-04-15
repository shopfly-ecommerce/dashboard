/**
 * Created by Andste on 2018/5/28.
 */

import request from '@/utils/request'
import { domain } from '~/ui-domain'

export default {
  props: {
    // Display dialog
    show: {
      type: Boolean,
      default: false
    },
    api: {
      type: String,
      default: 'seller/members'
    },
    // Get multiple member apis
    multipleApi: {
      type: String,
      default: 'seller/members/@ids/list'
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
    }
  },
  data() {
    return {
      params: {
        page_no: 1,
        page_size: 10,
        // One or more member IDS
        member_ids: '',
        // gender
        sex: ''
      },
      /** Loading status*/
      loading: false,
      /** The member list*/
      memberList: [],
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
      if (this.memberList.length === 0 && newVal === true) {
        this.GET_MemberList()
        this.$nextTick(() => {
          this.$selectedList = document.getElementById('member-picker-selected-' + this._uid)
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
      this.GET_MemberList()
    },
    /** Click on the member【It could be a choice or a cancellation】 */
    handleClickItem(item, index) {
      let _index = this.selectedList.findIndex(_item => _item.member_id === item.member_id)
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
    /** Removes a member from a selected member*/
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
        this.GET_MemberByMemberIds(newVal).then(response => this.selectedList.push(...response))
      }
    },
    /** Calculates whether it has been selected*/
    isSelected(member) {
      return this.selectedList.findIndex(item => item.member_id === member.member_id) !== -1
    },
    /** Find multiple members*/
    handleSearchMultipleGoods() {
      let { member_ids } = this.params
      if (member_ids) {
        this.GET_MemberByMemberIds(member_ids).then(response => this.memberList = response)
      } else {
        this.GET_MemberList(true)
      }
    },
    /** Get membership list*/
    GET_MemberList(clean = false) {
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
        // If clean is true, clean the memberList first
        !!clean && (this.memberList = [])
        this.memberList.push(...response.data)
      })
    },
    /** Obtain membership information according to membership number*/
    GET_MemberByMemberIds(ids) {
      ids = typeof ids === 'string'
        ? ids.replace(/，/g, ',')
        : ids.join(',')
      return request({
        url: this.multipleApi.replace('@ids', ids),
        method: 'get',
        loading: false
      })
    }
  }
}
