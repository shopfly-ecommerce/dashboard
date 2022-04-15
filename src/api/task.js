/**
 * Progress of the relatedAPI
 */

import request from '@/utils/request'

/**
 * Check to see if any tasks are in progress
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
 * Get progress bar
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
 * Remove the task
 * @param task_id
 */
export function clearTask(task_id) {
  return request({
    url: `seller/task/${task_id}`,
    method: 'delete'
  })
}
