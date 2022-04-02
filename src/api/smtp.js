/**
 * SMTP设置相关API
 */

import request from '@/utils/request'

/**
 * 获取smtp列表
 * @param params
 */
export function getSmtpList(params) {
  return request({
    url: 'seller/systems/smtps',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 添加smtp
 * @param params
 */
export function addSmtp(params) {
  return request({
    url: 'seller/systems/smtps',
    method: 'post',
    data: params
  })
}

/**
 * 修改smtp
 * @param id
 * @param params
 */
export function editSmtp(id, params) {
  return request({
    url: `seller/systems/smtps/${id}`,
    method: 'put',
    data: params
  })
}

/**
 * 删除smtp
 * @param ids
 */
export function deleteSmtp(ids) {
  if (Array.isArray(ids)) ids = ids.join(',')
  return request({
    url: `seller/systems/smtps/${ids}`,
    method: 'delete'
  })
}

/**
 * 获取smtp详情
 * @param id
 */
export function getSmtpDetial(id) {
  return request({
    url: `seller/systems/smtps/${id}`,
    method: 'get'
  })
}

/**
 * 发送测试邮件
 * @param params
 */
export function sendTestEmail(params) {
  return request({
    url: 'seller/systems/smtps/send',
    timeout: 20000,
    method: 'post',
    data: params
  })
}
