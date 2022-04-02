<template>
  <div></div>
</template>

<script>
import $ from 'jquery'
import AreaSelector from '@/plugins/selector/js/jquery.areaSelector.js'
import '../css/areaSelector.css'
export default {
  name: 'EnAreaSelectorDialog',
  props: {
    /** 是否显示 */
    showDialog: {
      type: Boolean,
      default: false
    },

    /** 默认数据 */
    defaultData: {
      type: Array
    },

    /** 请求地址 */
    api: {
      required: true
    },

    /** 过滤数据 */
    filterData: {
      type: Array,
      default: []
    }
  },
  methods: {
    callAreaDialog() {
      AreaSelector.show({
        api: this.api,
        filterData: this.filterData,
        defaultData: this.defaultData,
        confirm: data => {
          this.$emit('confirmFunc', data)
        },
        callHideDialog: () => {
          this.$emit('hideDialogFunc')
        }
      })
    }
  },
  mounted() {
    if (this.showDialog) {
      this.callAreaDialog()
    }
  },
  watch: {
    showDialog(val) {
      if (!val) {
        // 关闭Dialog
        $('.area-container').hide()
        $('.cover').css('display', 'none')
      } else {
        this.callAreaDialog()
      }
    }
  }
}
</script>

<style lang='scss'  type="text/scss" >
</style>
