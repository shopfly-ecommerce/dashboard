/**
 * 发票相关API
 */

import request from '@/utils/request'

/**
 * 获取发票历史
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
 * 获取历史发票订单详情
 * @param id
 */
export function getHistoryReceiptDetail(id) {
  return request({
    url: `seller/members/receipts/${id}/detail`,
    method: 'get',
    loading: false
  })
}

