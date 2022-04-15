/**
 * Collect statisticsAPI
 */

import request from '@/utils/request'

/**
 * Get the favorite chart data
 * @param params
 * @returns {Promise<any>}
 */
export function getCollectionStatistics() {
  return request({
    url: 'seller/statistics/collect/chart',
    method: 'get',
    loading: false
  })
}

/**
 * Get item list information
 * @param params
 * @returns {Promise<any>}
 */
export function getCollectionGoods(params) {
  return request({
    url: 'seller/statistics/collect/page',
    method: 'get',
    loading: false,
    params
  })
}
