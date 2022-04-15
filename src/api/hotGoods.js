/**
 * Hot selling goods relatedAPI
 */

import request from '@/utils/request'

/**
 * Number of items orderedTop30charts
 * @param params
 * @returns {Promise<any>}
 */
export function getHotGoodsNum(params) {
  return request({
    url: 'seller/statistics/goods/order_num',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Number of items orderedTop30table
 * @param params
 * @returns {Promise<any>}
 */
export function getHotGoodsNumPage(params) {
  return request({
    url: 'seller/statistics/goods/order_num_page',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Order amount and quantityTop30charts
 * @param params
 * @returns {Promise<any>}
 */
export function getHotGoodsPrice(params) {
  return request({
    url: 'seller/statistics/goods/order_price',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Order amount and quantityTop30table
 * @param params
 * @returns {Promise<any>}
 */
export function getHotGoodsPricePage(params) {
  return request({
    url: 'seller/statistics/goods/order_price_page',
    method: 'get',
    loading: false,
    params
  })
}

