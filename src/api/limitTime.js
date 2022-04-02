/**
 * 限时活动相关API
 */

import request from '@/utils/request'

/**
 * 获取限时活动列表
 * @param params
 * @returns {Promise<any>}
 */
export function getLimitTimeActivityList(params) {
  return request({
    url: 'seller/promotion/seckills',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 获取限时活动商品列表
 * @param params
 * @returns {Promise<any>}
 */
export function getLimitTimeGoodsList(params) {
  return request({
    url: 'seller/promotion/seckill-applys',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 获取限时活动详情
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getLimitTimeActivityDetails(ids, params) {
  return request({
    url: `seller/promotion/seckills/${ids}`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 查询一个限时抢购入库的已经申请的商品
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getLimitTimeAlreadyActivityDetails(ids) {
  return request({
    url: `seller/promotion/seckills/${ids}/seckill-applys`,
    method: 'get',
    loading: false
  })
}

/**
 * 限时活动报名
 * @param ids
 * @param params
 * @returns {Promise<any>}
 * @constructor
 */
export function signUpLimitTimeActivity(params) {
  return request({
    url: 'seller/promotion/seckill-applys',
    method: 'post',
    loading: false,
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * 增加限时抢购
 * @param params
 */
export function addSeckill(params) {
  return request({
    url: 'seller/promotion/seckills',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * 修改限时抢购
 * @param id
 * @param params
 */
export function editSeckill(id, params) {
  return request({
    url: `seller/promotion/seckills/${id}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * 发布限时抢购
 * @param seckill_id
 * @param params
 */
export function releaseSeckill(seckill_id, params) {
  return request({
    url: `seller/promotion/seckills/${seckill_id}/release`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}
