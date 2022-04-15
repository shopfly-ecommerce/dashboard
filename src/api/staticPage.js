/**
 * Static page correlationAPI
 */

import request from '@/utils/request'

/**
 * Gets the static page generation address
 */
export function getStaticPageAddress() {
  return request({
    url: 'seller/page-create/input',
    method: 'get'
  })
}

/**
 * Save the static page generation address
 * @param params
 */
export function saveStaticPageAddress(params) {
  return request({
    url: 'seller/page-create/save',
    method: 'post',
    data: params
  })
}

/**
 * Generate static pages
 * @param params
 */
export function createStaticPage(params) {
  return request({
    url: `seller/page-create/create`,
    method: 'post',
    data: params
  })
}
