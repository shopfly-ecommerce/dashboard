/**
 * Created by Andste on 2018/7/2.
 * base    : Based on the businessAPI
 * buyer   : buyersAPI
 * seller  : Business centerAPI
 * admin   ：Background managementAPI
 */

let env = process.server
  ? process.env
  : (global.window && window.__NUXT__.state ? window.__NUXT__.state.env : {})

// The development environment
export const dev = {
  address: 'http://api.shopfly.cloud'
}

// The production environment
export const pro = {
  address: env.API_ADDRESS || 'http://api.shopfly.cloud'
}
