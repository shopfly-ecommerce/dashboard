/**
 * Created by Andste on 2018/8/8.
 */

import request from '@/utils/request'

/**
 * 获取店员列表
 * @param params
 */
export function getShopAssistantList(params) {
  return request({
    url: 'seller/shops/clerks',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 修改店员
 * @param id
 * @param params
 */
export function editShopAssistant(id, params) {
  return request({
    url: `seller/shops/clerks/${id}`,
    method: 'put',
    data: params
  })
}

/**
 * 删除店员
 * @param id
 */
export function deleteShopAssistant(id) {
  return request({
    url: `seller/shops/clerks/${id}`,
    method: 'delete'
  })
}

/**
 * 恢复店员
 * @param id
 */
export function recoveryShopAssistant(id) {
  return request({
    url: `seller/shops/clerks/${id}/recovery`,
    method: 'put'
  })
}

/**
 * 获取角色列表
 * @param params
 */
export function getRoleList(params) {
  return request({
    url: 'seller/systems/roles',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 添加角色
 * @param params
 */
export function addRole(params) {
  return request({
    url: 'seller/systems/roles',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * 获取角色权限
 * @param id
 */
export function getRoleDetail(id) {
  return request({
    url: `seller/systems/roles/${id}`,
    method: 'get'
  })
}

/**
 * 修改角色权限
 * @param id
 * @param params
 */
export function editRole(id, params) {
  return request({
    url: `seller/systems/roles/${id}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * 删除角色
 * @param id
 */
export function deleteRole(id) {
  return request({
    url: `seller/systems/roles/${id}`,
    method: 'delete'
  })
}

/**
 * 获取短信验证码
 * @param mobile
 * @param params
 */
export function getSmsCode(mobile, params) {
  return request({
    url: `/seller/shops/clerks/sms-code/${mobile}`,
    method: 'post',
    data: params
  })
}

/**
 * 验证手机号
 * @param params
 * @param mobile
 */
export function valiPhone(mobile, params) {
  return request({
    url: `/seller/shops/clerks/check/${mobile}`,
    method: 'get',
    params
  })
}

/**
 * 添加老会员
 * @param params
 */
export function addOldMember(params) {
  return request({
    url: `/seller/shops/clerks/old`,
    method: 'post',
    data: params
  })
}

/**
 * 添加新会员
 * @param params
 */
export function addNewMember(params) {
  return request({
    url: `/seller/shops/clerks/new`,
    method: 'post',
    data: params
  })
}

/**
 * 获取角色具体权限
 * @param id
 */
export function getRolePermission(id) {
  return request({
    url: `seller/systems/roles/${id}`,
    method: 'get'
  })
}

/**
 * 获取管理员列表
 * @param params
 */
export function getAdministratorList(params) {
  return request({
    url: 'seller/systems/manager/admin-users',
    method: 'get',
    loaidng: false,
    params
  })
}

/**
 * 添加管理员
 * @param params
 */
export function addAdministrator(params) {
  return request({
    url: 'seller/systems/manager/admin-users',
    method: 'post',
    data: params
  })
}

/**
 * 修改管理员
 * @param id
 * @param parmas
 */
export function editAdministrator(id, parmas) {
  return request({
    url: `seller/systems/manager/admin-users/${id}`,
    method: 'put',
    data: parmas
  })
}

/**
 * 删除管理员
 * @param id
 */
export function deleteAdministrator(id) {
  return request({
    url: `seller/systems/manager/admin-users/${id}`,
    method: 'delete'
  })
}
