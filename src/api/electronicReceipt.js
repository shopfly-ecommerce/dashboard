/**
 * 电子面单相关API
 */

import request from '@/utils/request'

/**
 * 获取电子面单列表
 * @param params
 */
export function getElectronicReceiptList(params) {
  return request({
    url: 'seller/systems/waybills',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 获取电子面单详情
 * @param bean
 */
export function getElectronicReceiptDetail(bean) {
  return request({
    url: `seller/systems/waybills/${bean}`,
    method: 'get'
  })
}

/**
 * 编辑电子面单
 * @param bean
 * @param params
 */
export function editElectronicReceipt(bean, params) {
  return request({
    url: `seller/systems/waybills/${bean}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * 开启电子面单
 * @param bean
 */
export function openElectronicReceipt(bean) {
  return request({
    url: `seller/systems/waybills/${bean}/open`,
    method: 'put'
  })
}
