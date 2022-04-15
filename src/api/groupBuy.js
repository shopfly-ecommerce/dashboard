/**
 * Group purchase merchandise relatedAPI
 */

import request from '@/utils/request'

/**
 * Get a list of group purchase items
 * @param params
 * @returns {Promise<any>}
 */
export function getGroupBuyGoodsList(params) {
  return request({
    url: 'seller/promotion/group-buy-goods',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get the group purchase category list
 * @param params
 * @returns {Promise<any>}
 */
export function getGroupCateGoriesList() {
  return request({
    url: 'seller/promotion/group-buy-cats',
    method: 'get',
    loading: false
  })
}

/**
 * Delete group purchase products
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function deleteGroupBuyGoods(ids, params) {
  return request({
    url: `seller/promotion/group-buy-goods/${ids}`,
    method: 'delete',
    loading: false,
    params
  })
}

/**
 * Save group purchase details update operation
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function saveGroupBuyGoods(ids, params) {
  return request({
    url: `seller/promotion/group-buy-goods/${ids}`,
    method: 'put',
    loading: false,
    headers: { 'Content-Type': 'application/json' },
    params
  })
}

/**
 * New group purchase products
 * @param params
 * @returns {Promise<any>}
 */
export function addGroupBuyGoods(params) {
  return request({
    url: 'seller/promotion/group-buy-goods',
    method: 'post',
    loading: false,
    headers: { 'Content-Type': 'application/json' },
    params
  })
}

/**
 * Get details of a group purchase item
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getGroupBuyGoodsDetails(ids, params) {
  return request({
    url: `seller/promotion/group-buy-goods/${ids}`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get a list of group purchase activities
 * @param params
 */
export function getGroupBuyActives(params) {
  return request({
    url: 'seller/promotion/group-buy-actives',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get a list of group purchase activities
 * @param params
 */
export function getGroupBuyActivesIds(act_id) {
  return request({
    url: `seller/promotion/group-buy-actives/${act_id}`,
    method: 'get',
    loading: false
  })
}

/**
 * Add group purchase activities
 * @param params
 */
export function addGrouBuyActivity(params) {
  return request({
    url: 'seller/promotion/group-buy-actives',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * Get a list of deals
 * @param params
 */
export function getGroupBuyGoods(params) {
  return request({
    url: `seller/promotion/group-buy-goods`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get details of group purchase products
 * @param gb_id
 */
export function getGroupBuyGoodsDetail(gb_id) {
  return request({
    url: `seller/promotion/group-buy-goods/${gb_id}`,
    method: 'get'
  })
}

/**
 * Edit group purchase activities
 * @param id
 * @param params
 */
export function editGroupBuyActivity(id, params) {
  return request({
    url: `seller/promotion/group-buy-actives/${id}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * Delete group purchase activities
 * @param id
 */
export function deleteGroupBuyActivity(id) {
  return request({
    url: `seller/promotion/group-buy-actives/${id}`,
    method: 'delete'
  })
}

/**
 * Get the group purchase category list
 * @param params
 */
export function getGroupBuyCategory(params) {
  return request({
    url: 'seller/promotion/group-buy-cats',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Add group Purchase category
 * @param params
 */
export function addGroupBuyCategory(params) {
  return request({
    url: 'seller/promotion/group-buy-cats',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params
  })
}

/**
 * Get group purchase details
 * @param id
 */
export function getGroupBuyCategoryDetail(id) {
  return request({
    url: `seller/promotion/group-buy-cats/${id}`,
    method: 'get'
  })
}

/**
 * Edit the Group Purchase category
 * @param id
 * @param params
 */
export function editGroupBuyCategory(id, params) {
  return request({
    url: `seller/promotion/group-buy-cats/${id}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    params
  })
}

/**
 * Delete group purchase category
 * @param id
 */
export function deleteGroupBuyCategory(id) {
  return request({
    url: `seller/promotion/group-buy-cats/${id}`,
    method: 'delete'
  })
}

/**
 * Get a list of group purchase activities（Pending status can be displayed）
 * @param params
 * @returns {Promise<any>}
 */
export function getGroupBuyActivityList(params) {
  return request({
    url: 'seller/promotion/group-buy-goods/active',
    method: 'get',
    loading: false,
    params
  })
}
