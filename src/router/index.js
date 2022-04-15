import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/views/layout/Layout'

Vue.use(Router)

export const constantRouterMap = [
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/login', component: () => import('@/views/login/login'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard' }
    }]
  }
]

// On the management
const liveRouterMap = {
  path: '/live-video',
  component: Layout,
  redirect: '/live-video/live-video-list',
  name: 'liveVideo',
  meta: { title: 'liveVideo', icon: 'live-manage' },
  children: [
    { path: 'live-video-list', component: () => import('@/views/live-video/liveVideoList'), name: 'liveVideoList', meta: { title: 'liveVideoList' }},
    { path: 'live-video-goods-list', component: () => import('@/views/live-video/liveVideoGoodsList'), name: 'liveVideoGoodsList', meta: { title: 'liveVideoGoodsList' }},
    { path: 'edit-live-video-goods/:room_id', component: () => import('@/views/live-video/editLiveVideoGoods'), name: 'editLiveVideoGoods', hidden: true, meta: { title: 'editLiveVideoGoods' }}
  ]
}

export const asyncRouterMap = [
  // Commodity management
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
      { path: 'goodsList', component: () => import('@/views/goods/goodsList'), name: 'goodsList', meta: { title: 'goodsList' }},
      { path: 'draftList', component: () => import('@/views/goods/draftList'), name: 'draftList', meta: { title: 'draftList' }},
      { path: 'tag-manage', component: () => import('@/views/goods/tagManage'), name: 'tagManage', meta: { title: 'tagManage' }},
      { path: 'tag-add/:tag_id', component: () => import('@/views/goods/tagAdd'), name: 'tagAdd', meta: { title: 'tagAdd' }, hidden: true },
      { path: 'recycleStation', component: () => import('@/views/goods/recycleStation'), name: 'recycleStation', meta: { title: 'recycleStation' }},
      { path: 'understock', component: () => import('@/views/goods/understock'), name: 'understock', meta: { title: 'understock' }},
      {
        path: '/goods/goodsSetting',
        component: () => import('@/views/goods/goods-setting/index'),
        redirect: '/goods/goods-setting/category-list',
        name: 'goodsSetting',
        meta: { title: 'goodsSetting' },
        children: [
          { path: 'categoryList', component: () => import('@/views/goods/goods-setting/categoryList'), name: 'categoryList', meta: { title: 'categoryList' }},
          { path: 'category-params/:id', component: () => import('@/views/goods/goods-setting/categoryParams'), name: 'categoryParams', hidden: true, meta: { title: 'categoryParams', noCache: true }},
          { path: 'brandList', component: () => import('@/views/goods/goods-setting/brandList'), name: 'brandList', meta: { title: 'brandList' }},
          { path: 'specList', component: () => import('@/views/goods/goods-setting/specList'), name: 'specList', meta: { title: 'specList' }},
          { path: 'goodsIndex', component: () => import('@/views/setting/shop-settings/goodsIndex'), name: 'goodsIndex', meta: { title: 'goodsIndex' }}
        ]
      },
      { path: 'good-publish/:goodsid?/:isdraft?', component: () => import('@/views/goods/goodsPublish'), name: 'goodPublish', meta: { title: 'goodPublish', noCache: true }, hidden: true }
    ]
  },
  // The order management
  {
    path: '/order',
    component: Layout,
    name: 'order',
    redirect: '/order/order-list',
    meta: { title: 'order', icon: 'order-manage' },
    children: [
      { path: 'orderList', component: () => import('@/views/order/orderList'), name: 'orderList', meta: { title: 'orderList' }},
      { path: 'detail/:sn', component: () => import('@/views/order/orderDetail'), name: 'orderDetail', hidden: true, meta: { title: 'orderDetail' }},
      { path: 'refundList', component: () => import('@/views/order/refundList'), name: 'refundList', meta: { title: 'refundList' }},
      { path: 'collectionList', component: () => import('@/views/order/collectionList'), name: 'collectionList', meta: { title: 'collectionList' }},
      { path: 'logisticsManage', component: () => import('@/views/order/logisticsManage'), name: 'logisticsManage', meta: { title: 'logisticsManage' }},
      { path: 'receiptHistory', component: () => import('@/views/order/receiptHistory'), name: 'receiptHistory', meta: { title: 'receiptHistory' }}
    ]
  },
  // Member management
  {
    path: '/member',
    component: Layout,
    redirect: '/member/member-manage/member-list',
    name: 'member',
    meta: { title: 'member', icon: 'member-manage' },
    children: [
      {
        path: '/member/memberManage',
        component: () => import('@/views/member/member-manage/index'),
        redirect: '/member/member-manage/member-list',
        name: 'memberManage',
        meta: { title: 'memberManage' },
        children: [
          { path: 'memberList', component: () => import('@/views/member/member-manage/memberList'), name: 'memberList', meta: { title: 'memberList' }},
          { path: 'memberRecycle', component: () => import('@/views/member/member-manage/memberRecycle'), name: 'memberRecycle', meta: { title: 'memberRecycle' }},
          { path: 'edit/:id', component: () => import('@/views/member/member-manage/memberEdit'), name: 'memberEdit', hidden: true, meta: { title: 'memberEdit' }}
        ]
      },
      {
        path: '/member/goodsComment',
        component: () => import('@/views/member/goods-comment/index'),
        redirect: '/member/goods-comment/goods-comment-list',
        name: 'goodsComment',
        meta: { title: 'goodsComment' },
        children: [
          { path: 'goods-comment-list', component: () => import('@/views/member/goods-comment/goodsCommentList'), name: 'mgoodsCommentList', meta: { title: 'goodsCommentList' }},
          { path: 'goods-ask-list', component: () => import('@/views/member/goods-comment/goodsAskList'), name: 'goodsAskList', meta: { title: 'goodsAskList' }}
        ]
      },
      {
        path: '/member/memberNotification',
        component: () => import('@/views/member/member-notification/index'),
        redirect: '/member/member-notification/notification-history',
        name: 'memberNotification',
        meta: { title: 'memberNotification' },
        children: [
          { path: 'notificationHistory', component: () => import('@/views/member/member-notification/notificationHistory'), name: 'notificationHistory', meta: { title: 'notificationHistory' }}
        ]
      }
    ]
  },
  // Sales management
  {
    path: '/promotions',
    component: Layout,
    redirect: '/promotions/group-buy-manager',
    name: 'promotions',
    meta: { title: 'promotions', icon: 'promotions-manage' },
    children: [
      { path: 'fullCut', component: () => import('@/views/promotions/fullCut'), name: 'fullCut', meta: { title: 'fullCut' }},
      { path: 'singleCut', component: () => import('@/views/promotions/singleCut'), name: 'singleCut', meta: { title: 'singleCut' }},
      { path: 'secondHalfPrice', component: () => import('@/views/promotions/secondHalfPrice'), name: 'secondHalfPrice', meta: { title: 'secondHalfPrice' }},
      { path: 'discountManager', component: () => import('@/views/promotions/discountManager'), name: 'discountManager', meta: { title: 'discountManager' }},
      { path: 'giftManager', component: () => import('@/views/promotions/giftManager'), name: 'giftManager', meta: { title: 'giftManager' }},
      {
        path: 'groupBuyManage',
        component: () => import('@/views/promotions/groupBuyManage/index'),
        redirect: '/promotions/groupBuyManage/group-buy-list',
        name: 'groupBuyManage',
        meta: { title: 'groupBuyManage' },
        children: [
          { path: 'group-buy-list', component: () => import('@/views/promotions/groupBuyManage/groupBuyList'), name: 'groupBuyList', meta: { title: 'groupBuyList' }},
          { path: 'group-buy-category', component: () => import('@/views/promotions/groupBuyManage/groupBuyCategory'), name: 'groupBuyCategory', meta: { title: 'groupBuyCategory' }},
          { path: 'group-buy-activity-list/:id', component: () => import('@/views/promotions/groupBuyManage/groupBuyActivityManage'), name: 'groupBuyActivityManage', hidden: true, meta: { title: 'groupBuyActivityManage' }},
          { path: 'view-group-buy-list/:id', component: () => import('@/views/promotions/groupBuyManage/viewGroupBuyList'), name: 'viewGroupBuyList', hidden: true, meta: { title: 'viewGroupBuyList' }},
          { path: 'group-buy-goods-info/:id', component: () => import('@/views/promotions/groupBuyManage/groupBuyGoodsInfo'), name: 'groupBuyGoodsInfo', hidden: true, meta: { title: 'groupBuyGoodsInfo' }}
        ]
      },
      {
        path: '/pointsMallManage',
        component: () => import('@/views/promotions/points-mall-manage/index'),
        redirect: '/promotions/points-mall-manage/points-classify',
        name: 'pointsMallManage',
        meta: { title: 'pointsMallManage' },
        children: [
          { path: 'pointsClassify', component: () => import('@/views/promotions/points-mall-manage/pointsClassify'), name: 'pointsClassify', meta: { title: 'pointsClassify' }},
          { path: 'pointsGoods', component: () => import('@/views/promotions/points-mall-manage/pointsGoods'), name: 'pointsGoods', meta: { title: 'pointsGoods' }}
        ]
      },
      { path: 'seckillManage', component: () => import('@/views/promotions/timeLimit'), name: 'seckillManage', meta: { title: 'seckillManage' }},
      { path: 'add-time-limit/:id', component: () => import('@/views/promotions/addTimeLimit'), name: 'addTimeLimit', meta: { title: 'addTimeLimit', noCache: true }, hidden: true },
      { path: 'activity-goods-data/:id', component: () => import('@/views/promotions/activityGoodsData'), name: 'activityGoodsData', meta: { title: 'activityGoodsData' }, hidden: true },
      { path: 'group-buy-goods/:goods_id?', component: () => import('@/views/promotions/groupBuyManage/groupBuyGoods'), name: 'groupBuyGoods', meta: { title: 'groupBuyGoods' }, hidden: true }
    ]
  },
  // Page management
  {
    path: '/page',
    component: Layout,
    redirect: '/page/pc-decoration/pc-theme',
    name: 'page',
    meta: { title: 'page', icon: 'page-manage' },
    children: [
      {
        path: '/page/pcDecoration',
        component: () => import('@/views/page/pc-decoration/index'),
        redirect: '/page/pc-decoration/floor',
        name: 'pcDecoration',
        meta: {
          title: 'pcDecoration'
        },
        children: [
          { path: 'floor', component: () => import('@/views/page/pc-decoration/pcFloorManage'), name: 'pcFloorManage', meta: { title: 'pcFloorManage' }},
          { path: 'focus', component: () => import('@/views/page/pc-decoration/pcFocusManage'), name: 'pcFocusManage', meta: { title: 'pcFocusManage' }},
          { path: 'pcSiteMenu', component: () => import('@/views/page/pc-decoration/pcSiteMenu'), name: 'pcSiteMenu', meta: { title: 'pcSiteMenu' }}
        ]
      },
      {
        path: '/page/mobileDecoration',
        component: () => import('@/views/page/mobile-decoration/index'),
        redirect: '/page/mobile-decoration/floor',
        name: 'mobileDecoration',
        meta: {
          title: 'mobileDecoration'
        },
        children: [
          { path: 'floor', component: () => import('@/views/page/mobile-decoration/mobileFloorManage'), name: 'mobileFloorManage', meta: { title: 'mobileFloorManage' }},
          { path: 'focus', component: () => import('@/views/page/mobile-decoration/mobileFocusManage'), name: 'mobileFocusManage', meta: { title: 'mobileFocusManage' }},
          { path: 'mobileSiteMenu', component: () => import('@/views/page/mobile-decoration/mobileSiteMenu'), name: 'mobileSiteMenu', meta: { title: 'mobileSiteMenu' }}
        ]
      },
      {
        path: '/page/pageSetting',
        component: () => import('@/views/page/page-setting/index'),
        redirect: '/page/page-setting/hot-keyword',
        name: 'pageSetting',
        meta: { title: 'pageSetting' },
        children: [
          { path: 'hotKeyword', component: () => import('@/views/page/page-setting/hotKeyword'), name: 'hotKeyword', meta: { title: 'hotKeyword' }}
        ]
      }
    ]
  },
  // statistical
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/generality-overview',
    name: 'statistics',
    meta: { title: 'statistics', icon: 'statistics-manage' },
    children: [
      { path: 'platformOverview', component: () => import('@/views/statistics/generalityOverview'), name: 'platformOverview', meta: { title: 'platformOverview' }},
      {
        path: '/statistics/memberAnalysis',
        component: () => import('@/views/statistics/member-analysis/index'),
        redirect: '/statistics/member-analysis/order-amount',
        name: 'memberAnalysis',
        meta: { title: 'memberAnalysis' },
        children: [
          { path: 'orderAmount', component: () => import('@/views/statistics/member-analysis/orderAmount'), name: 'orderAmount', meta: { title: 'orderAmount' }},
          { path: 'addedMember', component: () => import('@/views/statistics/member-analysis/addedMember'), name: 'addedMember', meta: { title: 'addedMember' }}
        ]
      },
      {
        path: '/statistics/goodsAnalysis',
        component: () => import('@/views/statistics/goodsAnalysis/index'),
        redirect: '/statistics/goods-analysis/goods-details',
        name: 'goodsAnalysis',
        meta: { title: 'goodsAnalysis' },
        children: [
          { path: 'goodsSetails', component: () => import('@/views/statistics/goodsAnalysis/goodsDetailsAnalysis'), name: 'goodsDetailsAnalysis', meta: { title: 'goodsDetailsAnalysis' }},
          { path: 'priceSales', component: () => import('@/views/statistics/goodsAnalysis/goodsPriceSales'), name: 'goodsPriceSales', meta: { title: 'goodsPriceSales' }},
          { path: 'hotSellingGoods', component: () => import('@/views/statistics/goodsAnalysis/hotSellingGoods'), name: 'hotSellingGoods', meta: { title: 'hotSellingGoods' }}
        ]
      },
      {
        path: '/statistics/industryAnalysis',
        component: () => import('@/views/statistics/industry-analysis/index'),
        redirect: '/statistics/industry-analysis/industry-scale',
        name: 'industryAnalysis',
        meta: { title: 'industryAnalysis' },
        children: [
          { path: 'industryScale', component: () => import('@/views/statistics/industry-analysis/industryScale'), name: 'industryScale', meta: { title: 'industryScale' }},
          { path: 'generalityOverview', component: () => import('@/views/statistics/industry-analysis/generalityOverview'), name: 'generalityOverview', meta: { title: 'generalityOverview' }}
        ]
      },
      {
        path: '/statistics/operateReport',
        component: () => import('@/views/statistics/operateReport/index'),
        redirect: '/statistics/operate-report/regional-analysis',
        name: 'operateReport',
        meta: { title: 'operateReport' },
        children: [
          { path: 'regionalAnalysis', component: () => import('@/views/statistics/operateReport/regionalAnalysis'), name: 'regionalAnalysis', meta: { title: 'regionalAnalysis' }},
          { path: 'salesStatistics', component: () => import('@/views/statistics/operateReport/salesStatistics'), name: 'salesStatistics', meta: { title: 'salesStatistics' }},
          { path: 'buyAnalysis', component: () => import('@/views/statistics/operateReport/buyAnalysis'), name: 'buyAnalysis', meta: { title: 'buyAnalysis' }}
        ]
      },
      { path: 'trafficStatistics', component: () => import('@/views/statistics/trafficStatistics'), name: 'trafficStatistics', meta: { title: 'trafficStatistics' }},
      { path: 'collectStatistics', component: () => import('@/views/statistics/collectStatistics'), name: 'collectStatistics', meta: { title: 'collectStatistics' }},
      { path: 'customerPriceDistribution', component: () => import('@/views/statistics/customerPriceDistribution/customerPriceDistribution'), name: 'customerPriceDistribution', meta: { title: 'customerPriceDistribution' }},
      { path: 'refundStatistics', component: () => import('@/views/statistics/refundStatistics/refundStatistics'), name: 'refundStatistics', meta: { title: 'refundStatistics' }},
      { path: 'logManage', component: () => import('@/views/statistics/logManage'), name: 'logManage', meta: { title: 'logManage' }, hidden: true }
    ]
  },

  // Set up the
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/shop-settings/system',
    name: 'setting',
    meta: { title: 'setting', icon: 'setting-manage' },
    children: [

      { path: 'systemSettings', component: () => import('@/views/setting/shop-settings/systemSettings'), name: 'systemSettings', meta: { title: 'systemSettings' }},
      { path: 'smtpSettings', component: () => import('@/views/setting/shop-settings/SMTPSettings'), name: 'smtpSettings', meta: { title: 'smtpSettings' }},
      { path: 'payment', component: () => import('@/views/setting/payment-and-delivery/payment'), name: 'paymentSettings', meta: { title: 'payment' }},
      { path: 'express', component: () => import('@/views/setting/payment-and-delivery/express'), name: 'expressSettings', meta: { title: 'express' }},
      { path: 'storageSolution', component: () => import('@/views/setting/shop-settings/storageSolution'), name: 'storageSolution', meta: { title: 'storageSolution' }},
      { path: 'member', component: () => import('@/views/setting/message-settings/memberMessage'), name: 'memberMessageSettings', meta: { title: 'memberMessage' }},
      { path: 'administratorManage', component: () => import('@/views/setting/auth-settings/administratorManage'), name: 'administratorManage', meta: { title: 'administratorManage' }},
      { path: 'roleManage', component: () => import('@/views/setting/auth-settings/roleManage'), name: 'roleManage', meta: { title: 'roleManage' }}
    ]
  },
  // The development of
  {
    path: '/development',
    component: Layout,
    redirect: '/development/tool-manage/menu-manage',
    name: 'development',
    meta: { title: 'development', icon: 'development-manage' },
    children: [
      {
        path: '/development/toolManage',
        component: () => import('@/views/development/tool-manage/index'),
        redirect: '/development/tool-manage/menu-manage',
        name: 'toolManage',
        meta: { title: 'toolManage' },
        children: [
          { path: 'menuManage', component: () => import('@/views/development/tool-manage/menuManage'), name: 'menuManage', meta: { title: 'menuManage' }},
          { path: 'expressPlatformSettings', component: () => import('@/views/setting/shop-settings/expressPlatformSettings'), name: 'expressPlatformSettings', meta: { title: 'expressPlatformSettings' }},
          { path: 'regionalManagementSettings', component: () => import('@/views/setting/payment-and-delivery/regionalManagement'), name: 'regionalManagementSettings', meta: { title: 'regionalManagement' }}

        ]
      },
      {
        path: '/development/articleManage',
        component: () => import('@/views/development/article-manage/index'),
        redirect: '/development/article-manage/article-list',
        name: 'articleManage',
        meta: { title: 'articleManage' },
        children: [
          { path: 'articleCategory', component: () => import('@/views/development/article-manage/articleCategory'), name: 'articleCategory', meta: { title: 'articleCategory' }},
          { path: 'articleList', component: () => import('@/views/development/article-manage/articleList'), name: 'articleList', meta: { title: 'articleList' }},
          { path: 'add', component: () => import('@/views/development/article-manage/addArticle'), name: 'addArticle', hidden: true, meta: { title: 'addArticle' }}
        ]
      }
    ]
  },
  // distribution
  {
    path: '/distribution',
    component: Layout,
    redirect: '/distribution/extract-tpl',
    name: 'distribution',
    meta: { title: 'distribution', icon: 'development-manage' },
    children: [
      {
        path: '/distribution/extractTpl',
        component: () => import('@/views/distribution/extractTpl/index'),
        redirect: '/distribution/extract-tpl/upgrade-logs',
        name: 'extractTpl',
        meta: { title: 'extractTpl' },
        children: [
          { path: 'perAccomplishmentTpl', component: () => import('@/views/distribution/extractTpl/perAccomplishmentTpl'), name: 'perAccomplishmentTpl', meta: { title: 'perAccomplishmentTpl' }},
          { path: 'upgradeLogs', component: () => import('@/views/distribution/extractTpl/upgradeLogs'), name: 'upgradeLogs', meta: { title: 'upgradeLogs' }}
        ]
      },
      {
        path: '/distribution/distributor',
        component: () => import('@/views/distribution/distributor/index'),
        redirect: '/distribution/distributor/distributor-list',
        name: 'distributor',
        meta: { title: 'distributor' },
        children: [
          { path: 'distributor-list', component: () => import('@/views/distribution/distributor/distributorList'), name: 'distributorList', meta: { title: 'distributorList' }},
          { path: 'distributor-statistics', component: () => import('@/views/distribution/distributor/distributorStatistics'), name: 'distributorStatistics', meta: { title: 'distributorStatistics' }, hidden: true }
        ]
      },
      {
        path: '/distribution/achievement',
        component: () => import('@/views/distribution/achievement/index'),
        redirect: '/distribution/achievement/achievement-list',
        name: 'achievement',
        meta: { title: 'achievement' },
        children: [
          { path: 'achievement-list', component: () => import('@/views/distribution/achievement/achievementList'), name: 'achievementList', meta: { title: 'achievementList' }},
          { path: 'bill-list', component: () => import('@/views/distribution/achievement/billList'), name: 'billList', meta: { title: 'billList' }, hidden: true },
          { path: 'bill-details', component: () => import('@/views/distribution/achievement/billDetails'), name: 'billDetails', meta: { title: 'billDetails' }, hidden: true }
        ]
      },
      {
        path: '/distribution/putforwardManage',
        component: () => import('@/views/distribution/putforward/index'),
        redirect: '/distribution/put-forward/put-forward-settings',
        name: 'putforwardManage',
        meta: { title: 'putforwardManage' },
        children: [
          { path: 'putforwardSettings', component: () => import('@/views/distribution/putforward/putforwardSettings'), name: 'putforwardSettings', meta: { title: 'putforwardSettings' }},
          { path: 'putforwardApply', component: () => import('@/views/distribution/putforward/putforwardApply'), name: 'putforwardApply', meta: { title: 'putforwardApply' }}
        ]
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// If you turn it onIM
const chatRouter = { path: '/chat', component: () => import('@/views/chat/chat'), name: 'chat' }
if (process.env.IM) {
  asyncRouterMap.push(chatRouter)
}

if (process.env.LIVEVIDEO) {
  asyncRouterMap.splice(3, 0, liveRouterMap)
}
