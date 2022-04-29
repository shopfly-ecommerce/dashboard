/**
 * Various regular expressions
 * mobile   Mobile phone no.
 * email    email
 * password Password【6-20position】
 * integer  Positive integer【Does not contain0】
 * money    money
 * TINumber Tax identification number
 * IDCard   Id card
 * userName The name of the account【Chinese characters、The letter、digital、“-”、“_The combination of"】
 * URL      URL
 * TEL      Fixed telephone
 */

// Mobile phone no.
export const mobile = /^0?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/

// email
export const email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

// Password【6-20Bits include special characters】
export const password = /^[A-Za-z0-9!#$%^&*.~,]{6,20}$/

// Positive integer【Does not contain0】
export const integer = /^[1-9]\d*$/

// Positive integer【contains0】
export const positiveInteger = /^[0-9]\d*$/

// money
export const money = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/

// Tax identification number
// let TINumber = /^\d{15}$|^\d{18}$|^\d{20}$/
export const TINumber = /(^[a-zA-Z0-9]{15}$)|(^[a-zA-Z0-9]{18}$)|(^[a-zA-Z0-9]{20}$)/

// Id card
export const IDCard = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/

// The name of the account【Chinese characters、The letter、digital、“-”、“_The combination of"】Starts with it and matches one or more of them
export const userName = /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/

// URL
export const URL = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|work|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/

// httpUrl
export const httpUrl = /^((http)?:\/\/)[^\s]+/

// fixed-line
export const TEL = /0\d{2,3}-\d{7,8}/
