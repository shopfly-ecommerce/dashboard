/**
 * Search participle relatedAPI
 */

import request from '@/utils/request'

/**
 * Gets a list of custom participles
 * @param params
 */
export function getSearchKeywordsList(params) {
  return request({
    url: 'seller/goodssearch/custom-words',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Add custom participles
 * @param params
 */
export function addSearchKeyword(params) {
  return request({
    url: 'seller/goodssearch/custom-words',
    method: 'post',
    loading: false,
    params
  })
}

/**
 * Delete custom participles
 * @param id
 */
export function delSearchKeyword(id) {
  return request({
    url: `seller/goodssearch/custom-words/${id}`,
    method: 'delete',
    loading: false
  })
}

/**
 * Set the key
 * @param params
 */
export function setSecretKey(params) {
  return request({
    url: 'seller/goodssearch/custom-words/secret-key',
    method: 'put',
    loading: false,
    params
  })
}

/**
 * Search keyword history list
 * @param params
 */
export function getSearchHistoryList(params) {
  return request({
    url: 'seller/goodssearch/keywords',
    method: 'get',
    loading: false,
    params
  })
}

