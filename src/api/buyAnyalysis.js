import request from '@/utils/request'

/**
 * 获取购买分析购买时段分布列表
 * @param params
 * @returns {Promise<any>}
 */
export function getbuyAnyalysisPeriodList(params) {
  return request({
    url: 'seller/statistics/reports/purchase/period',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 获取购买分析客价单分布列表
 * @param params
 * @returns {Promise<any>}
 */
export function getbuyAnyalysisRangesList(params) {
  return request({
    url: 'seller/statistics/reports/purchase/ranges',
    method: 'get',
    loading: false,
    params
  })
}
