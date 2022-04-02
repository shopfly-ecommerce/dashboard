import request from '@/utils/request'

/**
 * 根据分类id 获取规格信息
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
