/**
 * Category selection component
 * Increases with the increasing choice
 */
import Vue from 'vue'
import CategoryPicker from './src/main'

CategoryPicker.install = () => {
  Vue.component(CategoryPicker.name, CategoryPicker)
}

export default CategoryPicker
