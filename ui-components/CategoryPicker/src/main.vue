<template>
  <el-cascader
    :options="options"
    change-on-select
    @change="handleItemChange"
    :props="props"
    separator="/"
    size="small"
    clearable
    v-bind="$attrs"
  ></el-cascader>
</template>

<script>
  import request from '@/utils/request'

  export default {
    name: 'EnCategoryPicker',
    props: {
      /** api */
      api: {
        type: String,
        default: 'seller/goods/categories/@id/children'
      },
      /** The largest series*/
      maxLevel: {
        type: Number,
        default: 4
      }
    },
    data() {
      return {
        options: [],
        props: {
          value: 'category_id',
          label: 'name',
          children: 'children',
          disabled: 'disabled'
        }
      }
    },
    mounted() {
      this.GET_CategoryData()
    },
    methods: {
      GET_CategoryData(category_ids = []) {
        let _category_id = category_ids[category_ids.length - 1] || 0
        request({
          url: this.api.replace('@id', _category_id),
          method: 'get',
          loading: false
        }).then(response => {
          if (!response || !response[0]) return
          if (_category_id !== 0) {
            this.findRegios(category_ids, response)
            return
          }
          this.options = response.map(item => {
            if (item.has_children) {
              item.children = [{
                name: 'In the load...',
                disabled: true,
                category_id: -1
              }]
            }
            return item
          })
        })
      },

      /** The selected item has changed*/
      handleItemChange(val) {
        new RegExp('@id').test(this.api) && this.GET_CategoryData(val)
        this.$emit('changed', this.findRegios(val))
      },

      /** Find the corresponding area*/
      findRegios(category_ids, response) {
        let _data = { children: this.options }
        category_ids.forEach((item, index) => {
          _data.children && _data.children.forEach(_item => {
            if (_item.category_id === category_ids[index]) {
              _data = _item
            }
          })
        })
        // If there is incoming locale data, it is being loaded asynchronously
        if (response) {
          _data.children = response.map(item => {
            if (category_ids.length + 1 < this.maxLevel && item.has_children) {
              item.children = [{
                name: 'In the load...',
                disabled: true,
                category_id: -1
              }]
            }
            return item
          })
        }
        return _data
      }
    }
  }
</script>
