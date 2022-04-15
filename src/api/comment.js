/**
 * Comments on the managementAPI
 */

import request from '@/utils/request'

/**
 * Get a comment list
 * @param params
 * @returns {Promise<any>}
 */
export function getCommentList(params) {
  return request({
    url: 'seller/members/comments',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Merchants reply to comments
 * @param params
 * @returns {Promise<any>}
 */
export function replyComment(id, params) {
  return request({
    url: `seller/members/comments/${id}/reply`,
    method: 'post',
    data: params
  })
}
