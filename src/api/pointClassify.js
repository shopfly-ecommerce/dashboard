/**
 * Sales relatedAPI
 */

import request from '@/utils/request'

/**
 * Get the sub-level of the integral classification
 * @param parent_id
 */
export function getExchangeCatsChildren(parent_id = 0) {
  return request({
    url: `seller/promotion/exchange-cats/${parent_id}/children`,
    method: 'get'
  })
}

/**
 * Add the points exchange category
 * @param params
 */
export function addExchangeCat(params) {
  return request({
    url: 'seller/promotion/exchange-cats',
    method: 'post',
    data: params
  })
}

/**
 * Get bonus point exchange classification details
 * @param id
 */
export function getExchangeCatsDetail(id) {
  return request({
    url: `seller/promotion/exchange-cats/${id}`,
    method: 'get'
  })
}

/**
 * Edit points exchange classification
 * @param id
 * @param params
 */
export function editExhcangeCat(id, params) {
  return request({
    url: `seller/promotion/exchange-cats/${id}`,
    method: 'put',
    data: params
  })
}

/**
 * Delete the points exchange category
 * @param id
 */
export function deleteExchangeCat(id) {
  return request({
    url: `seller/promotion/exchange-cats/${id}`,
    method: 'delete'
  })
}

/**
 * Gets a list of credits
 * @param params
 */
export function getExchangeGoods(params) {
  return request({
    url: 'seller/promotion/exchange-goods',
    method: 'get',
    loading: false,
    params
  })
}
