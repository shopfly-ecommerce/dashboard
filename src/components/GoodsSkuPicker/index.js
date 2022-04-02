/**
 * Created by Andste on 2018/5/28.
 * 商品选择器
 * 依赖于element-ui
 */

import Vue from 'vue'
import GoodsSkuPicker from './src/main.vue'

GoodsSkuPicker.install = () => {
  Vue.component(GoodsSkuPicker.name, GoodsSkuPicker)
}

export default GoodsSkuPicker
