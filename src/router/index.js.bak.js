import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    role: ['admin','editor']     will control the page role (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard' }
    }]
  }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // 商品管理
  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/goods-list',
    name: 'goods',
    meta: {
      title: 'goods',
      icon: 'goods-manage'
    },
    children: [
      { path: 'goods-list', component: _import('goods/goodsList'), name: 'goodsList', meta: { title: 'goodsList' }},
      { path: 'draft-list', component: _import('goods/draftList'), name: 'draftList', meta: { title: 'draftList' }},
      { path: 'category-manage', component: _import('goods/categoryManage'), name: 'categoryManage', meta: { title: 'categoryManage' }},
      { path: 'tag-manage', component: _import('goods/tagManage'), name: 'tagManage', meta: { title: 'tagManage' }},
      { path: 'tag-add/:tag_id', component: _import('goods/tagAdd'), name: 'tagAdd', meta: { title: 'tagAdd' }, hidden: true },
      { path: 'recycle-station', component: _import('goods/recycleStation'), name: 'recycleStation', meta: { title: 'recycleStation' }},
      { path: 'understock', component: _import('goods/understock'), name: 'understock', meta: { title: 'understock' }},
      { path: 'good-publish', component: _import('goods/goodsPublish'), name: 'goodPublish', meta: { title: 'goodPublish' }, hidden: true }
    ]
  },
  // 订单管理
  {

    path: '/order',
    component: Layout,
    name: 'order',
    redirect: '/order/order-list',
    meta: { title: 'order', icon: 'order-manage' },
    children: [
      { path: 'order-list', component: _import('order/orderList'), name: 'orderList', meta: { title: 'orderList' }},
      { path: 'detail/:sn', component: _import('order/orderDetail'), name: 'orderDetail', hidden: true, meta: { title: 'orderDetail' }},
      { path: 'refund-list', component: _import('order/refundList'), name: 'refundList', meta: { title: 'refundList' }},
      { path: 'logistics-manage', component: _import('order/logisticsManage'), name: 'logisticsManage', meta: { title: 'logisticsManage' }},
      { path: 'comments-manage', component: _import('order/commentsManage'), name: 'commentsManage', meta: { title: 'commentsManage' }},
      { path: 'settlement-manage', component: _import('order/settlementManage'), name: 'settlementManage', meta: { title: 'settlementManage' }},
      { path: 'settlement-detail/:sn', component: _import('order/settlementDetail'), name: 'settlementDetail', meta: { title: 'settlementDetail' }, hidden: true },
      { path: 'receipt-history', component: _import('order/receiptHistory'), name: 'receiptHistory', meta: { title: 'receiptHistory' }}
    ]
  },
  // 店铺管理
  {
    path: '/shop',
    component: Layout,
    redirect: '/shop/shop-manage/shop-list',
    name: 'shop',
    meta: { title: 'shop', icon: 'shop-manage' },
    children: [
      { path: 'shop-themes-pc', component: _import('shop/shopThemesPc'), name: 'shopThemesPc', meta: { title: 'shopThemesPc' }},
      { path: 'shop-themes-wap', component: _import('shop/shopThemesWap'), name: 'shopThemesWap', meta: { title: 'shopThemesWap' }},
      { path: 'shop-slide', component: _import('shop/shopSlide'), name: 'shopSlide', meta: { title: 'shopSlide' }},
      { path: 'shop-nav', component: _import('shop/shopNav'), name: 'shopNav', meta: { title: 'shopNav' }}
    ]
  },
  // 促销管理
  {
    path: '/promotions',
    component: Layout,
    redirect: '/promotions/group-buy-manager',
    name: 'promotions',
    meta: { title: 'promotions', icon: 'promotions-manage' },
    children: [
      { path: 'full-cut', component: _import('promotions/fullCut'), name: 'fullCut', meta: { title: 'fullCut' }},
      { path: 'single-cut', component: _import('promotions/singleCut'), name: 'singleCut', meta: { title: 'singleCut' }},
      { path: 'second-half-price', component: _import('promotions/secondHalfPrice'), name: 'secondHalfPrice', meta: { title: 'secondHalfPrice' }},
      { path: 'discount-manager', component: _import('promotions/discountManager'), name: 'discountManager', meta: { title: 'discountManager' }},
      { path: 'gift-manager', component: _import('promotions/giftManager'), name: 'giftManager', meta: { title: 'giftManager' }},
      { path: 'group-buy-manager', component: _import('promotions/groupBuyManager'), name: 'groupBuyManager', meta: { title: 'groupBuyManager' }},
      { path: 'group-time-limit', component: _import('promotions/timeLimit'), name: 'timeLimit', meta: { title: 'timeLimit' }},
      { path: 'add-time-limit', component: _import('promotions/addTimeLimit'), name: 'addTimeLimit', meta: { title: 'addTimeLimit' }, hidden: true },
      { path: 'activity-goods-data/:id', component: _import('promotions/activityGoodsData'), name: 'activityGoodsData', meta: { title: 'activityGoodsData' }, hidden: true },
      { path: 'add-group-buy-goods', component: _import('promotions/addGroupBuyGoods'), name: 'addGroupBuyGoods', meta: { title: 'addGroupBuyGoods' }, hidden: true },
      { path: 'edit-group-buy-goods/:goods_id', component: _import('promotions/editGroupBuyGoods'), name: 'editGroupBuyGoods', meta: { title: 'editGroupBuyGoods' }, hidden: true }
    ]
  },
  // 统计
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/generality-overview',
    name: 'statistics',
    meta: { title: 'statistics', icon: 'statistics-manage' },
    children: [
      { path: 'generality-overview', component: _import('statistics/generalityOverview'), name: 'generalityOverview', meta: { title: 'generalityOverview' }},
      {
        path: '/statistics/goods-analysis',
        component: _import('statistics/goodsAnalysis/index'),
        redirect: '/statistics/goods-analysis/goods-details',
        name: 'goodsAnalysis',
        meta: { title: 'goodsAnalysis' },
        children: [
          { path: 'goods-details', component: _import('statistics/goodsAnalysis/goodsDetailsAnalysis'), name: 'goodsDetailsAnalysis', meta: { title: 'goodsDetailsAnalysis' }},
          { path: 'price-sales', component: _import('statistics/goodsAnalysis/goodsPriceSales'), name: 'goodsPriceSales', meta: { title: 'goodsPriceSales' }},
          { path: 'hot-selling-goods', component: _import('statistics/goodsAnalysis/hotSellingGoods'), name: 'hotSellingGoods', meta: { title: 'hotSellingGoods' }}
        ]
      },
      {
        path: '/statistics/operate-report',
        component: _import('statistics/operateReport/index'),
        redirect: '/statistics/goods-analysis/goods-details',
        name: 'operateReport',
        meta: { title: 'operateReport' },
        children: [
          { path: 'regional-analysis', component: _import('statistics/operateReport/regionalAnalysis'), name: 'regionalAnalysis', meta: { title: 'regionalAnalysis' }},
          { path: 'sales-statistics', component: _import('statistics/operateReport/salesStatistics'), name: 'salesStatistics', meta: { title: 'salesStatistics' }},
          { path: 'buy-analysis', component: _import('statistics/operateReport/buyAnalysis'), name: 'buyAnalysis', meta: { title: 'buyAnalysis' }}
        ]
      },
      { path: 'traffic-statistics', component: _import('statistics/trafficStatistics'), name: 'trafficStatistics', meta: { title: 'trafficStatistics' }},
      { path: 'collect-statistics', component: _import('statistics/collectStatistics'), name: 'collectStatistics', meta: { title: 'collectStatistics' }},
      { path: 'log-manage', component: _import('statistics/logManage'), name: 'logManage', meta: { title: 'logManage' }}
    ]
  },
  // 客服管理
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/consultation',
    name: 'customer',
    meta: { title: 'customer', icon: 'user' },
    children: [
      { path: 'consultation', component: _import('customer-service/consultation'), name: 'consultation', meta: { title: 'consultation' }},
      { path: 'message', component: _import('customer-service/message'), name: 'message', meta: { title: 'message' }}
    ]
  },
  // 设置
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/shop',
    name: 'setting',
    meta: { title: 'setting', icon: 'setting-manage' },
    children: [
      { path: 'shop-setting', component: _import('setting/shopSettings'), name: 'shopSettings', meta: { title: 'shopSettings' }},
      { path: 'goods-warning', component: _import('setting/goodsWarning'), name: 'goodsWarning', meta: { title: 'goodsWarning' }},
      { path: 'grade-application', component: _import('setting/gradeApplication'), name: 'gradeApplication', meta: { title: 'gradeApplication' }, hidden: true }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
