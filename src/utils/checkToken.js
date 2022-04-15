/**
 * Created by Andste on 2018/5/7.
 */

import Storage from './storage'
import store from '@/store'
import router from '@/router'
import * as API_Common from '@/api/common'
import { MessageBox } from 'element-ui'

/**
 * checktoken：
 * 1. user/accessToken/refreshTokenNone of them exist.
 *    Indicates that the user is not logged in and has no permissions to redirect to the login page
 * 2. There is noaccessToken, butuser/refreshTokenThere is.
 *    saidaccessTokenExpired and needs to be retrievedaccessToken。
 *    If I reacquireaccessTokenreturntokenInvalid error indicating that it has been logged out.
 * @param options
 * @returns {Promise<any>}
 */
export default function checkToken(options) {
  // user
  const user = Storage.getItem('seller_user')
  // Access Token
  const accessToken = Storage.getItem('seller_access_token')
  // The refresh Token
  const refreshToken = Storage.getItem('seller_refresh_token')
  // Return asynchronous method
  return new Promise((resolve, reject) => {
    /**
     * ifaccessToken、user、refreshTokenThere are.
     * Indicates that the necessary conditions exist, can be passed directly, and no subsequent operations are required.
     */
    if (accessToken && user && refreshToken) {
      resolve()
      return
    }
    /**
     * ifrefreshTokenoruserNo.
     * Indicates that the login has expired、orcookieThere is a problem and you need to log in again.
     */
    if (!refreshToken || !user) {
      MessageBox.alert('Your login status has expired, please login again！', 'Permissions error', {
        type: 'error',
        callback: () => {
          store.dispatch('fedLogoutAction')
          window.location.replace(`/login?forward=${location.pathname}`)
        }
      })
      return
    }
    /**
     * There is noaccessToken, butuser/refreshTokenThere is.
     * Indicates that the user is logged in, butaccessTokenExpired and needs to be retrievedaccessToken。
     * If there is noneedToken, indicating that there is no need to wait to get a new oneaccessTokenAsk later.
     * Otherwise, you need to wait
     */
    if (!accessToken && refreshToken) {
      /**
       * If its not refreshedtokenLock, need to refreshtoken。
       * If there is a refreshtokenLock, then enter the loop detection.
       */
      if (!window.__refreshTokenLock__) {
        // Console.log (options. Url + | detects that the accessToken has failed, and this request waits for the refresh token. )
        // Start requesting a new Token and lock it.
        window.__refreshTokenLock__ = true
        API_Common.refreshToken().then(response => {
          store.dispatch('setAccessTokenAction', response.accessToken)
          store.dispatch('setRefreshTokenAction', response.refreshToken)
          window.__refreshTokenLock__ = null
          // Console. log(options. Url + | has got the new token. )
          resolve()
        }).catch(() => {
          window.__refreshTokenLock__ = undefined
          store.dispatch('fedLogoutAction')
          window.location.replace(`/login?forward=${location.pathname}`)
        })
      } else {
        // Console.log ( Enter loop detection... )
        // Loop detection refreshes the Token lock, and when the refresh lock becomes null, the new Token has been retrieved.
        const checkLock = () => {
          setTimeout(() => {
            const __RTK__ = window.__refreshTokenLock__
            // Console.log (options. Url + | if youve got a new token: , ___ === null)
            if (__RTK__ === undefined) {
              // Console.log ( Login has expired, no more waiting... )
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
