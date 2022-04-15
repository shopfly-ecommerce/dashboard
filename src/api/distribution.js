/**
 * Distribution relatedAPI
 */

import request from '@/utils/request'

/**
 * Gets a list of personal commission templates
 * @param params
 */
export function getPerAccomplishmentTpl(params) {
  return request({
    url: 'seller/distribution/commission-tpl',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Add commission templates
 * @param params
 */
export function addPerTpl(params) {
  return request({
    url: 'seller/distribution/commission-tpl',
    method: 'post',
    loading: false,
    params
  })
}

/**
 * Modify the commission template
 * @param params
 */
export function editPerTpl(params) {
  return request({
    url: `seller/distribution/commission-tpl/${params.id}`,
    method: 'put',
    loading: false,
    params
  })
}

/**
 * Delete the commission template
 * @param id
 */
export function delPerTpl(id) {
  return request({
    url: `seller/distribution/commission-tpl/${id}`,
    method: 'delete',
    loading: false
  })
}

/**
 * Gets the commission template
 * @param id
 */
export function getPerTpl(id) {
  return request({
    url: `seller/distribution/commission-tpl/${id}`,
    method: 'get',
    loading: false
  })
}

/**
 * Get the distribution template upgrade log
 */
export function getUpgradeLogs(params) {
  return request({
    url: 'seller/distribution/upgradelog',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get a list of individual distributors
 * @param params
 */
export function getDistributorList(params) {
  return request({
    url: 'seller/distribution/member',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Modify distributor template
 * @param params
 */
export function modifyTpl(params) {
  return request({
    url: `seller/distribution/member/tpl`,
    method: 'put',
    loading: false,
    params
  })
}

/**
 * Get the order quantity diagram= orders
 * @param params
 */
export function getOrderCountChart(params) {
  return request({
    url: 'seller/distribution/statistic/count',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get the order amount diagram= turnover
 * @param params
 */
export function getOrderAmountChart(params) {
  return request({
    url: 'seller/distribution/statistic/order',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get the order cashback diagram= Profit margin
 * @param params
 */
export function getProfitChart(params) {
  return request({
    url: 'seller/distribution/statistic/push',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Results list
 * @param params
 */
export function getAchievementList(params) {
  return request({
    url: 'seller/distribution/bill/total',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * The bill list
 * @param params
 */
export function getBillList(params) {
  return request({
    url: 'seller/distribution/bill/member',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Get details of a bill
 * @param id
 */
export function getDisBillDetails(id) {
  return request({
    url: `seller/distribution/bill/member/${id}`,
    method: 'get',
    loading: false
  })
}

/**
 * Distribution order list
 * @param params
 */
export function getDisOrderList(params) {
  return request({
    url: 'seller/distribution/order',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Distribution refund Form enquiry
 * @param params
 */
export function getDisRefundOrderList(params) {
  return request({
    url: 'seller/distribution/order/sellback',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Obtain the performance of a sub-distributor
 * @param params
 */
export function getDisBillDown(params) {
  return request({
    url: 'seller/distribution/bill/member/down',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Withdrawal application/Withdrawal record list
 * @param params
 */
export function getWithdrawApplyList(params) {
  return request({
    url: 'seller/distribution/withdraw/apply',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Review withdrawal request
 * @param params
 */
export function authWithdrawApply(params) {
  return request({
    url: 'seller/distribution/withdraw/auditing',
    method: 'post',
    loading: false,
    params
  })
}

/**
 * Set as transferred
 * @param params
 */
export function setTransferAccounts(params) {
  return request({
    url: 'seller/distribution/withdraw/account/end',
    method: 'post',
    loading: false,
    params
  })
}

/**
 * Gets the withdrawal Settings
 * @param params
 */
export function getWithDrawSettings() {
  return request({
    url: 'seller/distribution/settings',
    method: 'get',
    loading: false
  })
}

/**
 * Save the withdrawal Settings
 * @param params
 */
export function reserveWithDrawSettings(params) {
  return request({
    url: 'seller/distribution/settings',
    method: 'put',
    loading: false,
    params
  })
}

