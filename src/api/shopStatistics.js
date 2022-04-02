/**
 * 店铺概况相关API
 */

import request from '@/utils/request'

/**
 * 获取店铺30天展示数据
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
 * 获取店铺概况
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
