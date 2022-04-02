/**
 * 系统设置
 */

import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取站点设置
 */
export function getSiteSetting() {
  return request({
    url: 'seller/settings/site',
    method: 'get',
    loading: false
  })
}

/**
 * 修改站点设置
 * @param params
 */
export function editSiteSetting(params) {
  return request({
    url: 'seller/settings/site',
    method: 'put',
    data: params
  })
}

/**
 * 获取积分设置
 */
export function getPointSetting() {
  return request({
    url: 'seller/settings/point',
    method: 'get'
  })
}

/**
 * 修改积分设置
 * @param params
 */
export function editPointSetting(params) {
  return request({
    url: 'seller/settings/point',
    method: 'put',
    data: params
  })
}

/**
 * 获取联系方式
 */
export function getContactSettings() {
  return request({
    url: 'seller/settings/info',
    method: 'get'
  })
}

/**
 * 修改联系方式
 * @param params
 */
export function editContactSettings(params) {
  return request({
    url: `seller/settings/info?${qs.stringify(params)}`,
    method: 'put'
  })
}
