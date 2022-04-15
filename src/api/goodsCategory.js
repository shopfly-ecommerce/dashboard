import request from '@/utils/request'

/**
 * Deleting commodity Groups
 * @param params
 * @returns {Promise<any>}
 * @constructor
 */
export function deleteGoodsCategory(params) {
  const ids = params.toString()
  return request({
    url: `seller/shops/cats/${ids}`,
    method: 'delete'
  })
}

/**
 * Grouping of goods
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function addGoodsCategory(params) {
  return request({
    url: 'seller/shops/cats',
    method: 'post',
    data: params
  })
}

/**
 * Commodity group editing
 * @param params
 * @returns {Promise<any>}
 * @constructor
 */
export function updateGoodsCategory(ids, params) {
  return request({
    url: `seller/shops/cats/${ids}`,
    method: 'put',
    data: params
  })
}

/**
 * Release product query Product category query（Mall product category）
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getGoodsCategoryLevelList(ids, params) {
  return request({
    url: `seller/goods/category/${ids}/children`,
    method: 'get',
    loading: false,
    params
  })
}

