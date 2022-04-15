/**
 * Statistical correlationAPI
 */

import request from '@/utils/request'

/** Industry analysis*/

/**
 * Obtain industry scale order quantity
 * @param params
 */
export function getIndustryScaleOrder(params) {
  return request({
    url: 'seller/statistics/industry/order/quantity',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Obtain the quantity of goods ordered by industry scale
 * @param params
 */
export function getIndustryScaleGoods(params) {
  return request({
    url: 'seller/statistics/industry/goods/num',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Obtain industry scale order amount
 * @param params
 */
export function getIndustryScalePrice(params) {
  return request({
    url: 'seller/statistics/industry/order/money',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get the summary overview data
 * @param params
 */
export function getGeneralityOverviewData(params) {
  return request({
    url: 'seller/statistics/industry/overview',
    method: 'get',
    loading: false,
    params
  })
}

/** Traffic analysis*/
/**
 * Obtain store traffic data
 * @param params
 */
export function getTrafficAnalysisShop(params) {
  return request({
    url: 'seller/statistics/page_view/shop',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Obtain commodity flow data
 * @param params
 */
export function getTrafficAnalysisGoods(params) {
  return request({
    url: 'seller/statistics/page_view/goods',
    method: 'get',
    loading: false,
    params
  })
}
