let api    = require('./api')
let domain = require('./domain')

let env = process.server
  ? process.env
  : (global.window && window.__NUXT__.state ? window.__NUXT__.state.env : {})

// 后台提供的API模式【dev|pro】
let api_model = 'dev'
// 当前前台是否为开发模式
let is_dev = process.env.NODE_ENV === 'development'

module.exports =  {
  // API模式
  api_model,
  // 开发环境下的API
  api_dev: api.dev,
  // 生产环境下的API
  api_pro: api.pro,
  // 开发环境下的域名
  domain_dev: domain.dev,
  // 生产环境下的域名
  domain_pro: domain.pro,
  // API根据前台环境自动适配
  api: is_dev ? api.dev : api.pro,
  // 域名根据前台环境自动适配
  domain: is_dev ? domain.dev : domain.pro
}
