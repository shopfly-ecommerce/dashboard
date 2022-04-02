/**
 * Created by Andste on 2018/5/28.
 * 商品选择器
 * 依赖于element-ui
 */

import Vue from 'vue'
import GoodsPicker from './src/main.vue'

GoodsPicker.install = () => {
  Vue.component(GoodsPicker.name, GoodsPicker)
}

export default GoodsPicker
