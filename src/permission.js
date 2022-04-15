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
      // Get store status
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
            errorMsg('Authentication failed, please login again！', 'Login error')
          })
        } else {
          next()
        }
      } else if (status === 'CLOSED') {
        errorMsg('Your store has been closed, please contact the administrator！')
      } else if (status === 'APPLY' || status === 'APPLYING') {
        errorMsg('Your shop is under application, please try again later！')
      } else if (status === 'REFUSED') {
        errorMsg('Your application has been rejected, please reapply or contact the administrator！')
      } else {
        store.dispatch('fedLogoutAction')
        MessageBox.confirm('The account has not applied to open a shop！', 'There is an error', {
          confirmButtonText: 'To open a shop',
          cancelButtonText: 'cancel',
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

const errorMsg = (msg, title = 'Permissions error') => {
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
