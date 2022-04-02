const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  user: state => state.user.user,
  shopInfo: state => state.user.shop,
  permission_routers: state => state.permission.routers,
  permission_chat: state => state.permission.permission_chat,
  addRouters: state => state.permission.addRouters
}
export default getters
