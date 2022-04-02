/**
 * 销售统计相关API
 */

import request from '@/utils/request'

/**
 * 获取销售统计信息列表
 * @param params
 * @returns {Promise<any>}
 */
export function getSalesStatisticsNum(params) {
  return request({
    url: 'seller/statistics/reports/sales_num',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 获取销售统计下单金额
 * @param params
 * @returns {Promise<any>}
 */
export function getSalesStatisticsMoney(params) {
  return request({
    url: 'seller/statistics/reports/sales_money',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 获取销售统计表格数据
 * @param params
 * @returns {Promise<any>}
 */
export function getSalesStatisticsGoodsList(params) {
  return request({
    url: 'seller/statistics/reports/sales_page',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 获取销售统计小结
 * @param params
 */
export function getSalesStatisticsSummary(params) {
  return request({
    url: 'seller/statistics/reports/sales_summary',
    method: 'get',
    loading: false,
    params
  })
}

