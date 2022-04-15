import request from '@/utils/request'

/**
 * Get the purchase analysis purchase time distribution list
 * @param params
 * @returns {Promise<any>}
 */
export function getbuyAnyalysisPeriodList(params) {
  return request({
    url: 'seller/statistics/reports/purchase/period',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get the distribution list of purchase analysis customers
 * @param params
 * @returns {Promise<any>}
 */
export function getbuyAnyalysisRangesList(params) {
  return request({
    url: 'seller/statistics/reports/purchase/ranges',
    method: 'get',
    loading: false,
    params
  })
}
