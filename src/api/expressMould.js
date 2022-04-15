/**
 * Express template correlationAPI
 */

import request from '@/utils/request'
import { api } from '~/ui-domain'

/**
 * Freight template list
 */
export function getTplList() {
  return request({
    url: 'seller/shops/ship-templates',
    method: 'get',
    loading: false
  })
}

/**
 * Query a single freight template
 * @param id
 */
export function getSimpleTpl(id) {
  return request({
    url: `seller/shops/ship-templates/${id}`,
    method: 'get',
    loading: false
  })
}

/**
 * Delete the express template
 * @param ids
 */
export function deleteExpressMould(ids) {
  return request({
    url: `seller/shops/ship-templates/${ids}`,
    method: 'delete'
  })
}

/**
 * Update freight template
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function saveExpressMould(ids, params) {
  return request({
    url: `seller/shops/ship-templates/${ids}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'put',
    data: params
  })
}

/**
 * Add the shipping template
 * @param id
 * @param params
 * @returns {Promise<any>}
 */
export function addExpressMould(params) {
  return request({
    url: 'seller/shops/ship-templates',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * Gets tree selector locale information
 */
export function getAreaList() {
  return request({
    url: `${api.address}/regions/depth/3`,
    method: 'get'
  })
}

