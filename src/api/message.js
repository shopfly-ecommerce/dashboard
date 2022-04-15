/**
 * News related toAPI
 */

import request from '@/utils/request'

/**
 * Get message list
 * @param params
 * @returns {Promise<any>}
 */
export function getMsgsList(params) {
  return request({
    url: 'seller/systems/notice-logs',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Delete the message
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function deleteMsgs(ids) {
  return request({
    url: `seller/systems/notice-logs/${ids}`,
    method: 'delete',
    loading: false
  })
}

/**
 * Mark the message as read
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function signMsgs(ids) {
  return request({
    url: `seller/systems/notice-logs/${ids}/read`,
    method: 'put',
    loading: false
  })
}

/**
 * Gets a list of messages within the site
 * @param params
 */
export function getMessageList(params) {
  return request({
    url: 'seller/systems/messages',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Post new in-site messages
 * @param params
 */
export function releaseMessage(params) {
  return request({
    url: 'seller/systems/messages',
    method: 'post',
    data: params
  })
}

/**
 * Edit message template
 * @param id
 * @param params
 */
export function editMessageTemplate(id, params) {
  return request({
    url: `seller/systems/message-templates/${id}`,
    method: 'put',
    data: params
  })
}

/**
 * Gets a list of message templates
 * @param params
 */
export function getMessageTemplate(params) {
  return request({
    url: 'seller/systems/message-templates',
    method: 'get',
    loading: false,
    params
  })
}
