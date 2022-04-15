/**
 * System Settings
 */

import request from '@/utils/request'
import qs from 'qs'

/**
 * Get site Settings
 */
export function getSiteSetting() {
  return request({
    url: 'seller/settings/site',
    method: 'get',
    loading: false
  })
}

/**
 * Modify site Settings
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
 * Get the integral setting
 */
export function getPointSetting() {
  return request({
    url: 'seller/settings/point',
    method: 'get'
  })
}

/**
 * Modify the integral Settings
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
 * Get Contact Information
 */
export function getContactSettings() {
  return request({
    url: 'seller/settings/info',
    method: 'get'
  })
}

/**
 * Modify contact information
 * @param params
 */
export function editContactSettings(params) {
  return request({
    url: `seller/settings/info?${qs.stringify(params)}`,
    method: 'put'
  })
}
