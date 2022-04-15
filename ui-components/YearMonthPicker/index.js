/**
 * Select year or month select
 * Returns the selected year or month
 * Returns the selected range of years or months
 */

import Vue from 'vue'
import YearMonthPicker from './src/main'

YearMonthPicker.install = () => {
  Vue.component(YearMonthPicker.name, YearMonthPicker)
}

export default YearMonthPicker
