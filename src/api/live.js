/**
 * Live relatedAPI
 */

import request from '@/utils/request'
import { api } from '~/ui-domain'

/**
 * Get a list of broadcast rooms
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
 * Add a live studio
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
 * Submit to review studio
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
 * Check a live studio
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
 * Modify the studio
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
 * Delete the studio
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
 * Bind broadcast room merchandise
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
 * Inquire about broadcast room merchandise
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
 * WeChat picture download
 * @param room_id
 * @returns {Promise<any>}
 */
export function getLiveVideoMedia(media_id) {
  return request({
    url: `${api.address}/seller/live-video/media/download`,
    method: 'get',
    responseType: 'blob',
    loading: false,
    params: {
      media_id
    }
  })
}

/**
 * Get a list of live merchandise
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
 * Add live streaming products
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
 * Query live broadcast products
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
 * Modify live broadcast products
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
 * Delete live broadcast products
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
 * Review live broadcast products again
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
 * Submit live broadcast products for review
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
 * Withdraw the approval of live broadcast products
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
 * Broadcast room commodity selector
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
