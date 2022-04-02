import Vue from 'vue'

import 'babel-polyfill'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import UIComponents from '../ui-components'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './permission'

// register global utility filters.
import * as filters from './filters' // global filter
// register global utility directives.
import directives from './directives/loadmore'
// register global utility mixins.
import mixin from './utils/mixin'

Vue.use(Element, {
  size: 'small',
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(directives)
Vue.use(UIComponents)
Vue.use(VueAwesomeSwiper)
Vue.use(Viewer)

// 全局注册echarts、jsonp
import echarts from 'echarts'
import china from 'echarts/map/js/china'
import axios from 'axios'
Vue.prototype.$echarts = echarts
Vue.prototype.$http = axios

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.mixin(mixin)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
