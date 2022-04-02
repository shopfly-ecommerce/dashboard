/**
 * Created by Andste on 2018/6/21.
 * 楼层标签编辑组件
 */

import Vue from 'vue'
import FloorTagsPicker from './src/main'

FloorTagsPicker.install = () => {
  Vue.component(FloorTagsPicker.name, FloorTagsPicker)
}

export default FloorTagsPicker
