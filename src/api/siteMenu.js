/**
 * 导航栏相关API
 */

import request from '@/utils/request'

/**
 * 获取导航菜单列表
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
 * 添加导航菜单
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
 * 获取导航菜单详情
 * @param id
 */
export function getSiteMenuDetail(id) {
  return request({
    url: `seller/pages/site-navigations/${id}`,
    method: 'get'
  })
}

/**
 * 修改导航菜单
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
 * 删除导航菜单
 * @param id
 */
export function deleteSiteMenu(id) {
  return request({
    url: `seller/pages/site-navigations/${id}`,
    method: 'delete'
  })
}

/**
 * 导航排序
 * @param id
 * @param sort_type [up|down]
 */
export function sortSiteMenu(id, sort_type) {
  return request({
    url: `seller/pages/site-navigations/${id}/${sort_type}`,
    method: 'put'
  })
}
