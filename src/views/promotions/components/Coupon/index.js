/**
 * 添加/修改 优惠券
 */
import Vue from 'vue'
import Coupon from './main'

Coupon.install = () => {
  Vue.component(Coupon.name, Coupon)
}

export default Coupon
