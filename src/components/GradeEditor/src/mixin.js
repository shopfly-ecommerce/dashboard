/**
 * Created by Andste on 2018/5/13.
 * mixin
 */

import request from '@/utils/request'

export default {
  props: {
    /**
     * To get the dataAPI
     * with@idplaceholder
     */
    api: {
      type: String,
      required: true
    },
    /**
     * The parameter name of the main parameter
     * id: A primary key
     * text: The text to display
     */
    paramsNames: {
      type: Object,
      default: () => ({
        id: 'id',
        text: 'text'
      })
    },
    /**
     * Show series at most
     * Default display to3level
     */
    maxLevel: {
      type: Number,
      default: 3
    },
    /**
     * Show incomingbtns
     * The default display means editable
     */
    showBtns: {
      type: Boolean,
      default: true
    },
    /**
     * The incomingbtns
     */
    btns: {
      type: Array,
      default: () => []
    },
    /**
     * Editor type text description
     * For display in"addxleveltypeText"
     * For example,：addxGrade classification
     */
    typeText: {
      type: String,
      default: 'data'
    }
  },
  data() {
    return {
      loading: false,
      data: [],
      /** The current level*/
      curLevel: 0,
      /** The level of the current operation*/
      curItem: '',
      /** The last level of data*/
      lastItem: '',
      /** A custom parameter array that needs to be deleted when data is returned*/
      needDeleteParams: ['$id', '$text', '$active', '$hidden'],
      /** Each search box keyword*/
      searchKeywords: [],
      /** The current search keyword is used to throttle the flow*/
      curSearchKeyword: ''
    }
  },
  computed: {
    /**
     * Calculate column width
     * @returns {{width : string}}
     */
    columnWdith() {
      return {
        width: 100 / (this.maxLevel > 3 ? this.maxLevel : 3) + '%'
      }
    },
    /**
     * The hierarchy of placeholders
     * @returns {*}
     */
    placeLevel() {
      const dataLen = this.data.length
      const { maxLevel } = this
      if (dataLen === 0) return 0
      if (dataLen < maxLevel) return dataLen
      if (dataLen === maxLevel) return null
    }
  },
  mounted() {
    this.GET_ChildrenById(0)
  },
  methods: {
    /**
     * To get the data
     * Take the data and hand it over to the data processing method for processing
     * @param id
     * @constructor
     */
    GET_ChildrenById(id) {
      this.loading = true
      request({
        url: this.api.replace(/@id/, id),
        method: 'get',
        loading: false
      }).then(data => {
        this.loading = false
        // If data is returned and is not an array, an error is thrown.
        if (data && !Array.isArray(data)) {
          throw Error('The response is not an array!')
        }
        // If any data is returned, or the array does not have a first value
        // There is no data after the explanation, this time can be completed directly
        if (!data || !data[0]) {
          this.data.splice(this.curLevel, this.maxLevel - this.curLevel)
          this.handleRturnItem()
          return
        }
        const names = this.paramsNames
        // Parameter name mapping
        data.map(item => {
          item.$id = item[names.id]
          item.$text = item[names.text]
          return item
        })
        this.dataProcessing(data)
      }).catch(() => { this.loading = false })
    },
    /**
     * The data processing
     */
    dataProcessing(res) {
      const { maxLevel, curLevel, data } = this
      res[0].$active = true
      this.lastItem = res[0]
      res.map(item => {
        item.$level = curLevel
        return item
      })
      data.splice(curLevel, data.length - curLevel, res)
      this.curLevel += 1
      if (this.curLevel < maxLevel) {
        this.GET_ChildrenById(res[0]['$id'])
      } else {
        this.handleRturnItem()
      }
    },
    /**
     * Click on theitemTriggering event
     * @param item
     * @param itemIndex
     * @param columnIndex
     */
    handleClickItem(item, itemIndex, columnIndex) {
      if (item.$active) return
      this.curLevel = columnIndex + 1
      this.$set(this.data, columnIndex, this.data[columnIndex].map(_item => {
        _item.$active = _item === item
        return _item
      }))
      this.lastItem = item
      if (columnIndex < this.maxLevel - 1) {
        this.GET_ChildrenById(item.$id)
      } else {
        this.handleRturnItem()
      }
    },
    /**
     * Ill go to CustombtnTriggering event
     * willitemCall back as a parameter
     * @param item
     * @param btn
     * @param btnIndex
     * @param columnIndex
     */
    handleClickItemBtn(item, btn, btnIndex, columnIndex) {
      const { onClick } = this.btns[btnIndex]
      this.curItem = item
      item = JSON.parse(JSON.stringify(item))
      const parentArray = JSON.parse(JSON.stringify(this.data[columnIndex - 1] || ''))
      const parent = parentArray && JSON.parse(JSON.stringify(parentArray.filter(_item => _item.$active)[0] || ''))
      this.needDeleteParams.forEach(key => {
        delete item[key]
        delete parent[key]
      })
      typeof onClick === 'function' && onClick(item, parent, parentArray)
    },
    /**
     * The triggerchangeThe event
     * The last level of data is passed back as a parameter
     * Before doing so, remove the custom parameters within the component
     */
    handleRturnItem() {
      const object = JSON.parse(JSON.stringify(this.lastItem))
      this.needDeleteParams.forEach(key => delete object[key])
      this.$emit('change', object)
    },
    /**
     * Retrieves the current level data
     * typeforedit, only refresh the current level
     * typefordelete, deletes the current level and the following levels
     * @param type The refresh type【edit, add, delete】
     * @param item
     */
    refresh(type, item) {
      let { data, curItem, paramsNames } = this
      const { $level } = curItem
      // Gets a reference to the data array for the operation
      const levelArray = data[$level] || []
      // Get the index of the data for the operation
      const index = levelArray.findIndex(_item => _item.$active)
      if (type === 'edit' && item) {
        const _item = JSON.parse(JSON.stringify(item))
        Object.keys(_item).forEach(key => {
          if (_item[key] === undefined || _item[key] === undefined) delete _item[key]
        })
        item[paramsNames.id] && (_item.$id = item[paramsNames.id])
        item[paramsNames.text] && (_item.$text = item[paramsNames.text])
        const obj = {
          ...curItem,
          ..._item
        }
        this.$set(data[$level], index, obj)
        return
      }
      let id = 0
      if (data[$level - 1]) {
        id = data[$level - 1].filter(item => item.$active)[0].$id
      }
      this.curLevel = $level
      this.GET_ChildrenById(id)
    },
    /**
     * Search keywords have changed
     * Will not match the keyword$hiddenSet totrue
     * @param columnIndex
     */
    handleSearchKeywordChange(columnIndex) {
      const keyword = this.searchKeywords[columnIndex]
      if (keyword === this.curSearchKeyword) return
      this.curSearchKeyword = keyword
      this.$set(this.data, columnIndex, this.data[columnIndex].map(item => {
        item.$hidden = keyword && item.$text.indexOf(keyword) === -1
        return item
      }))
    },
    /**
     * Click the Add button
     * Return three parameters
     * columnIndex Current hierarchy
     * parent At the next higher level
     * parentArray All the data at the next level
     * @param columnIndex
     */
    handleClickAdd(columnIndex) {
      const { data, needDeleteParams } = this
      this.curItem = { $level: columnIndex }
      let parent
      let parentArray
      if (columnIndex !== 0) {
        parentArray = JSON.parse(JSON.stringify(data[columnIndex - 1] || data[columnIndex]))
        parent = parentArray.filter(item => item.$active)[0]
        parentArray.map(item => {
          needDeleteParams.forEach(key => delete item[key])
          return item
        })
      }
      this.$emit('add-click', columnIndex, parent, parentArray)
    }
  }
}
