<template>
  <div class="en-search">
    <div style="width: 330px" v-if="showSearch">
      <el-input
        size="small"
        clearable
        :placeholder="placeholder"
        v-model="keyword"
        @keyup.native.enter="search"
      >
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </div>
    <div v-if="advanced">
      <el-popover
        ref="popover"
        placement="bottom-start"
        :width="advancedWidth"
        v-model="popoverVisible"
      >
        <slot name="advanced-content"></slot>
        <div style="text-align: right; margin: 0">
          <el-popover
            placement="top"
            width="160"
            v-model="visible_del_popover">
            <p>确定要清空表单吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible_del_popover = false">取消</el-button>
              <el-button type="primary" size="mini" @click="handleCleanForm">确定</el-button>
            </div>
            <el-button size="mini" type="text" slot="reference" @click="visible_del_popover = true" class="clean-form">清空</el-button>
          </el-popover>
          <el-button size="mini" type="text" @click="popoverVisible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="advancedSearch">确定</el-button>
        </div>
        <el-button
          size="small"
          style="margin-left: 10px"
          slot="reference"
        >
          高级搜索
        </el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'EnTableSearch',
    props: {
      // 是否为高级搜索
      advanced: {
        type: Boolean,
        default: false
      },
      showSearch: {
        type: Boolean,
        default: true
      },
      advancedWidth: {
        default: 405
      },
      placeholder: {
        type: String,
        default: '请输入关键字'
      }
    },
    data() {
      return {
        keyword: '',
        popoverVisible: false,
        visible_del_popover: false,
        clearFuncs: [],
        clearFuncNames: ['clearValue', 'deleteSelected']
      }
    },
    methods: {
      /** 普通搜索 */
      search() {
        this.popoverVisible = false
        this.$emit('search', this.$data.keyword)
      },
      /** 高级搜索 */
      advancedSearch() {
        this.popoverVisible = false
        this.$emit('advancedSearch', this.$data.keyword)
      },
      /** 清空表单 */
      handleCleanForm(event) {
        let $parent = this.$parent.$parent
        if (!this.$parent.$parent.$refs['advancedForm']) {
          $parent = this.$parent.$parent.$parent.$parent
        }
        let $form = $parent.$refs['advancedForm']
        let objs = this.MixinClone($parent.advancedForm)
        Object.keys(objs).forEach(key => {
          $parent.advancedForm[key] = ''
        })
        this.findClearValue($form)
        this.clearFuncs.forEach(func => func(event))
        this.clearFuncs = []
        this.visible_del_popover = false
      },
      /** 递归查找组件清空的方法 */
      findClearValue(component) {
        let { clearFuncs, clearFuncNames } = this
        let { $children: $ch } = component
        $ch && $ch.length && $ch.forEach(item => {
          let funs = clearFuncNames.filter(name => typeof item[name] === 'function')
          if (funs.length) {
            clearFuncs.push(item[funs[0]])
          } else {
            this.findClearValue(item)
          }
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .en-search {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .clean-form {
    color: #F56C6C;
    margin-right: 10px;
  }
</style>
