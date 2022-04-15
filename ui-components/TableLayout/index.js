/**
 * Form components
 * Contains paging
 * The search bar is optional
 */
import Vue from 'vue'
import Tabel from './src/main'

Tabel.install = () => {
  Vue.component(Tabel.name, Tabel)
}

export default Tabel
