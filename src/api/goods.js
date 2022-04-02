/**
 * 商品管理API
 */

import request from '@/utils/request'
import cache from '@/utils/cache'

/**
 * 获取商品列表
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
 * 商品列表 删除商品  商家将商品放入回收站  下架的商品才能放入回收站
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
 * 查询库存商品数据  查询商品sku（规格）信息
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
 * 保存库存商品
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
 * 发布商品   查询商品参数，获取所选分类关联的参数信息
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
 * 编辑商品   查询商品参数，获取所选分类关联的参数信息
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
 * 草稿箱编辑 查询草稿箱商品参数
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
 * 查询商品品类信息  ids 为category_id 商城商品品类
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
 * 查询单个商品信息 商品列表 编辑
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
 * 查询单个草稿箱商品信息 草稿箱商品列表 编辑
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
 * 品牌列表 ids为categoryid  商品发布，获取所选分类关联的品牌信息
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
 * 运费模板列表
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
 * 获取积分商品分类列表
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
 * 商家下架商品
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
 * 上架正常商品 商品相关API-添加商品
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
 * 修改正常商品 编辑商品时用到
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
 * 正常商品 保存草稿 草稿商品相关API-添加商品
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
 * 上架草稿箱商品
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

/** 草稿箱商品 保存草稿 即 修改草稿箱商品 */
export function editDraftGoods(id, params) {
  return request({
    url: `seller/goods/draft-goods/${id}`,
    method: 'put',
    data: params,
    headers: { 'Content-Type': 'application/json' }
  })
}

/**
 * 查询草稿箱sku信息
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
 * 获取草稿箱商品列表
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
 * 删除草稿箱商品
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
 * 获取回收站商品列表
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
 * 回收站 还原商品
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
 * 回收站 彻底删除商品
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
 * 获取预警商品列表
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
 * 查看预警商品库存信息
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
 * 获取分销设置
 */
export function getDistributionSet() {
  return request({
    url: 'seller/distribution/setting',
    method: 'get',
    loading: false
  })
}

/**
 * 获取分销返利信息
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
 * 保存分销返利
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
 * 获取商品设置
 */
export function getGoodsSettings() {
  return request({
    url: 'seller/goods/settings',
    method: 'get'
  })
}

/**
 * 修改商品设置
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
 * 商品索引生成
 */
export function initSearchIndex() {
  return request({
    url: 'seller/goods/search',
    method: 'get'
  })
}
