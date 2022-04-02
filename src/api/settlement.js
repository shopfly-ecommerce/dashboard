/**
 * 结算单相关API
 */

import request from '@/utils/request'

/**
 * 获取结算账单列表
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
 * 导出结算单
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
 * 商家查看某详细账单
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
 * 查看本期账单中的订单列表或者退款单列表
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
 * 卖家对账单进行下一步操作 确认结算
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
