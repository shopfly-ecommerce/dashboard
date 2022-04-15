/**
 * Created by Andste on 2018/6/28.
 * Trusted login correlationAPI
 */

import request from '@/utils/request'

/**
 * Gets the trust login parameter
 */
export function getConnect() {
  return request({
    url: 'seller/members/connect',
    method: 'get'
  })
}

/**
 * Modify the trust login parameter
 * @param type
 * @param params
 */
export function editConnect(type, params) {
  return request({
    url: `seller/members/connect/${type}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}
