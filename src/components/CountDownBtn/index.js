/**
 * Countdown module
 * Increases with the increasing choice
 */
import Vue from 'vue'
import CountDownBtn from './src/main'

CountDownBtn.install = () => {
  Vue.component(CountDownBtn.name, CountDownBtn)
}

export default CountDownBtn
