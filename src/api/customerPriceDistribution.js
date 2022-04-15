/**
 * Statistical correlationAPI
 */

import request from '@/utils/request'

/** Other statistics*/

/**
 * Get customer unit price distribution
 * @param params
 */
export function getOrderPriceDistribution(params) {
  return request({
    url: 'seller/statistics/order/unit/price',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get the purchase time distribution
 * @param params
 */
export function getBuyTimeDistribution(params) {
  return request({
    url: 'seller/statistics/order/unit/time',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get the purchase frequency data
 * @param params
 */
export function getBuyFrequency(params) {
  return request({
    url: 'seller/statistics/order/unit/num',
    method: 'get',
    loading: false,
    params
  })
}
