/**
 * Regional analysisAPI
 */

import request from '@/utils/request'

/**
 * Area analysis list
 * @param params
 * @returns {Promise<any>}
 */
export function getRegionalAnalysisList(params) {
  return request({
    url: 'seller/statistics/reports/regions/data',
    method: 'get',
    loading: false,
    params
  })
}

