/**
 * Created by Andste on 2018/6/21.
 * Floor title editing module
 * You can edit header text and header overcolor
 * This component is inherited fromTextPickercomponent
 */

import Vue from 'vue'
import FloorTitlePicker from './src/main'

FloorTitlePicker.install = () => {
  Vue.component(FloorTitlePicker.name, FloorTitlePicker)
}

export default FloorTitlePicker
