/**
 * Merchandise managementAPI
 */

import request from '@/utils/request'

/**
 * Get a list of freebies
 * @param params
 * @returns {Promise<any>}
 */
export function getGiftsList(params) {
  return request({
    url: 'seller/promotion/full-discount-gifts',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get a full list of freebies
 */
export function getGiftsAllList() {
  return request({
    url: 'seller/promotion/full-discount-gifts/all',
    method: 'get',
    loading: false
  })
}

/**
 * Delete the gifts
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function deleteGifts(ids) {
  return request({
    url: `seller/promotion/full-discount-gifts/${ids}`,
    method: 'delete',
    loading: false
  })
}

/**
 * Save gift updates
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function saveGifts(ids, params) {
  return request({
    url: `seller/promotion/full-discount-gifts/${ids}`,
    method: 'put',
    loading: false,
    data: params
  })
}

/**
 * New gift
 * @param params
 * @returns {Promise<any>}
 */
export function addGifts(params) {
  return request({
    url: 'seller/promotion/full-discount-gifts',
    method: 'post',
    loading: false,
    data: params
  })
}

/**
 * Inquire about details of a gift
 * @param id
 * @param params
 * @returns {Promise<any>}
 */
export function getGiftDetails(id, params) {
  return request({
    url: `seller/promotion/full-discount-gifts/${id}`,
    method: 'get',
    loading: false,
    params
  })
}
