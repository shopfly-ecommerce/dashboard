import request from '@/utils/request'

/**
 * 删除 商品分组
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
 * 商品分组 添加
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
 * 商品分组 编辑
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
 * 发布商品 查询商品品类 分级查询（商城商品品类）
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

