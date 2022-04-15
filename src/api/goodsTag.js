import request from '@/utils/request'

/**
 * Get tag list
 * @param params
 * @returns {Promise<any>}
 */
export function getTagsList(params) {
  return request({
    url: 'seller/goods/tags',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get a list of labeled items
 * @param params
 * @returns {Promise<any>}
 */
export function getTagGoodsList(id, params) {
  return request({
    url: `seller/goods/tags/${id}/goods`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Save a list of labeled items
 * @param params
 * @returns {Promise<any>}
 */
export function saveTagGoodsList(tag_id, goods_ids, params) {
  return request({
    url: `seller/goods/tags/${tag_id}/goods/${goods_ids}`,
    method: 'put',
    loading: false,
    data: params
  })
}
