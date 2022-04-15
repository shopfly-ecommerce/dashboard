/**
 * Created by Andste on 2018/5/28.
 * Locale selection component
 */

import Vue from 'vue'
import RegionPicker from './src/main'

RegionPicker.install = () => {
  Vue.component(RegionPicker.name, RegionPicker)
}

export default RegionPicker
