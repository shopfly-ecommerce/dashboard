/**
 * Storage scheme correlationAPI
 */

import request from '@/utils/request'

/**
 * Gets a list of storage schemes
 * @param params
 */
export function getStorageSolutionList(params) {
  return request({
    url: 'seller/systems/uploaders',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Edit storage scheme
 * @param bean
 * @param params
 */
export function editStorageSolution(bean, params) {
  return request({
    url: `seller/systems/uploaders/${bean}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * Gets the storage scheme configuration item
 * @param code
 * @returns {*}
 */
export function getStorageSolutionConfig(code) {
  return request({
    url: `seller/systems/uploaders/${code}/setting`,
    method: 'get'
  })
}

/**
 * Open storage scheme
 * @param bean
 * @returns {*}
 */
export function openStorageSolutionById(bean) {
  return request({
    url: `seller/systems/uploaders/${bean}/open`,
    method: 'put'
  })
}
