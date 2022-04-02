import Vue from 'vue'
import TreeList from './treeList'

TreeList.install = () => {
  Vue.component(TreeList.name, TreeList)
}

export default TreeList
