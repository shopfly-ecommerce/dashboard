/**
 * Created by Andste on 2018/5/28.
 * 地区选择组件
 */

import Vue from 'vue'
import RegionPicker from './src/main'

RegionPicker.install = () => {
  Vue.component(RegionPicker.name, RegionPicker)
}

export default RegionPicker
