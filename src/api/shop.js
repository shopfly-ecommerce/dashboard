/**
 * Store relatedAPI
 */

import request from '@/utils/request'
import cache from '@/utils/cache'

/**
 * Access to store information
 * @param params
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
 * Save store Settings
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
 * Revise the store inventory warning number
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
 * Upgrade the store level
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
 * Modify the storelogo
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
 * Get store status
 */
export function getShopStatus() {
  return request({
    url: 'seller/shops/status',
    method: 'get',
    loading: 0.2
  })
}
