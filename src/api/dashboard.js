/**
 * Home business mall basic informationAPI
 */

import request from '@/utils/request'
import { api } from '~/ui-domain'

/**
 * Get home page statistics
 * @returns {Promise<any>}
 */
export function getDashboardData() {
  return request({
    url: 'seller/statistics/dashboard',
    method: 'get',
    loading: false
  })
}

/**
 * Access to mall announcements
 * @param params
 * @returns {Promise<any>}
 */
export function getNotice(type, params) {
  return request({
    url: `${api.address}/pages/article-categories/${type}/articles`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get home platform contact information
 * @param params
 * @returns {Promise<any>}
 */
export function getConcate(params) {
  return request({
    url: `${api.address}/pages/${params.position}/articles`,
    method: 'get',
    loading: false
  })
}

