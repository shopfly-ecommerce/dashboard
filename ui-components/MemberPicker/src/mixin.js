/**
 * Created by Andste on 2018/5/28.
 */

import request from '@/utils/request'
import { domain } from '~/ui-domain'

export default {
  props: {
    // 显示dialog
    show: {
      type: Boolean,
      default: false
    },
    api: {
      type: String,
      default: 'seller/members'
    },
    // 获取多个会员API
    multipleApi: {
      type: String,
      default: 'seller/members/@ids/list'
    },
    // 最大可选个数
    limit: {
      type: Number,
      default: 0
    },
    // 默认数据
    defaultData: {
      type: Array,
      default: () => ([])
    },
    // 排除
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
        // 一个或多个会员ids
        member_ids: '',
        // 性别
        sex: ''
      },
      /** 加载状态 */
      loading: false,
      /** 会员列表 */
      memberList: [],
      /** 已选列表 */
      selectedList: [],
      dialogVisible: this.show,
      // 前台域名
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
    /** 计算已选择个数 */
    selectedNum() {
      return this.selectedList.filter(item => item).length
    }
  },
  methods: {
    /** 确认 */
    handleConfirm() {
      this.$emit('confirm', this.selectedList.filter(item => item))
      this.$emit('close')
      this.selectedList = []
    },
    /** 加载更多 */
    handleLoadMore() {
      if (this.loading) return
      this.params.page_no += 1
      this.GET_MemberList()
    },
    /** 点击会员【可能是选择也可能是取消】 */
    handleClickItem(item, index) {
      let _index = this.selectedList.findIndex(_item => _item.member_id === item.member_id)
      if (_index !== -1) {
        this.selectedList.splice(_index, 1)
      } else {
        let { limit } = this
        if (limit > 0 && this.selectedList.filter(item => item).length >= limit) {
          this.$message.error('超过最大可选个数：' + this.limit)
          return
        }
        this.selectedList.push(item)
        this.scrollToBottom()
      }
    },
    /** 从已选会员中移除会员 */
    handleRemoveItem(item, index) {
      this.selectedList.splice(index, 1)
    },
    /** 已选择列表滚动到底部 */
    scrollToBottom() {
      this.$nextTick(() => {
        let $sel = this.$selectedList
        $sel.scrollTop = $sel.scrollHeight
      })
    },
    /** 当默认数据发生改变 */
    defaultDataChanged(newVal) {
      this.selectedList = []
      if (newVal && newVal.length > 0) {
        this.GET_MemberByMemberIds(newVal).then(response => this.selectedList.push(...response))
      }
    },
    /** 计算是否已被选 */
    isSelected(member) {
      return this.selectedList.findIndex(item => item.member_id === member.member_id) !== -1
    },
    /** 查找多个会员 */
    handleSearchMultipleGoods() {
      let { member_ids } = this.params
      if (member_ids) {
        this.GET_MemberByMemberIds(member_ids).then(response => this.memberList = response)
      } else {
        this.GET_MemberList(true)
      }
    },
    /** 获取会员列表 */
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
        // 如果clean为true，先清空memberList
        !!clean && (this.memberList = [])
        this.memberList.push(...response.data)
      })
    },
    /** 根据会员编号获取会员信息 */
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
