/**
 * Regional managementAPI
 */

import request from '@/utils/request'

/**
 * Add region
 * @param params
 */
export function addRegion(params) {
  return request({
    url: 'seller/systems/regions',
    method: 'post',
    data: params
  })
}

/**
 * Edit area
 * @param id
 * @param params
 */
export function editRegion(id, params) {
  return request({
    url: `seller/systems/regions/${id}`,
    method: 'put',
    data: params
  })
}

/**
 * Delete the region
 * @param id
 */
export function deleteRegion(id) {
  return request({
    url: `seller/systems/regions/${id}`,
    method: 'delete'
  })
}

