/**
 * 活动相关API
 */

import request from '@/utils/request'

/**
 * 获取满减活动列表
 * @param params
 * @returns {Promise<any>}
 */
export function getFullCutActivityList(params) {
  return request({
    url: 'seller/promotion/full-discounts',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 删除满减活动
 * @param ids
 * @param params
 * @returns {Promise<any>}
 * @constructor
 */
export function deleteFullCutActivity(ids) {
  return request({
    url: `seller/promotion/full-discounts/${ids}`,
    method: 'delete',
    loading: false
  })
}

/**
 * 新增满减活动
 * @param ids
 * @param params
 * @returns {Promise<any>}
 * @constructor
 */
export function addFullCutActivity(params) {
  return request({
    url: 'seller/promotion/full-discounts',
    method: 'post',
    loading: false,
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * 修改满减活动内容
 * @param ids
 * @param params
 * @returns {Promise<any>}
 * @constructor
 */
export function saveFullCutActivity(ids, params) {
  return request({
    url: `seller/promotion/full-discounts/${ids}`,
    method: 'put',
    loading: false,
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * 获取满减单个活动详情
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getFullCutActivityDetails(ids, params) {
  return request({
    url: `seller/promotion/full-discounts/${ids}`,
    method: 'get',
    loading: false,
    data: params
  })
}

/**
 * 获取单品立减活动列表
 * @param params
 * @returns {Promise<any>}
 */
export function getSingleCutActivityList(params) {
  return request({
    url: 'seller/promotion/minus',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 删除单品立减活动
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function deleteSingleCutActivity(ids, params) {
  return request({
    url: `seller/promotion/minus/${ids}`,
    method: 'delete',
    loading: false,
    data: params
  })
}

/**
 * 新增单品立减活动
 * @param params
 * @returns {Promise<any>}
 */
export function addSingleCutActivity(params) {
  return request({
    url: 'seller/promotion/minus',
    method: 'post',
    loading: false,
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * 修改单品立减活动
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function saveSingleCutActivity(ids, params) {
  return request({
    url: `seller/promotion/minus/${ids}`,
    method: 'put',
    loading: false,
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * 获取一个单品立减活动洗详情
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getSingleCutActivityDetails(ids, params) {
  return request({
    url: `seller/promotion/minus/${ids}`,
    method: 'get',
    loading: false,
    data: params
  })
}

/**
 * 获取第二件半价活动列表
 * @param params
 * @returns {Promise<any>}
 */
export function getSecondHalfActivityList(params) {
  return request({
    url: 'seller/promotion/half-prices',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 删除第二件半价活动
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function deleteSeconedHalfActivity(ids, params) {
  return request({
    url: `seller/promotion/half-prices/${ids}`,
    method: 'delete',
    loading: false,
    data: params
  })
}

/**
 * 新增第二件半价活动
 * @param params
 * @returns {Promise<any>}
 */
export function addSeconedHalfActivity(params) {
  return request({
    url: 'seller/promotion/half-prices',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    loading: false,
    data: params
  })
}

/**
 * 修改第二件半价活动
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function saveSeconedHalfActivity(ids, params) {
  return request({
    url: `seller/promotion/half-prices/${ids}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    loading: false,
    data: params
  })
}

/**
 * 获取一个第二件半价活动详情
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getSeconedHalfActivityDetails(ids, params) {
  return request({
    url: `seller/promotion/half-prices/${ids}`,
    method: 'get',
    loading: false,
    data: params
  })
}

