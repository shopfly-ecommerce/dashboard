/**
 * Created by andste.cc@gmail.com on 2018/7/20.
 * 收款单相关
 */

import request from '@/utils/request'

/**
 * 获取收款单列表
 * @param params
 */
export function getCollectionList(params) {
  return request({
    url: 'seller/trade/orders/pay-log',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 导出收款单
 * @param params
 */
export function exportCollection(params) {
  return request({
    url: 'seller/trade/orders/pay-log/list',
    method: 'get',
    params
  })
}
