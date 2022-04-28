/**
 * 店铺相关API
 */

import request from '@/utils/request'

/**
 * 获取店铺信息
 * @returns {Promise<any>}
 */
export function getShopData() {
  return request({
    url: 'seller/settings/site',
    method: 'get',
    loading: false
  })
}

/**
 * 保存店铺设置
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function saveShopSettings(params) {
  return request({
    url: 'seller/shops',
    method: 'put',
    loading: false,
    data: params
  })
}

/**
 * 修改店铺库存预警数
 * @param params
 * @returns {Promise<any>}
 */
export function saveStockWarningNum(params) {
  return request({
    url: 'seller/shops/warning-counts',
    method: 'put',
    loading: false,
    data: params
  })
}

/**
 * 提升店铺等级
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function promoteShopGrade(ids, params) {
  return request({
    url: `http://www.andste.cc/mock/5aa72c080d9d060b4b99b45b/seller/settings/shop/grade/${ids}`,
    method: 'post',
    data: params
  })
}

/**
 * 修改店铺logo
 * @param params
 * @returns {Promise<any>}
 */
export function updateShopLogo(params) {
  return request({
    url: 'seller/shops/logos',
    method: 'put',
    data: params
  })
}

/**
 * 获取店铺状态
 */
export function getShopStatus() {
  return request({
    url: 'seller/shops/status',
    method: 'get',
    loading: 0.2
  })
}

/**
 * Get shop ship templates
 * @param params
 * @returns {*|Promise<unknown>}
 */
export function getShipTemplates(params) {
  return request({
    url: `/seller/shops/ship-templates`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Add ship template
 * @param data
 * @returns {*|Promise<unknown>}
 */
export function addShipTemplates(data) {
  return request({
    url: `/seller/shops/ship-templates`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

/**
 * Get ship template detail
 * @param id
 * @returns {*|Promise<unknown>}
 */
export function getShipTemplateDetail(id) {
  return request({
    url: `/seller/shops/ship-templates/${id}`,
    method: 'get'
  })
}

/**
 * Update ship template
 * @param id
 * @param data
 * @returns {*|Promise<unknown>}
 */
export function updateShipTemplate(id, data) {
  return request({
    url: `/seller/shops/ship-templates/${id}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

/**
 * Delete ship template
 * @param id
 * @returns {*|Promise<unknown>}
 */
export function deleteShipTemplate(id) {
  return request({
    url: `/seller/shops/ship-templates/${id}`,
    method: 'delete'
  })
}

