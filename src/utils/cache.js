import axios from 'axios'

/** Data cache*/
class ItemCache {
  constructor(data, timeout) {
    // Cache data
    this.data = new Map()
    // timeout
    this.time = timeout
    // The cache data creation time is roughly set to the data acquisition time
    this.cacheTime = (new Date()).getTime()
  }
}

class ExpriesCache {
  // Define a static data map to act as a cache pool
  static cacheMap = new Map()
  // Whether the data has timed out
  static isOverTime(name) {
    const data = ExpriesCache.cacheMap.get(name)
    // No data must time out
    if (!data) return true
    // Gets the current timestamp of the system
    const currentTime = (new Date()).getTime()
    // Gets the number of seconds past the current time and the storage time
    const overTime = (currentTime - data.cacheTime) / 1000
    // If the number of seconds passed is greater than the current timeout, null is also returned to fetch the data from the server
    if (Math.abs(overTime) > data.timeout) {
      // This code may not exist, and there will be no problem, but if there is this code, re-entering the method can reduce the judgment.
      ExpriesCache.cacheMap.delete(name)
      return true
    }
    // No timeout
    return false
  }
  // Is the current data timeout in the cache
  static has(name) {
    return !ExpriesCache.isOverTime(name)
  }
  // Deletes data from the cache
  static delete(name) {
    return ExpriesCache.cacheMap.delete(name)
  }
  // To obtain
  static get(name) {
    const isDataOverTiem = ExpriesCache.isOverTime(name)
    // If the data has timed out, null is returned, but there is no timeout, and the data is returned instead of the ItemCache object
    return isDataOverTiem ? null : ExpriesCache.cacheMap.get(name).data
  }
  // The default storage is 20 minutes
  static set(name, data, timeout = 1200) {
    // Set the itemCache
    const itemCache = new ItemCache(data, timeout)
    // The cache
    ExpriesCache.cacheMap.set(name, itemCache)
  }
}

// Data is stored
export const cache = {
  // data
  data: new Map(),
  // Cache for 10 minutes
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
 * Generate uniquekey
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
    return new Error('Generate a uniquekeyValue error')
  }
}

/**
 * You are advised to add cached data onlygetIncrease the cache
 * @param options
 * @returns {Function}
 */
export default (options = {}) => config => {
  const { url, method, params, data } = config
  // Whether to store locally
  const { local = false } = options
  // Create index index for request index index data for response index
  let index
  if (method === 'get') {
    index = generateKey(url, params)
  } else {
    index = generateKey(url, data)
  }
  const indexData = index + '-data'
  // Get the data
  let response = cache.get(indexData)
  let responsePromise = cache.get(index)
  // let response = ExpriesCache.get(indexData)
  // let responsePromise = ExpriesCache.get(index)
  // Checks if the cache is expired
  if (response) {
    return Promise.resolve(JSON.parse(JSON.stringify(response))) // An object is a reference to prevent contamination of the data source
  } else if (!responsePromise) {
    responsePromise = (async() => {
      try {
        const response = await axios.defaults.adapter(config)
        // ExpriesCache.set(indexData, response, 10)
        cache.set(indexData, response, local)
        return Promise.resolve(JSON.parse(JSON.stringify(response))) // Sending the same request many times at the same time, there is no way to prevent the pollution of the data source, only to implement in the business
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
