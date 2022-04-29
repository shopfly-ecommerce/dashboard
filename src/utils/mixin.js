/**
 * Created by Andste on 2018/5/9.
 */

import Vue from 'vue'
import { Foundation } from '~/ui-utils'
import { api, domain } from '~/ui-domain'
import request from '@/utils/request'
import * as XLSX from 'xlsx'

export default {
  data() {
    return {
      // Image upload API
      MixinUploadApi: api.address + '/uploaders',
      // WeChat image upload
      MixinWXUploadApi: api.address + '/seller/live-video/media/upload',
      // In the API
      MixinRegionApi: api.address + '/regions/@id/children',
      // Buyer side PC domain name
      MixinBuyerDomain: domain.buyer_pc,
      // Buyer side WAP domain name
      MixinBuyerWapDomain: domain.buyer_wap,
      // Date picker shortcut options
      MixinPickerShortcuts: [{
        text: 'In the latest week',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: 'Last month',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: 'Last three months',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          picker.$emit('pick', [start, end])
        }
      }],
      // Domain
      MixinDomain: domain,
      // API
      MixinApi: api,
      // Whether IM is enabled
      MixinIsIM: process.env.IM
    }
  },
  computed: {
    /**
     * Cached page array
     * @returns {default.computed.cachedViews|(function())|Array|*|getters.cachedViews}
     */
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    /**
     * Return the default time+ 5minutes
     * The default time for the date-time selector
     * @returns {string}
     * @constructor
     */
    MixinDefaultTime() {
      const today = new Date()
      let hours = today.getHours()
      let minutes = today.getMinutes() + 5
      let seconds = today.getSeconds()
      if (hours < 10) hours = '0' + hours
      if (minutes < 10) minutes = '0' + minutes
      if (seconds < 10) seconds = '0' + seconds
      return hours + ':' + minutes + ':' + seconds
    }
  },
  methods: {
    /** Returns the cloned object*/
    MixinClone(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    /** After modifying a single table data,settotableDataIn the*/
    MixinSetTableData(tableData, idName, id, response) {
      const { data } = tableData
      const index = data.findIndex(item => item[idName] === id)
      Vue.set(data, index, response)
    },
    /** Used to determine if the form is empty*/
    MixinRequired(message, trigger) {
      return { required: true, message: message, trigger: trigger || 'blur' }
    },
    /** Formatted money*/
    MixinFormatPrice(row, column, cellValue, index) {
      if (typeof cellValue !== 'number') return ''
      return '￥' + Foundation.formatPrice(cellValue)
    },
    /** Formatted timestamp*/
    MixinUnixToDate(row, column, cellValue, index) {
      return Foundation.unixToDate(cellValue)
    },
    /**
     * exportExcel
     * @param json   To export thejsondata
     * @param name   The file name to export
     * @param type   The data type to export
     * @constructor
     */
    MixinExportJosnToExcel(json, name = 'data', type = 'application/octet-stream') {
      let wb = { SheetNames: [], Sheets: {}, Props: { }}
      if (!Array.isArray(json)) json = [json]
      json.forEach(item => {
        wb.SheetNames.push(item.sheet_name)
        wb.Sheets[item.sheet_name] = XLSX.utils.json_to_sheet(item.sheet_values, item.sheet_options)
      })
      const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' }
      let blob = new Blob([s2ab(XLSX.write(wb, wopts))], { type })
      let link = document.createElement('a')
      document.body.appendChild(link)
      link.style.display = 'none'
      link.href = window.URL.createObjectURL(blob)
      link.download = `${name}.xlsx`
      link.click()
      // Release resources
      setTimeout(() => {
        URL.revokeObjectURL(link.href)
      }, 100)

      function s2ab(s) {
        if (typeof ArrayBuffer !== 'undefined') {
          const buf = new ArrayBuffer(s.length)
          const view = new Uint8Array(buf)
          for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
          return buf
        } else {
          const buf = new Array(s.length)
          for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
          return buf
        }
      }
    },
    /**
     * Request method
     */
    MixinRequest: request
  }
}
