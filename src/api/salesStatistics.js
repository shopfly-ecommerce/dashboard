/**
 * Sales statistics correlationAPI
 */

import request from '@/utils/request'

/**
 * Get a list of sales statistics
 * @param params
 * @returns {Promise<any>}
 */
export function getSalesStatisticsNum(params) {
  return request({
    url: 'seller/statistics/reports/sales_num',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Obtain sales statistics of order amount
 * @param params
 * @returns {Promise<any>}
 */
export function getSalesStatisticsMoney(params) {
  return request({
    url: 'seller/statistics/reports/sales_money',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get sales statistics form data
 * @param params
 * @returns {Promise<any>}
 */
export function getSalesStatisticsGoodsList(params) {
  return request({
    url: 'seller/statistics/reports/sales_page',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Obtain sales statistics summary
 * @param params
 */
export function getSalesStatisticsSummary(params) {
  return request({
    url: 'seller/statistics/reports/sales_summary',
    method: 'get',
    loading: false,
    params
  })
}

