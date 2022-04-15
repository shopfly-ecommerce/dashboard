/**
 * Logistics company
 */
import Vue from 'vue'
import LogisticsCompany from './main'

LogisticsCompany.install = () => {
  Vue.component(LogisticsCompany.name, LogisticsCompany)
}

export default LogisticsCompany
