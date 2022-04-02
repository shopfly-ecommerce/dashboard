/**
 * 快递模板相关API
 */

import request from '@/utils/request'
import { api } from '~/ui-domain'

/**
 * 运费模版列表
 */
export function getTplList() {
  return request({
    url: 'seller/shops/ship-templates',
    method: 'get',
    loading: false
  })
}

/**
 * 查询单个运费模版
 * @param id
 */
export function getSimpleTpl(id) {
  return request({
    url: `seller/shops/ship-templates/${id}`,
    method: 'get',
    loading: false
  })
}

/**
 * 删除快递模板
 * @param ids
 */
export function deleteExpressMould(ids) {
  return request({
    url: `seller/shops/ship-templates/${ids}`,
    method: 'delete'
  })
}

/**
 * 更新运费模板
 * @param ids
 * @param params
 * @returns {Promise<any>}
 */
export function saveExpressMould(ids, params) {
  return request({
    url: `seller/shops/ship-templates/${ids}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'put',
    data: params
  })
}

/**
 * 添加运费模版
 * @param id
 * @param params
 * @returns {Promise<any>}
 */
export function addExpressMould(params) {
  return request({
    url: 'seller/shops/ship-templates',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * 获取树形选择器地区信息
 */
export function getAreaList() {
  return request({
    url: `${api.base}/regions/depth/3`,
    method: 'get'
  })
}

