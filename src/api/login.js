import request from '@/utils/request'
import Storage from '@/utils/storage'
import { api } from '~/ui-domain'
import md5 from 'js-md5'

/**
 * 普通登录
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
 * 手机号登录
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
 * 发送手机登录验证码
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
 * 退出账户
 * @returns {*}
 */
export function logout() {
  return request({
    url: `seller/members/logout?uid=${Storage.getItem('seller_uid')}`,
    method: 'post'
  })
}

/**
 * 获取用户角色权限
 * @param role_id
 * @returns {*}
 */
export function getUserRolesPermissions(role_id) {
  return request({
    url: `seller/systems/roles/${role_id}/checked`,
    method: 'get'
  })
}

