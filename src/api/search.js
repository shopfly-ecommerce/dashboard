/**
 * 搜索分词相关API
 */

import request from '@/utils/request'

/**
 * 获取自定义分词列表
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
 * 添加自定义分词
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
 * 删除自定义分词
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
 * 设置密钥
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
 * 搜索关键词历史列表
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

