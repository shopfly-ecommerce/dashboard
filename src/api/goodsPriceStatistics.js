import request from '@/utils/request'

/**
 * Gets the price sales statistics list
 * @param params
 * @returns {Promise<any>}
 */
export function getPriceStatisticsList(params) {
  return request({
    url: 'seller/statistics/goods/price_sales',
    method: 'get',
    loading: false,
    params
  })
}
