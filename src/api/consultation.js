/**
 * Management consultingAPI
 */

import request from '@/utils/request'

/**
 * Get a consultation list
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
 * Reply to consulting
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
