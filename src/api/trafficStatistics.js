/**
 * Traffic statistical correlationAPI
 */

import request from '@/utils/request'

/**
 * Total store traffic
 * @param params
 * @returns {Promise<any>}
 */
export function getShopTraffic(params) {
  return request({
    url: 'seller/statistics/page_view/shop',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Commodity flow statistics
 * @param params
 * @returns {Promise<any>}
 */
export function getGoodsStatistics(params) {
  return request({
    url: 'seller/statistics/page_view/goods',
    method: 'get',
    loading: false,
    params
  })
}

