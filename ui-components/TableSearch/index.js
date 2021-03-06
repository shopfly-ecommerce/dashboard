/**
 * Search component
 * Include advanced modes
 */
import Vue from 'vue'
import Search from './src/main'

Search.install = () => {
  Vue.component(Search.name, Search)
}

export default Search
