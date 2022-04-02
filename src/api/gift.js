/**
 * 赠品管理API
 */

import request from '@/utils/request'

/**
 * 获取赠品品列表
 * @param params
 * @returns {Promise<any>}
 */
export function getGiftsList(params) {
  return request({
    url: 'seller/promotion/full-discount-gifts',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 获取全部赠品品列表
 */
export function getGiftsAllList() {
  return request({
    url: 'seller/promotion/full-discount-gifts/all',
    method: 'get',
    loading: false
  })
}

/**
 * 删除赠品
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function deleteGifts(ids) {
  return request({
    url: `seller/promotion/full-discount-gifts/${ids}`,
    method: 'delete',
    loading: false
  })
}

/**
 * 保存赠品更新
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function saveGifts(ids, params) {
  return request({
    url: `seller/promotion/full-discount-gifts/${ids}`,
    method: 'put',
    loading: false,
    data: params
  })
}

/**
 * 新增赠品
 * @param params
 * @returns {Promise<any>}
 */
export function addGifts(params) {
  return request({
    url: 'seller/promotion/full-discount-gifts',
    method: 'post',
    loading: false,
    data: params
  })
}

/**
 * 查询一个赠品详情
 * @param id
 * @param params
 * @returns {Promise<any>}
 */
export function getGiftDetails(id, params) {
  return request({
    url: `seller/promotion/full-discount-gifts/${id}`,
    method: 'get',
    loading: false,
    params
  })
}
