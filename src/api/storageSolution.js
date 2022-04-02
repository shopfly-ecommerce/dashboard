/**
 * 储存方案相关API
 */

import request from '@/utils/request'

/**
 * 获取储存方案列表
 * @param params
 */
export function getStorageSolutionList(params) {
  return request({
    url: 'seller/systems/uploaders',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 编辑储存方案
 * @param bean
 * @param params
 */
export function editStorageSolution(bean, params) {
  return request({
    url: `seller/systems/uploaders/${bean}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * 获取储存方案配置项
 * @param code
 * @returns {*}
 */
export function getStorageSolutionConfig(code) {
  return request({
    url: `seller/systems/uploaders/${code}/setting`,
    method: 'get'
  })
}

/**
 * 开启储存方案
 * @param bean
 * @returns {*}
 */
export function openStorageSolutionById(bean) {
  return request({
    url: `seller/systems/uploaders/${bean}/open`,
    method: 'put'
  })
}
