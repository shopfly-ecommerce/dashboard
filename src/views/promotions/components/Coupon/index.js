/**
 * add/Modify coupons
 */
import Vue from 'vue'
import Coupon from './main'

Coupon.install = () => {
  Vue.component(Coupon.name, Coupon)
}

export default Coupon
