/**
 * 热门关键字相关API
 */

import request from '@/utils/request'

/**
 * 获取热门关键字
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
 * 添加热门关键字
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
 * 获取热门关键字详情
 * @param id
 */
export function getHotKeywordsDetail(id) {
  return request({
    url: `seller/pages/hot-keywords/${id}`,
    method: 'get'
  })
}

/**
 * 修改热门关键字
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
 * 删除热门关键词
 * @param id
 */
export function deleteHotKeywords(id) {
  return request({
    url: `seller/pages/hot-keywords/${id}`,
    method: 'delete'
  })
}
