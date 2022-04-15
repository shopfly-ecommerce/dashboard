import * as API_Login from '@/api/login'
import * as API_Shop from '@/api/shop'
import Storage from '@/utils/storage'
import jwt_decode from 'jwt-decode'

// state
const _user = Storage.getItem('seller_user')
const _shop = Storage.getItem('seller_shop')
export const state = {
  user: _user ? JSON.parse(_user) : '',
  shop: _shop ? JSON.parse(_shop) : ''
}

// mutations
export const mutations = {
  /**
   * Set user information
   * @param state
   * @param user
   * @constructor
   */
  SET_USER: (state, user) => {
    state.user = user
    const { expires } = user
    Storage.setItem('seller_user', JSON.stringify(user), { expires })
    Storage.setItem('seller_uid', user.uid, { expires })
  },
  /**
   * Set the access token
   * @param state
   * @param token
   * @constructor
   */
  SET_ACCESS_TOKEN: (state, token) => {
    const expires = new Date(jwt_decode(token).exp * 1000)
    Storage.setItem('seller_access_token', token, { expires })
  },
  /**
   * Sets the refresh token
   * @param state
   * @param token
   * @constructor
   */
  SET_REFRESH_TOKEN: (state, token) => {
    const expires = new Date(jwt_decode(token).exp * 1000)
    Storage.setItem('seller_refresh_token', token, { expires })
    // At the same time extend the user information invalidation time
    const user = Storage.getItem('seller_user')
    const uid = Storage.getItem('seller_uid')
    Storage.setItem('seller_user', user, { expires })
    Storage.setItem('seller_uid', uid, { expires })
  },
  /**
   * Remove user information
   * @param state
   * @constructor
   */
  REMOVE_USER: (state) => {
    state.user = ''
    Storage.removeItem('seller_user')
    Storage.removeItem('seller_uid')
  },
  /**
   * Remove the access token
   * @param state
   * @constructor
   */
  REMOVE_ACCESS_TOKEN: (state) => {
    Storage.removeItem('seller_access_token')
  },
  /**
   * Removes the refresh token
   * @param state
   * @constructor
   */
  REMOVE_REFRESH_TOKEN: (state) => {
    Storage.removeItem('seller_refresh_token')
  },
  /**
   * Set store information
   * @param state
   * @param shopInfo
   * @constructor
   */
  SET_SHOP_INFO: (state, shopInfo) => {
    state.shop = shopInfo
    Storage.setItem('seller_shop', JSON.stringify(shopInfo), { expires: 30 })
  },
  /**
   * Remove store information
   * @param state
   * @constructor
   */
  REMOVE_SHOP_INFO: (state) => {
    state.shop = ''
    Storage.removeItem('seller_shop')
  }
}

// actions
export const actions = {
  /**
   * User name login
   * @param commit
   * @param params
   * @returns {Promise<any>}
   */
  loginAction({ commit }, params) {
    return new Promise((resolve, reject) => {
      API_Login.login(params).then(response => {
        const { access_token, refresh_token, ...user } = response
        const expires = new Date(jwt_decode(refresh_token).exp * 1000)
        commit('SET_USER', { ...user, expires })
        commit('SET_ACCESS_TOKEN', access_token)
        commit('SET_REFRESH_TOKEN', refresh_token)
        resolve()
      }).catch(reject)
    })
  },
  /**
   * Access to store information
   * @param commit
   * @returns {Promise<any>}
   */
  getShopInfoAction({ commit }) {
    return new Promise((resolve, reject) => {
      API_Shop.getShopData().then(response => {
        commit('SET_SHOP_INFO', response)
        resolve(response)
      }).catch(reject)
    })
  },
  /**
   * logout
   * @param dispatch
   * @returns {Promise<any>}
   */
  logoutAction({ dispatch }) {
    return new Promise((resolve, reject) => {
      API_Login.logout().then(() => {
        dispatch('fedLogoutAction')
        resolve()
      }).catch(reject)
    })
  },
  /**
   * Set the access token
   * @param commit
   * @param token
   */
  setAccessTokenAction({ commit }, token) {
    commit('SET_ACCESS_TOKEN', token)
  },
  /**
   * Sets the refresh token
   * @param commit
   * @param token
   */
  setRefreshTokenAction({ commit }, token) {
    commit('SET_REFRESH_TOKEN', token)
  },
  /**
   * The front-end exit
   * @param commit
   */
  fedLogoutAction: ({ commit }) => {
    commit('REMOVE_USER')
    commit('REMOVE_SHOP_INFO')
    commit('REMOVE_ACCESS_TOKEN')
    commit('REMOVE_REFRESH_TOKEN')
  }
}
