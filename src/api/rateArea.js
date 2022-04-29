import request from '@/utils/request'

/**
 * Get all rate area
 * @returns {*|Promise<unknown>}
 */
export function getAllRateAreas(params) {
  return request({
    url: `/seller/shops/rate-area`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Create rate area
 * @param data
 * @returns {*|Promise<unknown>}
 */
export function addRateArea(data) {
  return request({
    url: `/seller/shops/rate-area`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

/**
 * Get rate area
 * @param id
 * @returns {*|Promise<unknown>}
 */
export function getRateAreaDetail(id) {
  return request({
    url: `/seller/shops/rate-area/${id}`,
    method: 'get'
  })
}

/**
 * Update rate area
 * @param id
 * @param data
 * @returns {*|Promise<unknown>}
 */
export function updateRateArea(id, data) {
  return request({
    url: `/seller/shops/rate-area/${id}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

/**
 * Delete rate area
 * @param id
 * @returns {*|Promise<unknown>}
 */
export function deleteRateArea(id) {
  return request({
    url: `/seller/shops/rate-area/${id}`,
    method: 'delete'
  })
}

/**
 * Get all countries or regions
 * @returns {*|Promise<unknown>}
 */
export function getAllCountries(loading = false) {
  return request({
    url: `/countries`,
    method: 'get',
    loading,
    needToken: false
  })
}

/**
 * Get country's secondary city
 * @param code
 * @returns {*|Promise<unknown>}
 */
export function getAreaState(code) {
  return request({
    url: `/countries/${code}/states`,
    method: 'get',
    loading: false,
    needToken: false
  })
}
