import axios from 'axios'

/** 数据缓存 */
class ItemCache {
  constructor(data, timeout) {
    // 缓存数据
    this.data = new Map()
    // 超时时间
    this.time = timeout
    // 缓存数据创建的时间 大致设定为数据获得的时间
    this.cacheTime = (new Date()).getTime()
  }
}

class ExpriesCache {
  // 定义静态数据map来作为缓存池
  static cacheMap = new Map()
  // 数据是否超时
  static isOverTime(name) {
    const data = ExpriesCache.cacheMap.get(name)
    // 没有数据 一定超时
    if (!data) return true
    // 获取系统当前时间戳
    const currentTime = (new Date()).getTime()
    // 获取当前时间与存储时间的过去的秒数
    const overTime = (currentTime - data.cacheTime) / 1000
    // 如果过去的秒数大于当前的超时时间，也返回null让其去服务端取数据
    if (Math.abs(overTime) > data.timeout) {
      // 此代码可以没有，不会出现问题，但是如果有此代码，再次进入该方法就可以减少判断。
      ExpriesCache.cacheMap.delete(name)
      return true
    }
    // 不超时
    return false
  }
  // 当前data在 cache 中是否超时
  static has(name) {
    return !ExpriesCache.isOverTime(name)
  }
  // 删除 cache 中的 data
  static delete(name) {
    return ExpriesCache.cacheMap.delete(name)
  }
  // 获取
  static get(name) {
    const isDataOverTiem = ExpriesCache.isOverTime(name)
    // 如果 数据超时，返回null，但是没有超时，返回数据，而不是 ItemCache 对象
    return isDataOverTiem ? null : ExpriesCache.cacheMap.get(name).data
  }
  // 默认存储20分钟
  static set(name, data, timeout = 1200) {
    // 设置 itemCache
    const itemCache = new ItemCache(data, timeout)
    // 缓存
    ExpriesCache.cacheMap.set(name, itemCache)
  }
}

// 数据存储
export const cache = {
  // 数据
  data: new Map(),
  // 缓存时间 10分钟
  time: 1200,
  set(key, data, bol = false) {
    if (bol) {
      localStorage.setItem(key, JSON.stringify(data))
    } else {
      this.data.set(key, data)
    }
  },
  get(key, bol = false) {
    if (bol) {
      return JSON.parse(localStorage.getItem(key))
    } else {
      return this.data.has(key) && this.data.get(key)
    }
  },
  clear(key, bol = false) {
    if (bol) {
      localStorage.removeItem(key)
    } else {
      this.data.delete(key)
    }
  }
}

/**
 * 生成唯一的key
 * @param url
 * @param params
 * @returns {*}
 */
function generateKey(url, params = {}) {
  const sortedParams = Object.keys(params).sort().reduce((result, key) => {
    result[key] = params[key]
    return result
  }, {})
  try {
    url += `?${JSON.stringify(sortedParams)}`
    return url
  } catch (_) {
    return new Error('生成唯一key值发生错误')
  }
}

/**
 * 增加缓存数据 建议只给get增加缓存
 * @param options
 * @returns {Function}
 */
export default (options = {}) => config => {
  const { url, method, params, data } = config
  // 是否进行本地存储
  const { local = false } = options
  // 建立索引 index为请求索引 indexData为响应索引
  let index
  if (method === 'get') {
    index = generateKey(url, params)
  } else {
    index = generateKey(url, data)
  }
  const indexData = index + '-data'
  // 获得数据
  let response = cache.get(indexData)
  let responsePromise = cache.get(index)
  // let response = ExpriesCache.get(indexData)
  // let responsePromise = ExpriesCache.get(index)
  // 检测缓存是否过期
  if (response) {
    return Promise.resolve(JSON.parse(JSON.stringify(response))) // 对象是引用，为了防止污染数据源
  } else if (!responsePromise) {
    responsePromise = (async() => {
      try {
        const response = await axios.defaults.adapter(config)
        // ExpriesCache.set(indexData, response, 10)
        cache.set(indexData, response, local)
        return Promise.resolve(JSON.parse(JSON.stringify(response))) // 同时发送多次一样的请求，没办法防止污染数据源，只有业务中去实现
      } catch (reason) {
        // ExpriesCache.delete(index)
        // ExpriesCache.delete(indexData)
        cache.clear(index)
        cache.clear(indexData)
        return Promise.reject(reason)
      }
    })()
    // put the promise for the non-transformed response into cache as a placeholder
    ExpriesCache.set(index, responsePromise, 10)
    // cache.set(index, responsePromise)
  }
  return responsePromise
}
