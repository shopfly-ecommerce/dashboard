/**
 * Popular keywords are relevantAPI
 */

import request from '@/utils/request'

/**
 * Get the hot keywords
 * @param params
 */
export function getHotKeywords(params) {
  return request({
    url: 'seller/pages/hot-keywords',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Add hot keywords
 * @param params
 */
export function addHotKeywords(params) {
  return request({
    url: 'seller/pages/hot-keywords',
    method: 'post',
    data: params
  })
}

/**
 * Get hot keyword details
 * @param id
 */
export function getHotKeywordsDetail(id) {
  return request({
    url: `seller/pages/hot-keywords/${id}`,
    method: 'get'
  })
}

/**
 * Modify hot keywords
 * @param id
 * @param params
 */
export function editHotKeywords(id, params) {
  return request({
    url: `seller/pages/hot-keywords/${id}`,
    method: 'put',
    data: params
  })
}

/**
 * Delete hot keywords
 * @param id
 */
export function deleteHotKeywords(id) {
  return request({
    url: `seller/pages/hot-keywords/${id}`,
    method: 'delete'
  })
}
