/**
 * Created by Andste on 2018/6/15.
 * Text selector
 * Mainly used for floors
 */

import Vue from 'vue'
import TextPicker from './src/main'

TextPicker.install = () => {
  Vue.component(TextPicker.name, TextPicker)
}

export default TextPicker
