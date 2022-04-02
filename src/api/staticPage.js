/**
 * 静态页相关API
 */

import request from '@/utils/request'

/**
 * 获取静态页生成地址
 */
export function getStaticPageAddress() {
  return request({
    url: 'seller/page-create/input',
    method: 'get'
  })
}

/**
 * 保存静态页生成地址
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
 * 生成静态页
 * @param params
 */
export function createStaticPage(params) {
  return request({
    url: `seller/page-create/create`,
    method: 'post',
    data: params
  })
}
