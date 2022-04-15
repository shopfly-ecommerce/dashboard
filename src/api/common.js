/**
 * publicAPI
 */

import { api } from '~/ui-domain'
import request from '@/utils/request'
import Storage from '@/utils/storage'

/**
 * Get the image captchaURL
 * @param scene
 * @param uuid
 * @returns {string}
 */
export function getValidateCodeUrl(scene, uuid) {
  return `${api.address}/captchas/${uuid}/${scene}?rmd=${new Date().getTime()}`
}

/**
 * The refreshtoken
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
 * Get site Settings
 */
export function getSiteData() {
  return request({
    url: `${api.address}/site-show`,
    method: 'get'
  })
}
