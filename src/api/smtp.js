/**
 * SMTPSet up relevantAPI
 */

import request from '@/utils/request'

/**
 * To obtainsmtpThe list of
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
 * addsmtp
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
 * editsmtp
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
 * deletesmtp
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
 * To obtainsmtpdetails
 * @param id
 */
export function getSmtpDetial(id) {
  return request({
    url: `seller/systems/smtps/${id}`,
    method: 'get'
  })
}

/**
 * Send a test email
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
