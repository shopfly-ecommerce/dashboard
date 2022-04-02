/**
 * 热卖商品相关API
 */

import request from '@/utils/request'

/**
 * 下单商品数量排行Top30charts
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
 * 下单商品数量排行Top30table
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
 * 下单金额数量Top30charts
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
 * 下单金额数量Top30table
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

