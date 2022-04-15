/**
 * Created by Andste on 2018/6/21.
 * Floor label editing module
 */

import Vue from 'vue'
import FloorTagsPicker from './src/main'

FloorTagsPicker.install = () => {
  Vue.component(FloorTagsPicker.name, FloorTagsPicker)
}

export default FloorTagsPicker
