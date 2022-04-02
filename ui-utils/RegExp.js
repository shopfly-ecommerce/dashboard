/**
 * 各种正则表达式
 * mobile   手机号
 * email    电子邮箱
 * password 密码【6-20位】
 * integer  正整数【不包含0】
 * money    金钱
 * TINumber 纳税识别号
 * IDCard   身份证
 * userName 账户名称【汉字、字母、数字、“-”、“_”的组合】
 * URL      URL
 * TEL      固定电话
 */

// 手机号
let mobile = /^0?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/

// 电子邮箱
let email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

// 密码【6-20位 包括特殊字符】
let password = /^[A-Za-z0-9!#$%^&*.~,]{6,20}$/

// 正整数【不包含0】
let integer = /^[1-9]\d*$/

// 正整数【包含0】
let positiveInteger = /^[0-9]\d*$/

// 金钱
let money = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/

// 纳税识别号
// let TINumber = /^\d{15}$|^\d{18}$|^\d{20}$/
let TINumber = /(^[a-zA-Z0-9]{15}$)|(^[a-zA-Z0-9]{18}$)|(^[a-zA-Z0-9]{20}$)/

// 身份证
let IDCard = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/

// 账户名称【汉字、字母、数字、“-”、“_”的组合】以其开头并且匹配一个或任意多个
let userName = /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/

// URL
let URL = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|work|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/

//httpUrl
let httpUrl = /^((http)?:\/\/)[^\s]+/
// 固话
let TEL = /0\d{2,3}-\d{7,8}/

module.exports = {
  mobile: mobile,
  email: email,
  password: password,
  integer: integer,
  positiveInteger: positiveInteger,
  money: money,
  TINumber: TINumber,
  IDCard: IDCard,
  userName: userName,
  URL: URL,
  TEL: TEL,
  httpUrl:httpUrl
}
