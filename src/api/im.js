import request from '@/utils/request'
import { api } from '~/ui-domain'

/**
 * To obtainIMNumber of unread messages
 * @returns {*|Promise<unknown>}
 */
export function getUnreadNum() {
  return request({
    url: api['im'] + `/seller/im/unread-num`,
    method: 'post',
    loading: false,
    needToken: true
  })
}
