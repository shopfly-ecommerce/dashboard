<template>
    <li>
      <!--图标 & 当前项数据-->
      <div :class="[model.isSelected ? 'is-selected' : '']" >
       <span @click="toggle(model)">
         <i v-if="isFolder" :class="[model.isSelected ? (open ? 'el-icon-minus': 'el-icon-plus') : (open ? 'el-icon-remove': 'el-icon-circle-plus')]"></i>
         <i v-if="!isFolder"></i>
       </span>
        <span class="name-label" @click="handleChoose(model)"> {{ model.local_name }} </span>
      </div>
      <!--子项数据-->
      <collapse-transition>
        <ul style="padding-left: 18px"  v-show="open" v-if="isFolder">
          <en-tree-item
            v-for="item in model.children"
            :model="item"
            :parentNode="model"
            @selectCaputure="onselected"
            :key="item.id"></en-tree-item>
        </ul>
      </collapse-transition>
    </li>
</template>

<script>
  import collapseTransition from './collapse-transition'
  export default {
    name: 'EnTreeItem',
    props: {
      /** 当前节点 */
      model: {
        type: Object,
        default: {}
      },

      /** 当前节点的父节点 */
      parentNode: {
        type: Object,
        default: () => ({})
      }
    },
    components: {
      collapseTransition
    },
    data() {
      return {
        open: false
      }
    },
    computed: {
      isFolder() { // 是否有子项
        return this.model.children && !Array.isArray(this.model.children)
      }
    },
    methods: {
      // 展开/关闭
      toggle() {
        if (this.isFolder) { // 如果存在子项 则展开/ 关闭
          this.open = !this.open
        }
      },
      handleChoose(model) { // 选中/不选中 model为当前项
        model.isSelected = !model.isSelected
        // 如果当前项存在后代节点 则后代节点一并选中/不选中
        let stack = []
        stack.push(model)
        let item
        while (stack.length) {
          item = stack.shift()
          // 如果当前节点的兄弟节点 全部跟当前节点状态一样 则父节点保持同步
          item.isSelected = model.isSelected
          if (this.parentNode && this.parentNode.children) {
            let result = true // 默认同步
            for (let i in this.parentNode.children) {
              if (this.parentNode.children[i].isSelected !== model.isSelected) {
                result = false
              }
            }
            if (result) { // 同步
              this.parentNode.isSelected = model.isSelected
            } else {
              this.parentNode.isSelected = false
            }
          }
          // 如果该节点有子节点，继续添加进入栈顶
          if (item && item.children && !Array.isArray(item.children)) {
            for (let i in item.children) {
              stack.push(item.children[i])
            }
          }
        }
        this.$emit('selectCaputure', model, this.parentNode)
      },
      onselected(model, parentNode) { // 监听响应 选中之后进行计算现在选中之后的数据
        this.$emit('selectCaputure', model, parentNode)
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  ul {
    list-style: none;
  }
  .tree-menu li {
    line-height: 1.5;
  }
  .tree-menu li div{
    width: 100%;
    cursor: pointer;
    line-height: 40px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    i {
      font-size: 16px;
      color: #d7d7d7;
      margin-left: 5px;
    }
    .el-icon-minus, .el-icon-plus {
      font-size: 12px;
      background-color: #fff;
      border: none;
      border-radius: 50%;
      padding: 1px;
    }
    span.name-label {
      display: inline-block;
      margin-left: 5px;
      width: 150px;
      cursor: pointer;
    }
  }
  /deep/ .is-selected {
    background-color: #d7d7d7;
    color: #fff;
  }
</style>

