import Vue from 'vue'
import axios from 'axios'
import { Loading } from 'element-ui'
import Storage from '@/utils/storage'
import store from '@/store'
import https from 'https'
import checkToken from '@/utils/checkToken'
import { api } from '~/ui-domain'
const qs = require('qs')

// createaxiosThe instance
const service = axios.create({
  baseURL: api.address, // basisapi
  timeout: 5000, // Request timeout
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
})

// requestThe interceptor
service.interceptors.request.use(config => {
  if (/\/uploaders/.test(config.url)) {
    config.timeout = 60000
  }

  // For put/ Post requests, use Qs.Stringify to serialize the parameter
  const is_put_post = config.method === 'put' || config.method === 'post'
  const is_json = config.headers['Content-Type'] === 'application/json'
  const is_file = config.headers['Content-Type'] === 'multipart/form-data'
  if (is_put_post && is_json) {
    config.data = JSON.stringify(config.data)
  }
  if (is_put_post && !is_file && !is_json) {
    config.data = qs.stringify(config.data, { arrayFormat: 'repeat' })
  }

  // Do something before request is sent
  /** Configure full screen loading*/
  if (config.loading !== false) {
    const { loading } = config
    const is_num = typeof (config.loading) === 'number'
    if (is_num) config.loading_num = true
    // Prepare processing for the API request cache
    // config.loading = () => {
    //   return Loading.service({
    //     lock: true,
    //     background: `rgba(0, 0, 0, ${is_num ? loading : '0.8'})`,
    //     spinner: 'el-icon-loading'
    //   })
    // }
    config.loading = Loading.service({
      lock: true,
      background: `rgba(0, 0, 0, ${is_num ? loading : '0.8'})`,
      spinner: 'el-icon-loading'
    })
  }

  // uuid
  const uuid = Storage.getItem('seller_uuid')
  config.headers['uuid'] = uuid

  // Get access Token
  let accessToken = Storage.getItem('seller_access_token')
  if (accessToken) {
    config.headers['Authorization'] = accessToken
  }

  return config
}, error => {
  Promise.reject(error)
})

// responeThe interceptor
service.interceptors.response.use(
  async response => {
    await closeLoading(response)
    return response.data
  },
  async error => {
    await closeLoading(error)
    const error_response = error.response || {}
    const error_data = error_response.data || {}
    if (error_response.status === 403) {
      if (!Storage.getItem('seller_refresh_token')) return
      store.dispatch('fedLogoutAction')
      window.location.replace(`/login?forward=${location.pathname}`)
      return
    }
    if (error.config && error.config.message !== false) {
      let _message = error.code === 'ECONNABORTED' ? 'Connection timeout, please try again later！' : 'Network error, please try again later！'
      Vue.prototype.$message.error(error_data.message || _message)
    }
    return Promise.reject(error)
  }
)

/**
 * Turn off global loading
 * delay200Millisecond off to avoid eye movement
 * @param target
 */
const closeLoading = (target) => {
  const { loading, loading_num } = target.config
  if (!loading) return true
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      target.config.loading.close()
      resolve()
    }, loading_num ? 0 : 200)
  })
}

export default function request(options) {
  // If it is a request [refresh token, login, exit], there is no need to check token, direct request.
  if (/seller\/check\/token|seller\/login|seller\/members\/logout/.test(options.url)) {
    return service(options)
  }
  return new Promise((resolve, reject) => {
    checkToken(options).then(() => {
      service(options).then(resolve).catch(reject)
    })
  })
}
