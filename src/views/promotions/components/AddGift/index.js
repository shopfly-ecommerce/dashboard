/**
 * add/Modify the gifts
 */
import Vue from 'vue'
import AddGift from './main'

AddGift.install = () => {
  Vue.component(AddGift.name, AddGift)
}

export default AddGift
