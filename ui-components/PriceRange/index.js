/**
 * 价格区间设置组件
 */

import Vue from 'vue'
import PriceRange from './src/main'

PriceRange.insall = () => {
  Vue.component(PriceRange.name, PriceRange)
}

export default PriceRange
