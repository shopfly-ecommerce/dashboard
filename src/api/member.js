/**
 * Member managementAPI
 */

import request from '@/utils/request'
import md5 from 'js-md5'

/**
 * Get membership list
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
 * Add member
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
 * Obtain Membership details
 * @param id
 */
export function getMemberDetail(id) {
  return request({
    url: `seller/members/${id}`,
    method: 'get'
  })
}

/**
 * Modify the member
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
 * Delete members
 * @param id
 */
export function deleteMember(id) {
  return request({
    url: `seller/members/${id}`,
    method: 'delete'
  })
}

/**
 * Get a list of member recycle bin
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
 * To restore the member
 * @param id
 */
export function recycleMember(id) {
  return request({
    url: `seller/members/${id}`,
    method: 'post'
  })
}

/**
 * Gets a member shipping address list
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
 * Get a list of member inquiries
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
 * Delete member consultation
 * @param ask_id
 */
export function deleteMemberAsk(ask_id) {
  return request({
    url: `seller/members/asks/${ask_id}`,
    method: 'delete'
  })
}

/**
 * Get a list of member comments
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
 * Delete member comments
 * @param comment_id
 */
export function deleteMemberComments(comment_id) {
  return request({
    url: `seller/members/comments/${comment_id}`,
    method: 'delete'
  })
}

/**
 * Modify member consumption points
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
 * Get a list of member credits
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
 * Reply to consulting
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
 * Audit consultation
 * @param comment_id
 */
export function examineConsultation(ask_id, params) {
  return request({
    url: `/seller/members/asks/auth/${ask_id}?auth_status=${params}`,
    method: 'post'
  })
}
