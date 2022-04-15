/**
 * Store ProfileAPI
 */

import request from '@/utils/request'

/**
 * Access to the store30Day display data
 * @returns {Promise<any>}
 */
export function getShopSurvey() {
  return request({
    url: 'seller/statistics/shop_profile/data',
    method: 'get',
    loading: false
  })
}

/**
 * Get store profile
 * @param params
 * @returns {Promise<any>}
 */
export function getShopSurveyCharts() {
  return request({
    url: 'seller/statistics/shop_profile/chart',
    method: 'get',
    loading: false
  })
}
