/**
 * Mode of paymentAPI
 */

import request from '@/utils/request'

/**
 * Gets a list of payment methods
 * @param params
 */
export function getPaymentList(params) {
  return request({
    url: 'seller/payment/payment-methods',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Modification of payment method
 * @param payment_plugin_id Method of paymentcode
 * @param payment_method Payment method detailed configuration
 */
export function editPayment(payment_plugin_id, payment_method) {
  return request({
    url: `seller/payment/payment-methods/${payment_plugin_id}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: { ...payment_method }
  })
}

/**
 * Get details of payment method
 * @param payment_plugin_id
 */
export function getPaymentDetail(payment_plugin_id) {
  return request({
    url: `seller/payment/payment-methods/${payment_plugin_id}`,
    method: 'get'
  })
}
