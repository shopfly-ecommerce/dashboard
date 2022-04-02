/**
 * Created by Andste on 2018/6/29.
 * 推送相关API
 */

import request from '@/utils/request'

/**
 * 获取推送设置
 */
export function getPushSettings() {
  return request({
    url: 'seller/systems/push',
    method: 'get'
  })
}

/**
 * 修改推送设置
 * @param params
 */
export function editPushSettings(params) {
  return request({
    url: 'seller/systems/push',
    method: 'put',
    data: params
  })
}

/**
 * 商品推送
 * @param title
 * @param goods_ids
 */
export function pushGoods(title, goods_ids) {
  return request({
    url: `seller/systems/push/${goods_ids}`,
    method: 'get',
    params: { title }
  })
}
