/**
 * The invoice relevantAPI
 */

import request from '@/utils/request'

/**
 * Obtain invoice history
 * @param params
 * @returns {Promise<any>}
 */
export function getHistoryReceiptList(params) {
  return request({
    url: 'seller/members/receipts',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Obtain historical invoice order details
 * @param id
 */
export function getHistoryReceiptDetail(id) {
  return request({
    url: `seller/members/receipts/${id}/detail`,
    method: 'get',
    loading: false
  })
}

