/**
 * 团购商品相关API
 */

import request from '@/utils/request'

/**
 * 获取团购商品列表
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
 * 获取团购分类列表
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
 * 删除团购商品
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
 * 保存团购商品详情 更新操作
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
 * 新增团购商品
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
 * 获取一个团购商品详情
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
 * 获取团购活动列表
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
 * 获取团购活动列表
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
 * 添加团购活动
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
 * 获取团购活动商品列表
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
 * 获取团购商品详情
 * @param gb_id
 */
export function getGroupBuyGoodsDetail(gb_id) {
  return request({
    url: `seller/promotion/group-buy-goods/${gb_id}`,
    method: 'get'
  })
}

/**
 * 编辑团购活动
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
 * 删除团购活动
 * @param id
 */
export function deleteGroupBuyActivity(id) {
  return request({
    url: `seller/promotion/group-buy-actives/${id}`,
    method: 'delete'
  })
}

/**
 * 获取团购分类列表
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
 * 添加团购分类
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
 * 获取团购详情
 * @param id
 */
export function getGroupBuyCategoryDetail(id) {
  return request({
    url: `seller/promotion/group-buy-cats/${id}`,
    method: 'get'
  })
}

/**
 * 编辑团购分类
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
 * 删除团购分类
 * @param id
 */
export function deleteGroupBuyCategory(id) {
  return request({
    url: `seller/promotion/group-buy-cats/${id}`,
    method: 'delete'
  })
}

/**
 * 获取团购活动列表 （待审核状态可显示）
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
