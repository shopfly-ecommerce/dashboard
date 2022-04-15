/**
 * Time-limited activities are relatedAPI
 */

import request from '@/utils/request'

/**
 * Gets a list of time-limited activities
 * @param params
 * @returns {Promise<any>}
 */
export function getLimitTimeActivityList(params) {
  return request({
    url: 'seller/promotion/seckills',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Gets a list of time-limited active items
 * @param params
 * @returns {Promise<any>}
 */
export function getLimitTimeGoodsList(params) {
  return request({
    url: 'seller/promotion/seckill-applys',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get details of time-limited activities
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getLimitTimeActivityDetails(ids, params) {
  return request({
    url: `seller/promotion/seckills/${ids}`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Query a flash sale for an item that has been applied for storage
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getLimitTimeAlreadyActivityDetails(ids) {
  return request({
    url: `seller/promotion/seckills/${ids}/seckill-applys`,
    method: 'get',
    loading: false
  })
}

/**
 * Limited time activity registration
 * @param ids
 * @param params
 * @returns {Promise<any>}
 * @constructor
 */
export function signUpLimitTimeActivity(params) {
  return request({
    url: 'seller/promotion/seckill-applys',
    method: 'post',
    loading: false,
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * Increase flash sales
 * @param params
 */
export function addSeckill(params) {
  return request({
    url: 'seller/promotion/seckills',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * Modify flash sales
 * @param id
 * @param params
 */
export function editSeckill(id, params) {
  return request({
    url: `seller/promotion/seckills/${id}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * Issue flash sales
 * @param seckill_id
 * @param params
 */
export function releaseSeckill(seckill_id, params) {
  return request({
    url: `seller/promotion/seckills/${seckill_id}/release`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}
