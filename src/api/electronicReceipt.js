/**
 * Electron plane dependenceAPI
 */

import request from '@/utils/request'

/**
 * Gets the electronic surface list
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
 * Get e-menu details
 * @param bean
 */
export function getElectronicReceiptDetail(bean) {
  return request({
    url: `seller/systems/waybills/${bean}`,
    method: 'get'
  })
}

/**
 * Edit electronic menu
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
 * Turn on the electronic plane
 * @param bean
 */
export function openElectronicReceipt(bean) {
  return request({
    url: `seller/systems/waybills/${bean}/open`,
    method: 'put'
  })
}
