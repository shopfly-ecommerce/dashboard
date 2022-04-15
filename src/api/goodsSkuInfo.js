import request from '@/utils/request'

/**
 * According to the classificationid Get specification information
 * @param category_id
 * @param params
 * @returns {Promise<any>}
 */
export function getCategorySkuList(category_id, params) {
  return request({
    url: `seller/goods/categories/${category_id}/specs`,
    method: 'get',
    loading: false,
    params
  })
}
