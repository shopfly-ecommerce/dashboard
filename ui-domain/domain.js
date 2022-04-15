/**
 * Created by Andste on 2018/7/2.
 * buyer_pc : buyersPCend
 * buyer_wap: buyersWAPend
 * seller   : Business center
 * admin    : Background management
 */

let env = process.server
  ? process.env
  : (global.window && window.__NUXT__.state ? window.__NUXT__.state.env : {})

// The development environment
export const dev = {
  buyer_pc: 'http://127.0.0.1:3000',
  buyer_wap: 'http://127.0.0.1:3001',
  seller: 'http://127.0.0.1:3002'
}

// The production environment
export const pro = {
  buyer_pc: env.DOMAIN_BUYER_PC || 'http://pc.javamall.natapp1.cc',
  buyer_wap: env.DOMAIN_BUYER_WAP || 'http://m.javamall.natapp.cc',
  seller: env.DOMAIN_SELLER || 'http://seller.javamall.natapp.cc'
}
