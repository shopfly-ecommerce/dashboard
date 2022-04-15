import request from '@/utils/request'
import Storage from '@/utils/storage'
import { api } from '~/ui-domain'
import md5 from 'js-md5'

/**
 * Normal login
 * @param params
 */
export function login(params) {
  params.password = md5(params.password)
  return request({
    url: `seller/login`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Phone number login
 * @param mobile
 * @param sms_code
 * @param uuid
 */
export function loginByMobile(mobile, sms_code, uuid) {
  return request({
    url: `seller/login/login/${mobile}`,
    method: 'get',
    params: {
      sms_code,
      uuid
    }
  })
}

/**
 * Send the mobile login verification code
 * @param mobile
 * @param captcha
 * @param uuid
 */
export function sendLoginSms(mobile, captcha, uuid) {
  return request({
    url: `seller/login/smscode/${mobile}`,
    method: 'post',
    data: {
      captcha,
      uuid
    }
  })
}

/**
 * Withdraw from the account
 * @returns {*}
 */
export function logout() {
  return request({
    url: `seller/members/logout?uid=${Storage.getItem('seller_uid')}`,
    method: 'post'
  })
}

/**
 * Gets user role permissions
 * @param role_id
 * @returns {*}
 */
export function getUserRolesPermissions(role_id) {
  return request({
    url: `seller/systems/roles/${role_id}/checked`,
    method: 'get'
  })
}

