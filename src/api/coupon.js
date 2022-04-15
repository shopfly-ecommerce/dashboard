/**
 * Coupon relatedAPI
 */

import request from '@/utils/request'

/**
 * Get a list of coupon models
 * @param params
 * @returns {Promise<any>}
 */
export function getCouponsList(params) {
  return request({
    url: 'seller/promotion/coupons',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Query the coupon list by coupon status
 * @param status 0 all1 effective2 Dead digit type
 */
export function getCouponsStatusList(status = 1) {
  return request({
    url: `/seller/promotion/coupons/${status}/list`,
    method: 'get',
    loading: false
  })
}

/**
 * Delete coupons
 * @param ids
 * @param params
 * @returns {Promise<any>}
 * @constructor
 */
export function deleteCoupons(ids, params) {
  return request({
    url: `seller/promotion/coupons/${ids}`,
    method: 'delete',
    loading: false,
    params
  })
}

/**
 * Save coupon update operation
 * @param ids
 * @param params
 * @returns {Promise<any>}
 * @constructor
 */
export function modifyCoupons(ids, params) {
  return request({
    url: `seller/promotion/coupons/${ids}`,
    method: 'put',
    loading: false,
    data: params
  })
}

/**
 * New coupons
 * @param params
 * @returns {Promise<any>}
 * @constructor
 */
export function addCoupons(params) {
  return request({
    url: 'seller/promotion/coupons',
    method: 'post',
    loading: false,
    data: params
  })
}

/**
 * Check out the details of a coupon
 * @param id
 * @param params
 * @returns {Promise<any>}
 */
export function getCouponDetails(id, params) {
  return request({
    url: `seller/promotion/coupons/${id}`,
    method: 'get',
    loading: false,
    params
  })
}
