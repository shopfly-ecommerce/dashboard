/**
 * 评论管理API
 */

import request from '@/utils/request'

/**
 * 获取评论列表
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
 * 商家回复评论
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
