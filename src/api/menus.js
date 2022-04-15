/**
 * Menu management relatedAPI
 */

import request from '@/utils/request'

/**
 * Access to the menu
 * @param parent_id
 */
export function getMenusChildren(parent_id = 0) {
  return request({
    url: `seller/systems/menus/${parent_id}/children`,
    method: 'get',
    params: { parent_id }
  })
}

/**
 * Add menu
 * @param params
 */
export function addMenu(params) {
  return request({
    url: 'seller/systems/menus',
    method: 'post',
    data: params
  })
}

/**
 * Modify the menu
 * @param id
 * @param params
 */
export function editMenu(id, params) {
  return request({
    url: `seller/systems/menus/${id}`,
    method: 'put',
    data: params
  })
}

/**
 * Delete menu
 * @param id
 */
export function deleteMenu(id) {
  return request({
    url: `seller/systems/menus/${id}`,
    method: 'delete'
  })
}
