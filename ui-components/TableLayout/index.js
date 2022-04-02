/**
 * 表格组件
 * 包含分页
 * 搜索栏可选
 */
import Vue from 'vue'
import Tabel from './src/main'

Tabel.install = () => {
  Vue.component(Tabel.name, Tabel)
}

export default Tabel
