<template>
    <li>
      <!--icon& Current item data-->
      <div :class="[model.isSelected ? 'is-selected' : '']" >
       <span @click="toggle(model)">
         <i v-if="isFolder" :class="[model.isSelected ? (open ? 'el-icon-minus': 'el-icon-plus') : (open ? 'el-icon-remove': 'el-icon-circle-plus')]"></i>
         <i v-if="!isFolder"></i>
       </span>
        <span class="name-label" @click="handleChoose(model)"> {{ model.local_name }} </span>
      </div>
      <!--Item data-->
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
      /** The current node*/
      model: {
        type: Object,
        default: {}
      },

      /** The parent of the current node*/
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
      isFolder() { // Student: Is there a subterm
        return this.model.children && !Array.isArray(this.model.children)
      }
    },
    methods: {
      // Expand/close
      toggle() {
        if (this.isFolder) { // Expand if there are subitems/ close
          this.open = !this.open
        }
      },
      handleChoose(model) { // The selected/不The selectedmodelFor the current item
        model.isSelected = !model.isSelected
        // If the current item has descendant nodes, the descendants are selected/unselected
        let stack = []
        stack.push(model)
        let item
        while (stack.length) {
          item = stack.shift()
          // The parent node remains in sync if all of its siblings are in the same state as the current node
          item.isSelected = model.isSelected
          if (this.parentNode && this.parentNode.children) {
            let result = true // The default synchronization
            for (let i in this.parentNode.children) {
              if (this.parentNode.children[i].isSelected !== model.isSelected) {
                result = false
              }
            }
            if (result) { // synchronous
              this.parentNode.isSelected = model.isSelected
            } else {
              this.parentNode.isSelected = false
            }
          }
          // If the node has children, continue adding to the top of the stack
          if (item && item.children && !Array.isArray(item.children)) {
            for (let i in item.children) {
              stack.push(item.children[i])
            }
          }
        }
        this.$emit('selectCaputure', model, this.parentNode)
      },
      onselected(model, parentNode) { // Listen for the response after it is selected to calculate the data after it is now selected
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

