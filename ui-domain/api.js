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
  address: 'http://52.53.155.58'
}

// 生产环境
export const pro = {
  address: env.API_ADDRESS || 'http://52.53.155.58'
}
