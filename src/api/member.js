/**
 * 会员管理API
 */

import request from '@/utils/request'
import md5 from 'js-md5'

/**
 * 获取会员列表
 * @param params
 */
export function getMemberList(params) {
  return request({
    url: 'seller/members',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 添加会员
 * @param params
 */
export function addMember(params) {
  params = JSON.parse(JSON.stringify(params))
  params.password = md5(params.password)
  return request({
    url: 'seller/members',
    method: 'post',
    data: params
  })
}

/**
 * 获取会员详情
 * @param id
 */
export function getMemberDetail(id) {
  return request({
    url: `seller/members/${id}`,
    method: 'get'
  })
}

/**
 * 修改会员
 * @param id
 * @param params
 */
export function editMember(id, params) {
  if (params.password) {
    params.password = md5(params.password)
  }
  return request({
    url: `seller/members/${id}`,
    method: 'put',
    data: params
  })
}

/**
 * 删除会员
 * @param id
 */
export function deleteMember(id) {
  return request({
    url: `seller/members/${id}`,
    method: 'delete'
  })
}

/**
 * 获取会员回收站列表
 * @param params
 */
export function getRecycleMemberList(params) {
  return request({
    url: 'seller/members',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 恢复会员
 * @param id
 */
export function recycleMember(id) {
  return request({
    url: `seller/members/${id}`,
    method: 'post'
  })
}

/**
 * 获取会员收货地址列表
 * @param member_id
 * @param params
 */
export function getMemberAddress(member_id, params) {
  return request({
    url: `seller/members/addresses/${member_id}`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 获取会员咨询列表
 * @param params
 */
export function getMemberAsks(params) {
  return request({
    url: 'seller/members/asks',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 删除会员咨询
 * @param ask_id
 */
export function deleteMemberAsk(ask_id) {
  return request({
    url: `seller/members/asks/${ask_id}`,
    method: 'delete'
  })
}

/**
 * 获取会员评论列表
 * @param params
 */
export function getMemberComments(params) {
  return request({
    url: 'seller/members/comments',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 删除会员评论
 * @param comment_id
 */
export function deleteMemberComments(comment_id) {
  return request({
    url: `seller/members/comments/${comment_id}`,
    method: 'delete'
  })
}

/**
 * 修改会员消费积分
 * @param member_id
 * @param point
 */
export function editMemberConsumPoint(member_id, point) {
  return request({
    url: `seller/members/point/${member_id}`,
    method: 'put',
    data: { point }
  })
}

/**
 * 获取会员积分列表
 * @param params
 */
export function getMemberPointList(params) {
  return request({
    url: `seller/members/point/${params.member_id}`,
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
export function replyConsultationList(ask_id, params) {
  return request({
    url: `seller/members/asks/${ask_id}/reply`,
    method: 'put',
    loading: false,
    data: params
  })
}

/**
 * 审核咨询
 * @param comment_id
 */
export function examineConsultation(ask_id, params) {
  return request({
    url: `/seller/members/asks/auth/${ask_id}?auth_status=${params}`,
    method: 'post'
  })
}
