/**
 * Created by Andste on 2018/5/7.
 */

import Storage from './storage'
import store from '@/store'
import router from '@/router'
import * as API_Common from '@/api/common'
import { MessageBox } from 'element-ui'

/**
 * 检查token：
 * 1. user/accessToken/refreshToken都不存在。
 *    表示用户没有登录，没有权限，重定向到登录页
 * 2. 不存在accessToken，但是user/refreshToken存在。
 *    表示accessToken过期，需要重新获取accessToken。
 *    如果重新获取accessToken返回token失效错误，说明已被登出。
 * @param options
 * @returns {Promise<any>}
 */
export default function checkToken(options) {
  // user
  const user = Storage.getItem('seller_user')
  // 访问Token
  const accessToken = Storage.getItem('seller_access_token')
  // 刷新Token
  const refreshToken = Storage.getItem('seller_refresh_token')
  // 返回异步方法
  return new Promise((resolve, reject) => {
    /**
     * 如果accessToken、user、refreshToken都存在。
     * 说明必要条件都存在，可以直接通过，并且不需要后续操作。
     */
    if (accessToken && user && refreshToken) {
      resolve()
      return
    }
    /**
     * 如果refreshToken或者user没有。
     * 说明登录已失效、或者cookie有问题，需要重新登录。
     */
    if (!refreshToken || !user) {
      MessageBox.alert('您的登录状态已失效，请重新登录！', '权限错误', {
        type: 'error',
        callback: () => {
          store.dispatch('fedLogoutAction')
          window.location.replace(`/login?forward=${location.pathname}`)
        }
      })
      return
    }
    /**
     * 不存在accessToken，但是user/refreshToken存在。
     * 说明用户已登录，只是accessToken过期，需要重新获取accessToken。
     * 如果没有needToken，说明不需要等待获取到新的accessToken后再请求。
     * 否则，需要等待
     */
    if (!accessToken && refreshToken) {
      /**
       * 如果没有刷新token锁，需要刷新token。
       * 如果有刷新token锁，则进入循环检测。
       */
      if (!window.__refreshTokenLock__) {
        // console.log(options.url + ' | 检测到accessToken失效，这个请求需要等待刷新token。')
        // 开始请求新的Token，并加锁。
        window.__refreshTokenLock__ = true
        API_Common.refreshToken().then(response => {
          store.dispatch('setAccessTokenAction', response.accessToken)
          store.dispatch('setRefreshTokenAction', response.refreshToken)
          window.__refreshTokenLock__ = null
          // console.log(options.url + ' | 已拿到新的token。')
          resolve()
        }).catch(() => {
          window.__refreshTokenLock__ = undefined
          store.dispatch('fedLogoutAction')
          window.location.replace(`/login?forward=${location.pathname}`)
        })
      } else {
        // console.log('进入循环检测...')
        // 循环检测刷新token锁，当刷新锁变为null时，说明新的token已经取回。
        const checkLock = () => {
          setTimeout(() => {
            const __RTK__ = window.__refreshTokenLock__
            // console.log(options.url + ' | 是否已拿到新的token：', __RTK__ === null)
            if (__RTK__ === undefined) {
              // console.log('登录已失效了，不用再等待了...')
              store.dispatch('fedLogoutAction')
              window.location.replace(`/login?forward=${location.pathname}`)
              return
            }
            __RTK__ === null
              ? resolve()
              : checkLock()
          }, 500)
        }
        checkLock()
      }
      return
    }
    resolve()
  })
}
