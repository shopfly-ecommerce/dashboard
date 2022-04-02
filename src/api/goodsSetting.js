/**
 * 分类管理API
 */
import request from '@/utils/request'

/**
 * 添加分类
 * @param params
 */
export function addCategory(params) {
  const _params = {
    name: params.category_name,
    parent_id: params.parent_id,
    category_order: params.category_order,
    image: params.category_image
  }
  return request({
    url: 'seller/goods/categories',
    method: 'post',
    data: _params
  })
}

/**
 * 编辑分类
 * @param id
 * @param params
 */
export function editCategory(id, params) {
  const _params = {
    name: params.category_name,
    parent_id: params.parent_id,
    category_order: params.category_order,
    image: params.category_image
  }
  return request({
    url: `seller/goods/categories/${id}`,
    method: 'put',
    data: _params
  })
}

/**
 * 根据分类ID获取分类关联品牌数据
 * @param category_id
 * @returns {Promise<any>}
 */
export function getBrandByCategoryId(category_id) {
  return request({
    url: `seller/goods/categories/${category_id}/brands`,
    method: 'get'
  })
}

/**
 * 编辑分类关联品牌
 * @param category_id 分类ID
 * @param choose_brands 品牌数组
 */
export function editCategoryBrand(category_id, choose_brands) {
  return request({
    url: `seller/goods/categories/${category_id}/brands`,
    method: 'put',
    data: { choose_brands }
  })
}

/**
 * 根据分类ID获取分类关联规格数据
 * @param category_id
 * @returns {Promise<any>}
 */
export function getSpecsByCategoryId(category_id) {
  return request({
    url: `seller/goods/categories/${category_id}/select-specs`,
    method: 'get'
  })
}
/**
 * 编辑分类关联规格
 * @param category_id 分类ID
 * @param choose_specs 规格数组
 * @returns {*}
 */
export function editCategorySpecs(category_id, choose_specs) {
  return request({
    url: `seller/goods/categories/${category_id}/specs`,
    method: 'put',
    data: { choose_specs }
  })
}

/**
 * 删除分类
 * @param ids
 * @returns {*}
 */
export function deleteCategory(ids) {
  if (Array.isArray(ids)) ids = ids.join(',')
  return request({
    url: `seller/goods/categories/${ids}`,
    method: 'delete'
  })
}

/**
 * 获取分类关联的参数
 * @param category_id 分类ID
 * @returns {*}
 */
export function getCategoryParams(category_id) {
  return request({
    url: `seller/goods/categories/${category_id}/param`,
    method: 'get'
  })
}

/**
 * 获取分类子集
 * @param parent_id
 */
export function getCategoryChildren(parent_id = 0) {
  return request({
    url: `seller/goods/categories/${parent_id}/children`,
    method: 'get',
    loading: false
  })
}

/**
 * 获取品牌列表
 * @param params
 * @returns {Promise<any>}
 */
export function getBrandList(params) {
  return request({
    url: 'seller/goods/brands',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 添加品牌
 * @param params
 */
export function addBrand(params) {
  return request({
    url: 'seller/goods/brands',
    method: 'post',
    data: params
  })
}

/**
 * 获取品牌详情
 * @param id
 */
export function getBrandDetail(id) {
  return request({
    url: `seller/goods/brands/${id}`,
    method: 'get'
  })
}

/**
 * 编辑品牌
 * @param id
 * @param params
 */
export function editBrand(id, params) {
  return request({
    url: `seller/goods/brands/${id}`,
    method: 'put',
    data: params
  })
}

/**
 * 删除品牌
 * @param ids
 * @returns {Promise<any>}
 */
export function deleteBrand(ids) {
  if (Array.isArray(ids)) ids = ids.join(',')
  return request({
    url: `seller/goods/brands/${ids}`,
    method: 'delete'
  })
}

/**
 * 添加参数组
 * @param params
 * @returns {*}
 */
export function addParamsGroup(params) {
  return request({
    url: 'seller/goods/parameter-groups',
    method: 'post',
    data: params
  })
}

/**
 * 修改参数组
 * @param group_id
 * @param params
 * @returns {*}
 */
export function editParamsGroup(group_id, params) {
  return request({
    url: `seller/goods/parameter-groups/${group_id}`,
    method: 'put',
    data: params
  })
}

/**
 * 删除参数组
 * @param group_id
 * @returns {*}
 */
export function deleteParamsGroup(group_id) {
  return request({
    url: `seller/goods/parameter-groups/${group_id}`,
    method: 'delete'
  })
}

/**
 * 参数组排序
 * @param group_id
 * @param sort_type
 * @returns {*}
 */
export function sortParamsGroup(group_id, sort_type) {
  return request({
    url: `seller/goods/parameter-groups/${group_id}/sort`,
    method: 'put',
    data: { sort_type }
  })
}

/**
 * 获取参数组详情
 * @param id
 * @returns {*}
 */
export function getParamsGroupDetail(id) {
  return request({
    url: `seller/goods/parameter-groups/${id}`,
    method: 'get'
  })
}

/**
 * 添加参数
 * @param params
 * @returns {*}
 */
export function addParams(params) {
  return request({
    url: 'seller/goods/parameters',
    method: 'post',
    data: params
  })
}

/**
 * 编辑参数
 * @param id
 * @param params
 * @returns {*}
 */
export function editParams(id, params) {
  return request({
    url: `seller/goods/parameters/${id}`,
    method: 'put',
    data: params
  })
}

/**
 * 删除参数
 * @param id
 * @returns {*}
 */
export function deleteParams(id) {
  return request({
    url: `seller/goods/parameters/${id}`,
    method: 'delete'
  })
}

/**
 * 参数排序
 * @param param_id
 * @param sort_type
 * @returns {*}
 */
export function sortParams(param_id, sort_type) {
  return request({
    url: `seller/goods/parameters/${param_id}/sort`,
    method: 'put',
    data: { sort_type }
  })
}

/**
 * 获取参数详情
 * @param id
 * @returns {*}
 */
export function getParamDetail(id) {
  return request({
    url: `seller/goods/parameters/${id}`,
    method: 'get'
  })
}

/**
 * 获取规格列表
 * @param params
 */
export function getSpecs(params) {
  return request({
    url: 'seller/goods/specs',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 添加规格
 * @param params
 */
export function addSpec(params) {
  return request({
    url: 'seller/goods/specs',
    method: 'post',
    data: params
  })
}

/**
 * 编辑规格
 * @param id
 * @param params
 */
export function eidtSpec(id, params) {
  return request({
    url: `seller/goods/specs/${id}`,
    method: 'put',
    data: params
  })
}

/**
 * 删除规格
 * @param ids
 * @returns {*}
 */
export function deleteSpecs(ids) {
  if (Array.isArray(ids)) ids = ids.join(',')
  return request({
    url: `seller/goods/specs/${ids}`,
    method: 'delete'
  })
}

/**
 * 获取规格值
 * @param spec_id 规格ID
 * @returns {*}
 */
export function getSpecValues(spec_id) {
  return request({
    url: `seller/goods/specs/${spec_id}/values`,
    method: 'get'
  })
}

/**
 * 保存规格值
 * @param spec_id
 * @param value_list
 * @returns {Promise<any>}
 */
export function saveSpecValues(spec_id, value_list) {
  return request({
    url: `seller/goods/specs/${spec_id}/values`,
    method: 'post',
    data: { value_list }
  })
}
