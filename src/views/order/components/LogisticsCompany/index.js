/**
 * 物流公司
 */
import Vue from 'vue'
import LogisticsCompany from './main'

LogisticsCompany.install = () => {
  Vue.component(LogisticsCompany.name, LogisticsCompany)
}

export default LogisticsCompany
