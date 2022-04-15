/**
 * Statement relatedAPI
 */

import request from '@/utils/request'

/**
 * Get a list of billing statements
 * @param params
 * @returns {Promise<any>}
 */
export function getSettleMentList(params) {
  return request({
    url: 'seller/order/bills',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Export statement
 * @param params
 */
export function exportSettleMentExcel(id) {
  return request({
    url: `seller/order/bills/${id}/export`,
    method: 'get',
    loading: false
  })
}

/**
 * The merchant looks at a detailed bill
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getBillDetails(ids, params) {
  return request({
    url: `seller/order/bills/${ids}`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Check the order list or refund list in the current statement
 * @param id
 * @param type
 * @param params
 * @returns {Promise<any>}
 */
export function getOrderList(id, type, params) {
  return request({
    url: `seller/order/bills/${id}/${type}`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * The seller performs the next step on the bill to confirm settlement
 * @param id
 * @param params
 * @returns {Promise<any>}
 */
export function confirmSettle(id, params) {
  return request({
    url: `seller/order/bills/${id}/next`,
    method: 'put',
    loading: false,
    params
  })
}
