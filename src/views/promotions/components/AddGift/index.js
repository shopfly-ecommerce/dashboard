/**
 * 添加/修改赠品
 */
import Vue from 'vue'
import AddGift from './main'

AddGift.install = () => {
  Vue.component(AddGift.name, AddGift)
}

export default AddGift
