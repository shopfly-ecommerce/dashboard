/**
 * Created by Andste on 2018/5/16.
 */

import request from '@/utils/request'

/**
 * Get floor data
 * @param client_type
 * @param page_type
 */
export function getFloor(client_type, page_type) {
  return request({
    url: `seller/pages/${client_type}/${page_type}`,
    method: 'get'
  })
}

/**
 * Modify the floor
 * @param client_type
 * @param page_type
 * @param params
 */
export function editFloor(client_type, page_type, params) {
  return request({
    url: `seller/pages/${client_type}/${page_type}`,
    method: 'put',
    data: params
  })
}

/**
 * Gets a list of focus diagrams
 * @param client_type
 */
export function getFocus(client_type) {
  return request({
    url: 'seller/focus-pictures',
    method: 'get',
    params: { client_type }
  })
}

/**
 * Add focus diagram
 * @param params
 */
export function addFocus(params) {
  return request({
    url: 'seller/focus-pictures',
    method: 'post',
    data: params
  })
}

/**
 * Get focus map details
 * @param id
 */
export function getFocusDetail(id) {
  return request({
    url: `seller/focus-pictures/${id}`,
    method: 'get'
  })
}

/**
 * Modify focus diagram
 * @param id
 * @param params
 */
export function editFocus(id, params) {
  return request({
    url: `seller/focus-pictures/${id}`,
    method: 'put',
    data: params
  })
}

/**
 * Delete focus diagram
 * @param id
 */
export function deleteFocus(id) {
  return request({
    url: `seller/focus-pictures/${id}`,
    method: 'delete'
  })
}
