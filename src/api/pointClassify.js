/**
 * 促销相关API
 */

import request from '@/utils/request'

/**
 * 获取积分分类下级
 * @param parent_id
 */
export function getExchangeCatsChildren(parent_id = 0) {
  return request({
    url: `seller/promotion/exchange-cats/${parent_id}/children`,
    method: 'get'
  })
}

/**
 * 添加积分兑换分类
 * @param params
 */
export function addExchangeCat(params) {
  return request({
    url: 'seller/promotion/exchange-cats',
    method: 'post',
    data: params
  })
}

/**
 * 获取积分兑换分类详情
 * @param id
 */
export function getExchangeCatsDetail(id) {
  return request({
    url: `seller/promotion/exchange-cats/${id}`,
    method: 'get'
  })
}

/**
 * 编辑积分兑换分类
 * @param id
 * @param params
 */
export function editExhcangeCat(id, params) {
  return request({
    url: `seller/promotion/exchange-cats/${id}`,
    method: 'put',
    data: params
  })
}

/**
 * 删除积分兑换分类
 * @param id
 */
export function deleteExchangeCat(id) {
  return request({
    url: `seller/promotion/exchange-cats/${id}`,
    method: 'delete'
  })
}

/**
 * 获取积分商品列表
 * @param params
 */
export function getExchangeGoods(params) {
  return request({
    url: 'seller/promotion/exchange-goods',
    method: 'get',
    loading: false,
    params
  })
}
