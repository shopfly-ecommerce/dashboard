/**
 * Created by Andste on 2018/6/15.
 * 文本选择器
 * 主要用于楼层
 */

import Vue from 'vue'
import TextPicker from './src/main'

TextPicker.install = () => {
  Vue.component(TextPicker.name, TextPicker)
}

export default TextPicker
