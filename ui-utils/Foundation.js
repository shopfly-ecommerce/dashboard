/**
 * Some common basic methods
 * unixToDate    willunixThe timestamp is converted to the specified format
 * dateToUnix    Transfer timeunixThe time stamp
 * deepClone     Make a deep copy of an object
 * formatPrice   Currency formatting
 * secrecyMobile Privacy protection of mobile phone number
 * randomString  Generates a random string of the specified length
 */

/**
 * willunixThe timestamp is converted to the specified format
 * @param unix   The time stamp【seconds】
 * @param format Transformation format
 * @returns {*|string}
 */
export function unixToDate(unix, format) {
  const RegExp = window.RegExp
  if (!unix) return unix
  let _format = format || 'yyyy-MM-dd hh:mm:ss'
  let d = new Date(unix * 1000)
  let o = {
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'h+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
    'q+': Math.floor((d.getMonth() + 3) / 3),
    S: d.getMilliseconds()
  }
  if (/(y+)/.test(_format)) _format = _format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (let k in o) if (new RegExp('(' + k + ')').test(_format)) _format = _format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  return _format
}

/**
 * Transfer timeunixThe time stamp
 * @param date
 * @returns {number} 【seconds】
 */
export function dateToUnix(date) {
  let newStr = date.replace(/:/g, '-')
  newStr = newStr.replace(/ /g, '-')
  let arr = newStr.split('-')
  let datum = new Date(Date.UTC(
    arr[0],
    arr[1] - 1,
    arr[2],
    arr[3] - 8 || -8,
    arr[4] || 0,
    arr[5] || 0
  ))
  return parseInt(datum.getTime() / 1000)
}

/**
 * Make a deep copy of an object
 * @param object
 * @returns {*}
 */
export function deepClone(object) {
  let str
  let newobj = object.constructor === Array ? [] : {}
  if (typeof object !== 'object') {
    return object
  } else if (window.JSON) {
    str = JSON.stringify(object)
    newobj = JSON.parse(str)
  } else {
    for (let i in object) {
      if (object.hasOwnProperty(i)) {
        newobj[i] = typeof object[i] === 'object' ? deepClone(object[i]) : object[i]
      }
    }
  }
  return newobj
}

/**
 * Currency formatting
 * @param price
 * @returns {string}
 */
export function formatPrice(price) {
  if (typeof price !== 'number') return price
  return String(Number(price).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Privacy protection of mobile phone number
 * Hide the middle four digits
 * @param mobile
 * @returns {*}
 */
export function secrecyMobile(mobile) {
  mobile = String(mobile)
  if (!/\d{11}/.test(mobile)) {
    return mobile
  }
  return mobile.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')
}

/**
 * Generates a random string of the specified length
 * @param length
 * @returns {string}
 */
export function randomString(length) {
  if (!length) length = 32
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let maxPos = chars.length
  let _string = ''
  for (let i = 0; i < length; i++) {
    _string += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return _string
}

/**
 * Calculates the countdown of transmission seconds【day、when、points、seconds】
 * @param seconds
 * @returns {{day : *, hours : *, minutes : *, seconds : *}}
 */
export function countTimeDown(seconds) {
  let leftTime = function(time) {
    if (time < 10) time = '0' + time
    return time + ''
  }
  return {
    day: leftTime(parseInt(seconds / 60 / 60 / 24, 10)),
    hours: leftTime(parseInt(seconds / 60 / 60 % 24, 10)),
    minutes: leftTime(parseInt(seconds / 60 % 60, 10)),
    seconds: leftTime(parseInt(seconds % 60, 10))
  }
}

/**
 * Calculate the current time to the next day0Countdown to dot[seconds]
 * @returns {number}
 */
export function theNextDayTime() {
  let nowDate = new Date()
  let time = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 1, 0, 0, 0).getTime() - nowDate.getTime()
  return parseInt(time / 1000)
}
