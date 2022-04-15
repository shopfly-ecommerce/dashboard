addExpress/**
 * Express company relatedAPI
 */

import request from '@/utils/request'
import qs from 'qs'

/**
 * Get a list of logistics companies
 * @param params
 */
export function getExpressList(params) {
  return request({
    url: 'seller/systems/logi-companies',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Add logistics Company
 * @param params
 */
export function addExpress(params) {
  let arr = params.formItems
  delete params.formItems
  return request({
    url: `seller/systems/logi-companies?${qs.stringify(params)}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: arr
  })
}

/**
 * Delete logistics company
 * @param id
 */
export function deleteExpress(id) {
  return request({
    url: 'seller/systems/logi-companies',
    method: 'delete'
  })
}

/**
 * Get details of logistics company
 * @param id
 */
export function getExpressDetail(id) {
  return request({
    url: `seller/systems/logi-companies/${id}`,
    method: 'get'
  })
}

/**
 * Modify logistics company
 * @param id
 * @param params
 */
export function editExpress(id, params) {
  let arr = params.formItems
  delete params.formItems
  return request({
    url: `seller/systems/logi-companies/${id}?${qs.stringify(params)}`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: arr
  })
}
