import request from '@/utils/request'

/**
 * Get a statistical list of product details
 * @param params
 * @returns {Promise<any>}
 */
export function getGoodsStatisticsList(params) {
  return request({
    url: 'seller/statistics/goods/goods_detail',
    method: 'get',
    loading: false,
    params
  })
}
