/**
 * Created by Andste on 2018/8/8.
 */

import request from '@/utils/request'

/**
 * Get a list of shop assistants
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
 * Modify the clerk
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
 * To delete a clerk
 * @param id
 */
export function deleteShopAssistant(id) {
  return request({
    url: `seller/shops/clerks/${id}`,
    method: 'delete'
  })
}

/**
 * Restore the clerk
 * @param id
 */
export function recoveryShopAssistant(id) {
  return request({
    url: `seller/shops/clerks/${id}/recovery`,
    method: 'put'
  })
}

/**
 * Get a list of roles
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
 * Adding roles
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
 * Get role permissions
 * @param id
 */
export function getRoleDetail(id) {
  return request({
    url: `seller/systems/roles/${id}`,
    method: 'get'
  })
}

/**
 * Modify role permissions
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
 * Delete the role
 * @param id
 */
export function deleteRole(id) {
  return request({
    url: `seller/systems/roles/${id}`,
    method: 'delete'
  })
}

/**
 * Get the SMS verification code
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
 * Verify the phone number
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
 * Add old members
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
 * Add new members
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
 * Gets role-specific permissions
 * @param id
 */
export function getRolePermission(id) {
  return request({
    url: `seller/systems/roles/${id}`,
    method: 'get'
  })
}

/**
 * Get the list of administrators
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
 * Add administrator
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
 * Modify administrator
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
 * Delete administrator
 * @param id
 */
export function deleteAdministrator(id) {
  return request({
    url: `seller/systems/manager/admin-users/${id}`,
    method: 'delete'
  })
}
