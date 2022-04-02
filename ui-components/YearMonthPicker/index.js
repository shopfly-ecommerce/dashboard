/**
 * 选择年份或者月份选择
 * 返回选择的年份或者月份
 * 返回选择的年份区间或月份区间
 */

import Vue from 'vue'
import YearMonthPicker from './src/main'

YearMonthPicker.install = () => {
  Vue.component(YearMonthPicker.name, YearMonthPicker)
}

export default YearMonthPicker
