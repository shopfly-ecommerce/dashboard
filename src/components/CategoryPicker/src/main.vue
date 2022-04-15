<template>
  <el-cascader
    :options="options"
    change-on-select
    v-model="defaultArr"
    @change="handleItemChange"
    :clearable="clearable"
    :props="props"
    separator="/"
  ></el-cascader>
</template>

<script>
  import request from '@/utils/request'
  import cache from '@/utils/cache'
  export default {
    name: 'EnCategoryPicker',
    props: {
      /** api */
      api: {
        type: String,
        default: 'seller/shops/cats'
      },
      /** The largest series*/
      maxLevel: {
        type: Number,
        default: 4
      },
      /** Can I clear it*/
      clearable: {
        type: Boolean,
        default: false
      },

      /** The default value*/
      defaultVal: {
        type: Number,
        default: -1
      },

      /** Mapping attributes*/
      props: {
        type: Object,
        default: () => {
          return {
            value: 'shop_cat_id',
            label: 'shop_cat_name',
            children: 'children',
            disabled: 'disabled'
          }
        }
      }
    },
    data() {
      return {
        /** The current data*/
        options: [],

        /** The default values map to an array*/
        defaultArr: []
      }
    },
    watch: {
      defaultVal: function() {
        if (this.defaultVal !== -1) {
          this.findItem()
        }
      }
    },
    mounted() {
      this.GET_RegionData()
    },
    activated() {
      this.GET_RegionData()
    },
    methods: {
      GET_RegionData() {
        request({
          url: this.api,
          method: 'get',
          loading: false
        }).then(response => {
          // Removes hidden values
          if (!response || !response[0]) return
          this.options = []
          if (this.props.value === 'shop_cat_id') {
            this.options = this.filterShowItem(response)
          } else {
            this.options = response
          }
          // If children is empty, it is not expanded
          this.options = this.deleteEmptyChild(this.options)
          this.defaultVal !== -1 && this.findItem()
        })
      },

      /** The selected item has changed*/
      handleItemChange(val) {
        this.$emit('changed', val)
      },

      /** Filter out the items to display*/
      filterShowItem(data = []) {
        let result = []
        data.forEach(key => {
          if (!key.disable) return
          if (key.children && key.children.length) {
            key.children = this.filterShowItem(key.children)
          }
          result.push(key)
        })
        return result
      },

      /** ifchilrenthelength for0 Delete this item*/
      deleteEmptyChild(arr = []) {
        arr.forEach(key => {
          if (key.children && !key.children.length) {
            delete key.children
          } else if (key.children && key.children.length) {
            this.deleteEmptyChild(key.children)
          }
        })
        return arr
      },

      /** Find the option if there is a default value*/
      findItem() {
        if (!this.options || this.options.length === 0) return
        this.defaultArr = []
        this.options.forEach(key => {
          if (key.shop_cat_id === this.defaultVal) {
            this.defaultArr.push(key.shop_cat_id)
            return
          }
          key.children && key.children.forEach(_item => {
            if (_item.shop_cat_id === this.defaultVal) {
              this.defaultArr.push(key.shop_cat_id)
              this.defaultArr.push(_item.shop_cat_id)
              return
            }
          })
        })
      }
    }
  }
</script>
