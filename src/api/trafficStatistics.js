/**
 * 流量统计相关API
 */

import request from '@/utils/request'

/**
 * 店铺总流量
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
 * 商品流量统计
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

