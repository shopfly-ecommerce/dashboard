import * as _api from './api'
import * as _domain from './domain'

// 当前前台是否为开发模式
let is_dev = process.env.NODE_ENV === 'development'

// 后台提供的API模式【dev|pro】
export const api_model = 'dev'
// API根据前台环境自动适配
export const api = is_dev ? _api.dev : _api.pro
// 域名根据前台环境自动适配
export const domain = is_dev ? _domain.dev : _domain.pro
// 开发环境下的API
export const api_dev = _api.dev
// 生产环境下的API
export const api_pro = _api.pro
// 开发环境下的域名
export const domain_dev = _domain.dev
// 生产环境下的域名
export const domain_pro = _domain.pro
