/**
 * 导出选择器
 */

import CategoryPicker from './CategoryPicker'
import GoodsPicker from './GoodsPicker'
import ImagePicker from './ImagePicker'
import PriceRange from './PriceRange'
import RegionPicker from './RegionPicker'
import TableLayout from './TableLayout'
import TableSearch from './TableSearch'
import TextPicker from './TextPicker'
import YearMonthPicker from './YearMonthPicker'
import MemberPicker from './MemberPicker'

let components = {
  CategoryPicker,
  GoodsPicker,
  PriceRange,
  ImagePicker,
  RegionPicker,
  TableLayout,
  TableSearch,
  TextPicker,
  YearMonthPicker,
  MemberPicker
}

components.install = function(Vue, opts) {
  Object.keys(components).forEach(function (key) {
    key !== 'install' && Vue.component(components[key].name, components[key])
  })
}

export {
  CategoryPicker,
  GoodsPicker,
  PriceRange,
  ImagePicker,
  RegionPicker,
  TableLayout,
  TableSearch,
  TextPicker,
  YearMonthPicker
}

export default components
