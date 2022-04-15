/**
 * Navigation bar correlationAPI
 */

import request from '@/utils/request'

/**
 * Gets the navigation menu list
 * @param params
 */
export function getSiteMenuList(params) {
  return request({
    url: 'seller/pages/site-navigations',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Add navigation menu
 * @param client_type
 * @param params
 */
export function addSiteMenu(client_type = 'PC', params) {
  return request({
    url: 'seller/pages/site-navigations',
    method: 'post',
    data: {
      ...params,
      client_type
    }
  })
}

/**
 * Get navigation menu details
 * @param id
 */
export function getSiteMenuDetail(id) {
  return request({
    url: `seller/pages/site-navigations/${id}`,
    method: 'get'
  })
}

/**
 * Modify the navigation menu
 * @param id
 * @param parmas
 */
export function editSiteMenu(id, parmas) {
  return request({
    url: `seller/pages/site-navigations/${id}`,
    method: 'put',
    data: parmas
  })
}

/**
 * Delete navigation menu
 * @param id
 */
export function deleteSiteMenu(id) {
  return request({
    url: `seller/pages/site-navigations/${id}`,
    method: 'delete'
  })
}

/**
 * Navigation sorting
 * @param id
 * @param sort_type [up|down]
 */
export function sortSiteMenu(id, sort_type) {
  return request({
    url: `seller/pages/site-navigations/${id}/${sort_type}`,
    method: 'put'
  })
}
