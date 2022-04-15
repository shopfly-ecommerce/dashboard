/**
 * Statistical correlationAPI
 */

import request from '@/utils/request'

/** Member analysis*/

/**
 * Get member orders
 * @param params
 */
export function getMemberOrderNum(params) {
  return request({
    url: 'seller/statistics/member/order/quantity',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Obtain member order form data
 * @param params
 */
export function getMemberOrderNumPage(params) {
  return request({
    url: 'seller/statistics/member/order/quantity/page',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get the number of items ordered by members
 * @param params
 */
export function getMemberGoodsNum(params) {
  return request({
    url: 'seller/statistics/member/order/goods/num',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Obtain the table data of the number of items ordered by members
 * @param params
 */
export function getMemberGoodsNumPage(params) {
  return request({
    url: 'seller/statistics/member/order/goods/num/page',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Obtain order amount of member
 * @param params
 */
export function getMemberPrice(params) {
  return request({
    url: 'seller/statistics/member/order/money',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Obtain order amount table data of members
 * @param params
 */
export function getMemberPricePage(params) {
  return request({
    url: 'seller/statistics/member/order/money/page',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Statistics on New Members
 * @param params
 */
export function addedMember(params) {
  return request({
    url: 'seller/statistics/member/increase/member',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * New member statistics form
 * @param params
 */
export function addedMemberPage(params) {
  return request({
    url: 'seller/statistics/member/increase/member/page',
    method: 'get',
    loading: false,
    params
  })
}
