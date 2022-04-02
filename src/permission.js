import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { MessageBox, Message } from 'element-ui'
import Storage from '@/utils/storage'
import * as API_Shop from '@/api/shop'
import { domain } from '~/ui-domain'

const whiteList = ['/login']

async function routerBeforeEach(to, from, next) {
  NProgress.start()
  const refreshToken = Storage.getItem('seller_refresh_token')
  if (refreshToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // 获取店铺状态
      // const status = await API_Shop.getShopStatus()
      let status = 'OPEN'
      if (status === 'OPEN') {
        const shopInfo = Storage.getItem('seller_shop')
        if (!shopInfo) await store.dispatch('getShopInfoAction')
        if (store.getters.addRouters.length === 0) {
          store.dispatch('GenerateRoutes').then(() => {
            router.addRoutes(store.getters.addRouters)
            next({ ...to, replace: true })
          }).catch(() => {
            errorMsg('验证失败，请重新登录！', '登录出错')
          })
        } else {
          next()
        }
      } else if (status === 'CLOSED') {
        errorMsg('您的店铺已被关闭，请联系管理员！')
      } else if (status === 'APPLY' || status === 'APPLYING') {
        errorMsg('您的店铺正在申请中，请稍后再试！')
      } else if (status === 'REFUSED') {
        errorMsg('您的开店申请被拒绝，请重新申请或联系管理员！')
      } else {
        store.dispatch('fedLogoutAction')
        MessageBox.confirm('账号尚未申请开店！', '出现错误', {
          confirmButtonText: '去开店',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          location.replace(`${domain.buyer_pc}/shop/apply`)
        })
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
}

const errorMsg = (msg, title = '权限错误') => {
  store.dispatch('fedLogoutAction')
  MessageBox.alert(msg, title, {
    type: 'error',
    callback: () => {
      location.replace(`/login?forward=${location.pathname}`)
    }
  })
}

router.beforeEach(routerBeforeEach)

router.afterEach(NProgress.done)
