import { Foundation } from '~/ui-utils'

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }

  if ((time + '').length === 10) {
    time = +time * 1000
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    date = new Date(parseInt(time))
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['one', 'two', 'three', 'four', 'five', 'six', 'day'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return 'just'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + 'Minutes ago'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + 'Hours before'
  } else if (diff < 3600 * 24 * 2) {
    return '1Days ago,'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + 'month' + d.getDate() + 'day' + d.getHours() + 'when' + d.getMinutes() + 'points'
  }
}

/* Number formatting*/
export function nFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Monetary unit replacement2999 --> 2,999.00
 * @param val
 * @param unit
 * @returns {*}
 */
export function unitPrice(val, unit) {
  return (unit || '') + Foundation.formatPrice(val)
}

/**
 * To deal withunixTimestamp, converted to readable time format
 * @param unix
 * @param format
 * @returns {*|string}
 */
export function unixToDate(unix, format) {
  let _format = format || 'yyyy-MM-dd hh:mm:ss'
  const d = new Date(unix * 1000)
  const o = {
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'h+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
    'q+': Math.floor((d.getMonth() + 3) / 3),
    S: d.getMilliseconds()
  }
  if (/(y+)/.test(_format)) _format = _format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (const k in o) if (new RegExp('(' + k + ')').test(_format)) _format = _format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  return _format
}

/**
 * Returns the order status according to the order status code
 * @param status_code
 * @returns {string}
 */
export function unixOrderStatus(status_code) {
  switch (status_code) {
    case 'NEW':
      return 'The new orders'
    case 'INTODB_ERROR':
      return 'Storage failure'
    case 'CONFIRM':
      return 'Have been confirmed'
    case 'PAID_OFF':
      return 'Payment has been'
    case 'SHIPPED':
      return 'Has been shipped'
    case 'ROG':
      return 'Have the goods'
    case 'COMPLETE':
      return 'Has been completed'
    case 'CANCELLED':
      return 'Has been cancelled'
    case 'AFTER_SERVICE':
      return 'In the after-sale'
  }
}

/**
 * The specification of the formatted item
 * @param sku
 * @returns {*}
 */
export function formatterSkuSpec(sku) {
  if (!sku.spec_list || !sku.spec_list.length) return ''
  return sku.spec_list.map(spec => spec.spec_value).join(' - ')
}
