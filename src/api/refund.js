/**
 * Refund singleAPI
 */

import request from '@/utils/request'

/**
 * To get a refund/Invoice list
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
 * A refund/Details of the goods
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
 * Seller review and refund/Return of the goods
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
 * Seller executes refund
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
 * Warehouse operation
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
 * Obtain refund statistics
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
 * exportExcel
 * @param params
 */
export function exportRefundExcel(params) {
  return request({
    url: 'seller/after-sales/exports/excel',
    method: 'get',
    params
  })
}
