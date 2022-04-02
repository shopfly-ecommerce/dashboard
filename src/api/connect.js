/**
 * Created by Andste on 2018/6/28.
 * 信任登录相关API
 */

import request from '@/utils/request'

/**
 * 获取信任登录参数
 */
export function getConnect() {
  return request({
    url: 'seller/members/connect',
    method: 'get'
  })
}

/**
 * 修改信任登录参数
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
