/**
 * Created by Andste on 2018/5/28.
 * 会员选择器
 * 依赖于element-ui
 */

import Vue from 'vue'
import MemberPicker from './src/main.vue'

MemberPicker.install = () => {
  Vue.component(MemberPicker.name, MemberPicker)
}

export default MemberPicker
