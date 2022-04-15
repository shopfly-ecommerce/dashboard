/**
 * Activities related toAPI
 */

import request from '@/utils/request'

/**
 * Gets the list of full minus activities
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
 * Delete full minus activities
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
 * Add full reduction activities
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
 * Modify the full minus activity content
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
 * Get full minus individual activity details
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
 * Get a list of single item vertical reduction activities
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
 * Delete single item vertical reduction activities
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
 * New single product vertical reduction activities
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
 * Modify single product vertical reduction activities
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
 * Get details of a single - item stand - down campaign
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
 * Get the second half price activity list
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
 * Delete the second half price activity
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
 * Add the second half price activity
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
 * Modify the second half price activity
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
 * Get details of a second half price campaign
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

