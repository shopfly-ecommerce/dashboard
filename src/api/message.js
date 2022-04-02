/**
 * 消息相关API
 */

import request from '@/utils/request'

/**
 * 获取消息列表
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
 * 删除消息
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
 * 标记消息为已读
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
 * 获取站内消息列表
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
 * 发布新的站内消息
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
 * 编辑消息模板
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
 * 获取消息模板列表
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
