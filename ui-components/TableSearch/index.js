/**
 * 搜索组件
 * 包含高级模式
 */
import Vue from 'vue'
import Search from './src/main'

Search.install = () => {
  Vue.component(Search.name, Search)
}

export default Search
