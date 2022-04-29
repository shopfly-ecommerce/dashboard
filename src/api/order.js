/**
 * Order relatedAPI
 */

import request from '@/utils/request'

/**
 * Get order list
 * @param params
 * @returns {Promise<any>}
 */
export function getOrderList(params) {
  return request({
    url: 'seller/trade/orders',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * According to the ordersnObtain order details
 * @param sn
 * @returns {Promise<any>}
 */
export function getOrderDetail(sn) {
  return request({
    url: `seller/trade/orders/${sn}`,
    method: 'get',
    loading: false
  })
}

/**
 * Adjust the price
 * @param sn
 * @returns {Promise<any>}
 */
export function updateOrderPrice(sn, params) {
  return request({
    url: `seller/trade/orders/${sn}/price`,
    method: 'put',
    loading: false,
    data: params
  })
}

/**
 * Modify consignee information
 * @param sn
 * @param params
 * @returns {Promise<any>}
 */
export function updateConsigneeInfo(sn, params) {
  return request({
    url: `seller/trade/orders/${sn}/address`,
    method: 'put',
    loading: false,
    data: params
  })
}

/**
 * Confirm receipt
 * @param sn
 * @param params
 * @returns {Promise<any>}
 */
export function confirmGetAmount(sn, params) {
  return request({
    url: `seller/trade/orders/${sn}/pay`,
    method: 'post',
    loading: false,
    data: params
  })
}

/**
 * The delivery
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function deliveryGoods(sn, params) {
  return request({
    url: `seller/trade/orders/${sn}/delivery`,
    method: 'post',
    loading: false,
    data: params
  })
}

/**
 * Check express logistics information
 * @param params
 * @returns {Promise<any>}
 */
export function getLogisticsInfo(params) {
  return request({
    url: `seller/express`,
    method: 'get',
    params
  })
}

/**
 * Generate an electron plane
 * @param params
 * @returns {Promise<any>}
 */
export function generateElectronicSurface(params) {
  return request({
    url: `seller/waybill`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Obtain order flow chart data
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getStepList(ids) {
  return request({
    url: `seller/trade/orders/${ids}/flow`,
    method: 'get',
    loading: false
  })
}

/**
 * Get order Settings
 */
export function getOrderSettings() {
  return request({
    url: 'seller/trade/orders/setting',
    method: 'get'
  })
}

/**
 * Modify order Settings
 * @param params
 */
export function editOrderSettings(params) {
  return request({
    url: 'seller/trade/orders/setting',
    method: 'post',
    data: params
  })
}

/**
 * Export orders
 * @param params
 */
export function exportOrders(params) {
  return request({
    url: 'seller/trade/orders/export',
    method: 'get',
    timeout: 0,
    params
  })
}

/**
 * Confirm receipt
 * @param order_sn
 * @param pay_price
 */
export function confirmPay(order_sn, pay_price) {
  return request({
    url: `seller/trade/orders/${order_sn}/pay`,
    method: 'post',
    data: { pay_price }
  })
}

/**
 * Cancel the order
 * @param order_sn
 */
export function cancleOrder(order_sn) {
  return request({
    url: `seller/trade/orders/${order_sn}/canceled`,
    method: 'post'
  })
}
