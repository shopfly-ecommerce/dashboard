import { asyncRouterMap, constantRouterMap } from '@/router'
import { getUserRolesPermissions } from '@/api/login'
import Storage from '@/utils/storage'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    permission_chat: false
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit, state }) {
      let user = Storage.getItem('seller_user')
      if (!user) return Promise.reject()
      user = JSON.parse(user)
      let role_id = user.role_id
      if (user.founder === 1) role_id = 0
      return new Promise((resolve, reject) => {
        if (role_id === 0) {
          state.permission_chat = true
          commit('SET_ROUTERS', asyncRouterMap)
          resolve()
        } else {
          getUserRolesPermissions(role_id).then(response => {
            if (response.includes('chat')) {
              state.permission_chat = true
            }
            let accessedRouters = filterRoleRouter(asyncRouterMap, response)
            commit('SET_ROUTERS', accessedRouters)
            resolve()
          }).catch(reject)
        }
      })
    }
  }
}

// Whitelist for role authentication is not required
const whiteList = []

/**
 * Recursively filter out authorized routes
 * @param routers
 * @param names
 * @returns {Array}
 */
function filterRoleRouter(routers, names) {
  const _routers = []
  routers.forEach(item => {
    if (whiteList.includes(item.name) || names.includes(item.name) || item.hidden) {
      if (item.children) {
        item.children = filterRoleRouter(item.children, names)
      }
      _routers.push(item)
    }
  })
  return _routers
}

export default permission
