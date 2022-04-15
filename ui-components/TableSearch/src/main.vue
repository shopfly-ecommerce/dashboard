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
            <p>Are you sure you want to clear the form？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible_del_popover = false">cancel</el-button>
              <el-button type="primary" size="mini" @click="handleCleanForm">save</el-button>
            </div>
            <el-button size="mini" type="text" slot="reference" @click="visible_del_popover = true" class="clean-form">empty</el-button>
          </el-popover>
          <el-button size="mini" type="text" @click="popoverVisible = false">cancel</el-button>
          <el-button type="primary" size="mini" @click="advancedSearch">save</el-button>
        </div>
        <el-button
          size="small"
          style="margin-left: 10px"
          slot="reference"
        >
          Advanced search
        </el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'EnTableSearch',
    props: {
      // Whether the search is advanced
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
        default: 'Please enter the keywords'
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
      /** Ordinary search*/
      search() {
        this.popoverVisible = false
        this.$emit('search', this.$data.keyword)
      },
      /** Advanced search*/
      advancedSearch() {
        this.popoverVisible = false
        this.$emit('advancedSearch', this.$data.keyword)
      },
      /** Empty form*/
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
      /** Recursively find a way to empty a component*/
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
