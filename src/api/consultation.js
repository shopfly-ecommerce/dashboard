/**
 * 咨询管理API
 */

import request from '@/utils/request'

/**
 * 获取咨询列表
 * @param params
 * @returns {Promise<any>}
 */
export function getConsultationList(params) {
  return request({
    url: 'seller/members/asks',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 回复咨询
 * @param id
 * @param params
 * @returns {Promise<any>}
 */
export function replyConsultationList(id, params) {
  return request({
    url: `seller/members/asks/${id}/reply`,
    method: 'put',
    loading: false,
    data: params
  })
}
