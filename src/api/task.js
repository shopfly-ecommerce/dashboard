/**
 * 进度相关API
 */

import request from '@/utils/request'

/**
 * 查看是否有任务正在进行
 * @param task_id
 */
export function hasTask(task_id) {
  return request({
    url: `seller/task/${task_id}`,
    method: 'get',
    message: false,
    loading: false
  })
}

/**
 * 获取进度条
 * @param task_id
 */
export function getProgressById(task_id) {
  return request({
    url: `seller/task/${task_id}/progress`,
    method: 'get',
    loading: false
  })
}

/**
 * 清除任务
 * @param task_id
 */
export function clearTask(task_id) {
  return request({
    url: `seller/task/${task_id}`,
    method: 'delete'
  })
}
