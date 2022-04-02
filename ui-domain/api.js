/**
 * Created by Andste on 2018/7/2.
 * base    : 基础业务API
 * buyer   : 买家API
 * seller  : 商家中心API
 * admin   ：后台管理API
 */

let env = process.server
  ? process.env
  : (global.window && window.__NUXT__.state ? window.__NUXT__.state.env : {})

// 开发环境
export const dev = {
  base: 'https://api-b2c-v710.javamall.com.cn/base',
  buyer: 'http://localhost:8080',
  seller: 'https://api-b2c-v710.javamall.com.cn/seller',
  live: 'https://api-b2c-v710.javamall.com.cn/live',
  im: 'https://api-b2c-v710.javamall.com.cn/im'
}

// 生产环境
export const pro = {
  base: env.API_BASE || 'https://api-b2c-v710.javamall.com.cn/base',
  buyer: env.API_BUYER || 'https://api-b2c-v710.javamall.com.cn/buyer',
  seller: env.API_SELLER || 'https://api-b2c-v710.javamall.com.cn/seller',
  live: env.API_LIVE || 'https://api-b2c-v710.javamall.com.cn/live',
  im: env.API_IM || 'https://api-b2c-v710.javamall.com.cn/im'
}
