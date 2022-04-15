/**
 * Created by Andste on 2018/6/29.
 * Push relatedAPI
 */

import request from '@/utils/request'

/**
 * Get push Settings
 */
export function getPushSettings() {
  return request({
    url: 'seller/systems/push',
    method: 'get'
  })
}

/**
 * Modify push Settings
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
 * Goods delivery
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
