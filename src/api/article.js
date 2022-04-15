/**
 * The article relatedAPI
 */

import request from '@/utils/request'

/**
 * Get article classification
 */
export function getArticleCategory(params) {
  return request({
    url: 'seller/pages/article-categories',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Gets the article classification subitem
 * @param id
 */
export function getArticleCategoryChildren(id = 0) {
  return request({
    url: `seller/pages/article-categories/${id}/children`,
    method: 'get',
    loading: false
  })
}

/**
 * Add article categories
 * @param params
 */
export function addArticleCategory(params) {
  return request({
    url: 'seller/pages/article-categories',
    method: 'post',
    data: params
  })
}

/**
 * Get article classification details
 * @param id
 */
export function getArticleCategoryDetail(id) {
  return request({
    url: `seller/pages/article-categories/${id}`,
    method: 'get'
  })
}

/**
 * Edit article classification
 * @param id
 * @param params
 */
export function editArticleCategory(id, params) {
  return request({
    url: `seller/pages/article-categories/${id}`,
    method: 'put',
    data: params
  })
}

/**
 * Delete the list of article categories
 * @param id
 */
export function deleteAritcleCategory(id) {
  return request({
    url: `seller/pages/article-categories/${id}`,
    method: 'delete'
  })
}

/**
 * Gets the article classification tree
 */
export function getAritcleCategoryTree() {
  return request({
    url: 'seller/pages/article-categories/childrens',
    method: 'get'
  })
}

/**
 * Get a list of articles
 * @param params
 */
export function getArticleList(params) {
  return request({
    url: 'seller/pages/articles',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * Add the article
 * @param params
 */
export function addArticle(params) {
  return request({
    url: 'seller/pages/articles',
    method: 'post',
    data: params
  })
}

/**
 * Get article details
 * @param id
 */
export function getArticleDetail(id) {
  return request({
    url: `seller/pages/articles/${id}`,
    method: 'get'
  })
}

/**
 * Modify the article
 * @param id
 * @param params
 */
export function editArticle(id, params) {
  return request({
    url: `seller/pages/articles/${id}`,
    method: 'put',
    data: params
  })
}

/**
 * Delete articles
 * @param id
 */
export function deleteArticle(id) {
  return request({
    url: `seller/pages/articles/${id}`,
    method: 'delete'
  })
}
