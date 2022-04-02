/**
 * 公共API
 */

import { api } from '~/ui-domain'
import request from '@/utils/request'
import Storage from '@/utils/storage'

/**
 * 获取图片验证码URL
 * @param scene
 * @param uuid
 * @returns {string}
 */
export function getValidateCodeUrl(scene, uuid) {
  return `${api.base}/captchas/${uuid}/${scene}?rmd=${new Date().getTime()}`
}

/**
 * 刷新token
 */
export function refreshToken() {
  return request({
    url: 'seller/check/token',
    method: 'post',
    data: {
      refresh_token: Storage.getItem('seller_refresh_token')
    }
  })
}

/**
 * 获取站点设置
 */
export function getSiteData() {
  return request({
    url: `${api.base}/site-show`,
    method: 'get'
  })
}
