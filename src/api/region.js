/**
 * 地区管理相关API
 */

import request from '@/utils/request'

/**
 * 添加地区
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
 * 编辑地区
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
 * 删除地区
 * @param id
 */
export function deleteRegion(id) {
  return request({
    url: `seller/systems/regions/${id}`,
    method: 'delete'
  })
}

