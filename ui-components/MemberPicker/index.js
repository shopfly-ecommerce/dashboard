/**
 * Created by Andste on 2018/5/28.
 * Member selector
 * Depends on theelement-ui
 */

import Vue from 'vue'
import MemberPicker from './src/main.vue'

MemberPicker.install = () => {
  Vue.component(MemberPicker.name, MemberPicker)
}

export default MemberPicker
