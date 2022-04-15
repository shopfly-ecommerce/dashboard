/**
 * Express relatedAPI
 */

import request from '@/utils/request'

/**
 * Get a list of delivery platforms
 * @param params
 */
export function getExpressPlatformList(params) {
  return request({
    url: 'seller/systems/express-platforms',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Modify the express delivery platform
 * @param bean
 * @param params
 */
export function editExpressPlatform(bean, params) {
  return request({
    url: `seller/systems/express-platforms/${bean}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * Get the detailed configuration of the delivery platform
 * @param bean
 */
export function getExpressPlatformDetail(bean) {
  return request({
    url: `seller/systems/express-platforms/${bean}`,
    method: 'get'
  })
}

/**
 * Open express delivery platform
 * @param bean
 */
export function openExpressPlatformById(bean) {
  return request({
    url: `seller/systems/express-platforms/${bean}/open`,
    method: 'put'
  })
}
