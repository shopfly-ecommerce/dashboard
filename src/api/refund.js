/**
 * 退款单API
 */

import request from '@/utils/request'

/**
 * 获取退款/货单列表
 * @param params
 * @returns {Promise<any>}
 */
export function getRefundList(params) {
  return request({
    url: 'seller/after-sales/refunds',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 退款/货 详情
 * @param sn
 * @returns {Promise<any>}
 */
export function getRefundDetails(sn) {
  return request({
    url: `seller/after-sales/refunds/${sn}`,
    method: 'get',
    loading: false
  })
}

/**
 * 卖家审核退款/退货
 * @param sn
 * @param params
 * @returns {Promise<any>}
 */
export function refundAuth(sn, params) {
  return request({
    url: `seller/after-sales/audits/${sn}`,
    method: 'post',
    loading: false,
    data: params
  })
}

/**
 * 卖家执行退款
 * @param sn
 * @param params
 * @returns {Promise<any>}
 */
export function toRefund(sn, params) {
  return request({
    url: `seller/after-sales/refunds/${sn}`,
    method: 'post',
    loading: false,
    data: params
  })
}

/**
 * 入库操作
 * @param sn
 * @param params
 * @returns {Promise<any>}
 * @constructor
 */
export function wareHousing(sn, params) {
  return request({
    url: `seller/after-sales/stock-ins/${sn}`,
    method: 'post',
    loading: false,
    data: params
  })
}

/**
 * 获取退款统计
 * @param params
 */
export function getRefundStatistics(params) {
  return request({
    url: 'seller/statistics/order/return/money',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 导出Excel
 * @param params
 */
export function exportRefundExcel(params) {
  return request({
    url: 'seller/after-sales/exports/excel',
    method: 'get',
    params
  })
}
