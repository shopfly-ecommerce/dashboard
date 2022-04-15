/**
 * Created by andste.cc@gmail.com on 2018/7/20.
 * The receipt is relevant
 */

import request from '@/utils/request'

/**
 * Get a list of receipts
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
 * Export receipt
 * @param params
 */
export function exportCollection(params) {
  return request({
    url: 'seller/trade/orders/pay-log/list',
    method: 'get',
    params
  })
}
