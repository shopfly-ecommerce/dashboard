/**
 * 直播相关API
 */

import request from '@/utils/request'
import { api } from '~/ui-domain'

/**
 * 获取直播间列表
 * @param params
 * @returns {Promise<any>}
 */
export function getLiveVideoList(params) {
  return request({
    url: `${api.live}/seller/live-video/rooms`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 添加直播间
 * @param params
 * @returns {Promise<any>}
 */
export function addLiveVideoRooms(params) {
  return request({
    url: `${api.live}/seller/live-video/rooms`,
    method: 'post',
    loading: false,
    params
  })
}

/**
 * 提交审核直播间
 * @param id
 * @returns {Promise<any>}
 */
export function auditLiveVideoRooms(id) {
  return request({
    url: `${api.live}/seller/live-video/rooms/${id}/audit`,
    method: 'post',
    loading: false
  })
}

/**
 * 查询一个直播间
 * @param id
 * @returns {Promise<any>}
 */
export function getLiveVideo(id) {
  return request({
    url: `${api.live}/seller/live-video/rooms/${id}`,
    method: 'get',
    loading: false
  })
}

/**
 * 修改直播间
 * @param id
 * @param params
 * @returns {Promise<any>}
 */
export function updateLiveVideo(id, params) {
  return request({
    url: `${api.live}/seller/live-video/rooms/${id}`,
    method: 'put',
    loading: false,
    data: params
  })
}

/**
 * 删除直播间
 * @param id
 * @returns {Promise<any>}
 */
export function deleteLiveVideo(id) {
  return request({
    url: `${api.live}/seller/live-video/rooms/${id}`,
    method: 'delete',
    loading: false
  })
}

/**
 * 绑定直播间商品
 * @param room_id
 * @param params
 * @returns {Promise<any>}
 */
export function bindLiveVideoGoods(room_id, good_ids) {
  return request({
    url: `${api.live}/seller/live-video/rooms/${room_id}`,
    method: 'post',
    loading: false,
    params: {
      good_ids
    }
  })
}

/**
 * 查询直播间商品
 * @param room_id
 * @param params
 * @returns {Promise<any>}
 */
export function getLiveVideoGoods(room_id, params) {
  return request({
    url: `${api.live}/seller/live-video/rooms/${room_id}/get-goods-list`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 直播间微信图片下载
 * @param room_id
 * @returns {Promise<any>}
 */
export function getLiveVideoMedia(media_id) {
  return request({
    url: `${api.base}/seller/live-video/media/download`,
    method: 'get',
    responseType: 'blob',
    loading: false,
    params: {
      media_id
    }
  })
}

/**
 * 获取直播商品列表
 * @param params
 * @returns {Promise<any>}
 */
export function getLiveVideoGoodsList(params) {
  return request({
    url: `${api.live}/seller/live-video/goods`,
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 添加直播商品
 * @param params
 * @returns {Promise<any>}
 */
export function addLiveVideoGoods(params) {
  return request({
    url: `${api.live}/seller/live-video/goods`,
    method: 'post',
    loading: false,
    params,
    headers: { 'clientType': 'UNIAPP' }
  })
}

/**
 * 查询直播商品
 * @param id
 * @returns {Promise<any>}
 */
export function getLiveGoods(id) {
  return request({
    url: `${api.live}/seller/live-video/goods/${id}`,
    method: 'get',
    loading: false
  })
}

/**
 * 修改直播商品
 * @param id
 * @param params
 * @returns {Promise<any>}
 */
export function updateLiveGoods(id, params) {
  return request({
    url: `${api.live}/seller/live-video/goods/${id}`,
    method: 'put',
    loading: false,
    params
  })
}

/**
 * 删除直播商品
 * @param id
 * @returns {Promise<any>}
 */
export function deleteLiveVideoGoods(id) {
  return request({
    url: `${api.live}/seller/live-video/goods/${id}`,
    method: 'delete',
    loading: false
  })
}

/**
 * 再次审核直播商品
 * @param id
 * @returns {Promise<any>}
 */
export function againAuditLiveVideoGoods(id) {
  return request({
    url: `${api.live}/seller/live-video/goods/${id}/again-audit`,
    method: 'post',
    loading: false
  })
}

/**
 * 提交审核直播商品
 * @param id
 * @returns {Promise<any>}
 */
export function submitAuditLiveVideoGoods(id) {
  return request({
    url: `${api.live}/seller/live-video/goods/${id}/audit`,
    method: 'post',
    loading: false
  })
}

/**
 * 撤回审核直播商品
 * @param id
 * @returns {Promise<any>}
 */
export function resetAuditLiveVideoGoods(id) {
  return request({
    url: `${api.live}/seller/live-video/goods/${id}/reset-audit`,
    method: 'post',
    loading: false
  })
}

/**
 * 直播间商品选择器
 * @param params
 * @returns {Promise<any>}
 */
export function getLiveVideoSku(params) {
  return request({
    url: `${api.live}/seller/live-video/goods/sku`,
    method: 'get',
    loading: false,
    params
  })
}
