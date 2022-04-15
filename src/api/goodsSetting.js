/**
 * Classification managementAPI
 */
import request from '@/utils/request'

/**
 * Add the classification
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
 * Edit category
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
 * According to the classificationIDObtain classified associated brand data
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
 * Editors categorize associated brands
 * @param category_id CategoriesID
 * @param choose_brands Brand array
 */
export function editCategoryBrand(category_id, choose_brands) {
  return request({
    url: `seller/goods/categories/${category_id}/brands`,
    method: 'put',
    data: { choose_brands }
  })
}

/**
 * According to the classificationIDGets the classification association specification data
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
 * Edit the category association specification
 * @param category_id CategoriesID
 * @param choose_specs An array of specifications
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
 * Delete the classification
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
 * Gets the parameters of the classification association
 * @param category_id CategoriesID
 * @returns {*}
 */
export function getCategoryParams(category_id) {
  return request({
    url: `seller/goods/categories/${category_id}/param`,
    method: 'get'
  })
}

/**
 * Acquisition of classification subsets
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
 * Get a list of brands
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
 * Add a brand
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
 * Get brand details
 * @param id
 */
export function getBrandDetail(id) {
  return request({
    url: `seller/goods/brands/${id}`,
    method: 'get'
  })
}

/**
 * Edit the brand
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
 * Delete the brand
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
 * Add parameter group
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
 * Modify parameter set
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
 * Delete parameter set
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
 * Parameter group sort
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
 * Gets parameter group details
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
 * Add parameters
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
 * Edit parameters
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
 * Delete the parameter
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
 * Parameters of the sort
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
 * Get parameter details
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
 * Get specification list
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
 * Add the specification
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
 * Edit the specifications
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
 * Delete the specifications
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
 * Get specification value
 * @param spec_id specificationsID
 * @returns {*}
 */
export function getSpecValues(spec_id) {
  return request({
    url: `seller/goods/specs/${spec_id}/values`,
    method: 'get'
  })
}

/**
 * Save specification values
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
