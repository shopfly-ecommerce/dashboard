/**
 * Created by Andste on 2018/5/16.
 */

import request from '@/utils/request'

/**
 * 获取楼层数据
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
 * 修改楼层
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
 * 获取焦点图列表
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
 * 添加焦点图
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
 * 获取焦点图详情
 * @param id
 */
export function getFocusDetail(id) {
  return request({
    url: `seller/focus-pictures/${id}`,
    method: 'get'
  })
}

/**
 * 修改焦点图
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
 * 删除焦点图
 * @param id
 */
export function deleteFocus(id) {
  return request({
    url: `seller/focus-pictures/${id}`,
    method: 'delete'
  })
}
