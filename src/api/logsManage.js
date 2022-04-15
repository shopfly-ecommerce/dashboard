/**
 * Logs relatedAPI
 */

import request from '@/utils/request'

/**
 * Get log list
 * @param params
 * @returns {Promise<any>}
 */
export function getLogsList(params) {
  return request({
    url: 'http://www.andste.cc/mock/5aa72c080d9d060b4b99b45b/seller/logs/list',
    method: 'get',
    loading: false,
    params
  })
}
