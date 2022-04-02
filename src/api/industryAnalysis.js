/**
 * 统计相关API
 */

import request from '@/utils/request'

/** 行业分析 */

/**
 * 获取行业规模下单量
 * @param params
 */
export function getIndustryScaleOrder(params) {
  return request({
    url: 'seller/statistics/industry/order/quantity',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 获取行业规模下单商品数量
 * @param params
 */
export function getIndustryScaleGoods(params) {
  return request({
    url: 'seller/statistics/industry/goods/num',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 获取行业规模下单金额
 * @param params
 */
export function getIndustryScalePrice(params) {
  return request({
    url: 'seller/statistics/industry/order/money',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 获取概括总览数据
 * @param params
 */
export function getGeneralityOverviewData(params) {
  return request({
    url: 'seller/statistics/industry/overview',
    method: 'get',
    loading: false,
    params
  })
}

/** 流量分析 */
/**
 * 获取店铺流量数据
 * @param params
 */
export function getTrafficAnalysisShop(params) {
  return request({
    url: 'seller/statistics/page_view/shop',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 获取商品流量数据
 * @param params
 */
export function getTrafficAnalysisGoods(params) {
  return request({
    url: 'seller/statistics/page_view/goods',
    method: 'get',
    loading: false,
    params
  })
}
