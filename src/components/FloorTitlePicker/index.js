/**
 * Created by Andste on 2018/6/21.
 * 楼层标题编辑组件
 * 可以编辑标题文字和标题过度颜色
 * 此组件继承于TextPicker组件
 */

import Vue from 'vue'
import FloorTitlePicker from './src/main'

FloorTitlePicker.install = () => {
  Vue.component(FloorTitlePicker.name, FloorTitlePicker)
}

export default FloorTitlePicker
