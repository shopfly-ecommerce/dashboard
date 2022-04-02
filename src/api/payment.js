/**
 * 支付方式相关API
 */

import request from '@/utils/request'

/**
 * 获取支付方式列表
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
 * 修改支付方式
 * @param payment_plugin_id 支付方式code
 * @param payment_method 支付方式详细配置
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
 * 获取支付方式详情
 * @param payment_plugin_id
 */
export function getPaymentDetail(payment_plugin_id) {
  return request({
    url: `seller/payment/payment-methods/${payment_plugin_id}`,
    method: 'get'
  })
}
