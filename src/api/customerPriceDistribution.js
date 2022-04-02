/**
 * 统计相关API
 */

import request from '@/utils/request'

/** 其它统计 */

/**
 * 获取客单价分布
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
 * 获取购买时段分布
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
 * 获取购买频次数据
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
