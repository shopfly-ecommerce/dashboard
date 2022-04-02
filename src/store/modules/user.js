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
   * 设置用户信息
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
   * 设置访问令牌
   * @param state
   * @param token
   * @constructor
   */
  SET_ACCESS_TOKEN: (state, token) => {
    const expires = new Date(jwt_decode(token).exp * 1000)
    Storage.setItem('seller_access_token', token, { expires })
  },
  /**
   * 设置刷新令牌
   * @param state
   * @param token
   * @constructor
   */
  SET_REFRESH_TOKEN: (state, token) => {
    const expires = new Date(jwt_decode(token).exp * 1000)
    Storage.setItem('seller_refresh_token', token, { expires })
    // 同时延长用户信息失效时间
    const user = Storage.getItem('seller_user')
    const uid = Storage.getItem('seller_uid')
    Storage.setItem('seller_user', user, { expires })
    Storage.setItem('seller_uid', uid, { expires })
  },
  /**
   * 移除用户信息
   * @param state
   * @constructor
   */
  REMOVE_USER: (state) => {
    state.user = ''
    Storage.removeItem('seller_user')
    Storage.removeItem('seller_uid')
  },
  /**
   * 移除访问令牌
   * @param state
   * @constructor
   */
  REMOVE_ACCESS_TOKEN: (state) => {
    Storage.removeItem('seller_access_token')
  },
  /**
   * 移除刷新令牌
   * @param state
   * @constructor
   */
  REMOVE_REFRESH_TOKEN: (state) => {
    Storage.removeItem('seller_refresh_token')
  },
  /**
   * 设置店铺信息
   * @param state
   * @param shopInfo
   * @constructor
   */
  SET_SHOP_INFO: (state, shopInfo) => {
    state.shop = shopInfo
    Storage.setItem('seller_shop', JSON.stringify(shopInfo), { expires: 30 })
  },
  /**
   * 移除店铺信息
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
   * 用户名登录
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
   * 获取店铺信息
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
   * 登出
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
   * 设置访问令牌
   * @param commit
   * @param token
   */
  setAccessTokenAction({ commit }, token) {
    commit('SET_ACCESS_TOKEN', token)
  },
  /**
   * 设置刷新令牌
   * @param commit
   * @param token
   */
  setRefreshTokenAction({ commit }, token) {
    commit('SET_REFRESH_TOKEN', token)
  },
  /**
   * 前端退出
   * @param commit
   */
  fedLogoutAction: ({ commit }) => {
    commit('REMOVE_USER')
    commit('REMOVE_SHOP_INFO')
    commit('REMOVE_ACCESS_TOKEN')
    commit('REMOVE_REFRESH_TOKEN')
  }
}
