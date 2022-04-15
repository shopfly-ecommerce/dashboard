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
    /** Whether or not shown*/
    showDialog: {
      type: Boolean,
      default: false
    },

    /** The default data*/
    defaultData: {
      type: Array
    },

    /** Request the address*/
    api: {
      required: true
    },

    /** Filter the data*/
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
        // Close the Dialog
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
