/**
 * 倒计时组件
 * 随选随用
 */
import Vue from 'vue'
import CountDownBtn from './src/main'

CountDownBtn.install = () => {
  Vue.component(CountDownBtn.name, CountDownBtn)
}

export default CountDownBtn
