/**
 * SMS gateway correlationAPI
 */

import request from '@/utils/request'

/**
 * Gets the list of SMS gateways
 * @param params
 */
export function getSmsGatewayList(params) {
  return request({
    url: 'seller/systems/platforms',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Modify the SMS gateway parameters
 * @param id SMS gatewayID
 * @param params SMS gateway parameters
 * @returns {*}
 */
export function editSmsGateway(id, params) {
  return request({
    url: `seller/systems/platforms/${id}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * Open SMS gateway
 * @param bean
 * @returns {*}
 */
export function openSmsGatewayById(bean) {
  return request({
    url: `seller/systems/platforms/${bean}/open`,
    method: 'put'
  })
}
