/**
 * 统计相关API
 */

import request from '@/utils/request'

/** 会员分析 */

/**
 * 获取会员下单量
 * @param params
 */
export function getMemberOrderNum(params) {
  return request({
    url: 'seller/statistics/member/order/quantity',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 获取会员下单量表格数据
 * @param params
 */
export function getMemberOrderNumPage(params) {
  return request({
    url: 'seller/statistics/member/order/quantity/page',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 获取会员下单商品数
 * @param params
 */
export function getMemberGoodsNum(params) {
  return request({
    url: 'seller/statistics/member/order/goods/num',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 获取会员下单商品数表格数据
 * @param params
 */
export function getMemberGoodsNumPage(params) {
  return request({
    url: 'seller/statistics/member/order/goods/num/page',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 获取会员下单金额
 * @param params
 */
export function getMemberPrice(params) {
  return request({
    url: 'seller/statistics/member/order/money',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 获取会员下单金额表格数据
 * @param params
 */
export function getMemberPricePage(params) {
  return request({
    url: 'seller/statistics/member/order/money/page',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 新增会员统计
 * @param params
 */
export function addedMember(params) {
  return request({
    url: 'seller/statistics/member/increase/member',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 新增会员统计表格
 * @param params
 */
export function addedMemberPage(params) {
  return request({
    url: 'seller/statistics/member/increase/member/page',
    method: 'get',
    loading: false,
    params
  })
}
