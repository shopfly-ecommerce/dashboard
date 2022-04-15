/**
 * Commodity managementAPI
 */

import request from '@/utils/request'
import cache from '@/utils/cache'

/**
 * Get a list of items
 * @param params
 * @returns {Promise<any>}
 */
export function getGoodsList(params) {
  return request({
    url: 'seller/goods',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * List of goods to delete goods merchants will be put into the recycling station goods off the shelf can be put into the recycling station
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function deleteGoods(ids, params) {
  const _params = {}
  return request({
    url: `seller/goods/${ids}/recycle`,
    method: 'put',
    data: _params
  })
}

/**
 * Query the inventory data Query the inventorysku（specifications）information
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getGoodsStockList(ids, params) {
  return request({
    url: `seller/goods/${ids}/skus`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Keep goods in stock
 * @param goods_id
 * @param params
 * @returns {Promise<any>}
 */
export function reserveStockGoods(goods_id, params) {
  return request({
    url: `seller/goods/${goods_id}/quantity`,
    method: 'put',
    data: params,
    headers: { 'Content-Type': 'application/json' }
  })
}

/**
 * Publish commodities. Query commodity parameters to obtain information about the parameters associated with a selected category
 * @param category_id
 * @returns {Promise<any>}
 */
export function getGoodsParams(category_id) {
  return request({
    url: `seller/goods/category/${category_id}/params`,
    method: 'get',
    loading: false
  })
}

/**
 * Edit commodity query commodity parameters to obtain the parameter information associated with the selected category
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getEditGoodsParams(category_id, goods_id) {
  return request({
    url: `seller/goods/category/${category_id}/${goods_id}/params`,
    method: 'get',
    loading: false
  })
}

/**
 * Draft box edit Queries draft box product parameters
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getGoodsDraftParams(ids, params) {
  return request({
    url: `seller/goods/draft-goods/${ids}/params`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Query product category informationids forcategory_id Mall product category
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getGoodsCatrgory(ids, params) {
  return request({
    url: `seller/goods/${ids}/skus`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Query information about a single product. Edit the product list
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getGoodData(ids, params) {
  return request({
    url: `seller/goods/${ids}`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Query information about a single draft box. Edit the draft box list
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getGoodDraftData(ids, params) {
  return request({
    url: `seller/goods/draft-goods/${ids}`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Brand listidsforcategoryid  Product release to obtain brand information associated with the selected category
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getGoodsBrandList(ids, params) {
  return request({
    url: `seller/goods/category/${ids}/brands`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Freight template list
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getTplList(ids, params) {
  return request({
    url: `seller/shops/ship-templates`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Gets a list of points by category
 * @param id
 */
export function getExchangeCatsList(id) {
  return request({
    url: `seller/promotion/exchange-cats/${id}/children`,
    method: 'get',
    loading: false
  })
}

/**
 * Merchants took their goods off the shelves
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function underGoods(ids, params) {
  return request({
    url: `seller/goods/${ids}/under`,
    method: 'put',
    data: params
  })
}

/**
 * Shelf normal merchandise merchandise relatedAPI-Add the goods
 * @param params
 * @returns {Promise<any>}
 */
export function aboveGoods(params) {
  return request({
    url: 'seller/goods',
    method: 'post',
    data: params,
    headers: { 'Content-Type': 'application/json' }
  })
}

/**
 * Modify normal commodities Used when editing commodities
 * @param id
 * @param params
 * @returns {Promise<any>}
 */
export function editGoods(id, params) {
  return request({
    url: `seller/goods/${id}`,
    method: 'put',
    data: params,
    headers: { 'Content-Type': 'application/json' }
  })
}

/**
 * Normal merchandise save draft merchandise relatedAPI-Add the goods
 * @param params
 * @returns {Promise<any>}
 */
export function saveDraft(params) {
  return request({
    url: `seller/goods/draft-goods`,
    method: 'post',
    data: params,
    headers: { 'Content-Type': 'application/json' }
  })
}

/**
 * Shelf draft box goods
 * @param params
 * @returns {Promise<any>}
 */
export function aboveDraftGoods(ids, params) {
  return request({
    url: `seller/goods/draft-goods/${ids}/market`,
    method: 'put',
    data: params,
    headers: { 'Content-Type': 'application/json' }
  })
}

/** Draft box goods save the draft is to modify the draft box goods*/
export function editDraftGoods(id, params) {
  return request({
    url: `seller/goods/draft-goods/${id}`,
    method: 'put',
    data: params,
    headers: { 'Content-Type': 'application/json' }
  })
}

/**
 * Query draft boxskuinformation
 * @param id
 * @param params
 * @returns {Promise<any>}
 */
export function draftSku(id, params) {
  return request({
    url: `seller/goods/draft-goods/${id}/skus`,
    method: 'get',
    data: params
  })
}

/**
 * Get draft box item list
 * @param params
 * @returns {Promise<any>}
 */
export function getDraftGoodsList(params) {
  return request({
    url: 'seller/goods/draft-goods',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Delete draft box items
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function deleteDraftGoods(ids, params) {
  const _params = {}
  return request({
    url: `seller/goods/draft-goods/${ids}`,
    method: 'delete',
    data: _params
  })
}

/**
 * Gets a list of recycle bin items
 * @param params
 * @returns {Promise<any>}
 */
export function getRecycleGoodsList(params) {
  return request({
    url: 'seller/goods',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Recycle bin restores goods
 * @param ids
 * @param params
 * @returns {Promise<any>}
 * @constructor
 */
export function RecycleReductionGoods(ids, params) {
  return request({
    url: `seller/goods/${ids}/revert`,
    method: 'put',
    data: params
  })
}

/**
 * Recycle bin completely remove goods
 * @param ids
 * @param params
 * @returns {Promise<any>}
 * @constructor
 */
export function RecycleDeleteGoods(ids, params) {
  return request({
    url: `seller/goods/${ids}`,
    method: 'delete',
    data: params
  })
}

/**
 * Get a list of warning products
 * @param params
 * @returns {Promise<any>}
 */
export function getWarningGoodsList(params) {
  return request({
    url: 'seller/goods/warning',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * View alert merchandise inventory information
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function getWarningGoodsStockList(ids, params) {
  return request({
    url: `seller/goods/${ids}/skus`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get distribution Settings
 */
export function getDistributionSet() {
  return request({
    url: 'seller/distribution/setting',
    method: 'get',
    loading: false
  })
}

/**
 * Obtain distribution rebate information
 * @param id
 */
export function getDistributionInfo(id) {
  return request({
    url: `seller/distribution/goods/${id}`,
    method: 'get',
    loading: false
  })
}

/**
 * Preserve distribution rebates
 * @param params
 */
export function setDistributionInfo(params) {
  return request({
    url: 'seller/distribution/goods',
    method: 'put',
    data: params
  })
}

/**
 * Get commodity Settings
 */
export function getGoodsSettings() {
  return request({
    url: 'seller/goods/settings',
    method: 'get'
  })
}

/**
 * Modify product Settings
 * @param params
 */
export function editGoodsSettings(params) {
  return request({
    url: 'seller/goods/settings',
    method: 'post',
    data: params
  })
}

/**
 * Commodity index generation
 */
export function initSearchIndex() {
  return request({
    url: 'seller/goods/search',
    method: 'get'
  })
}
