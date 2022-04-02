/**
 * 文章相关API
 */

import request from '@/utils/request'

/**
 * 获取文章分类
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
 * 获取文章分类子项
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
 * 添加文章分类
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
 * 获取文章分类详情
 * @param id
 */
export function getArticleCategoryDetail(id) {
  return request({
    url: `seller/pages/article-categories/${id}`,
    method: 'get'
  })
}

/**
 * 编辑文章分类
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
 * 删除文章分类列表
 * @param id
 */
export function deleteAritcleCategory(id) {
  return request({
    url: `seller/pages/article-categories/${id}`,
    method: 'delete'
  })
}

/**
 * 获取文章分类树
 */
export function getAritcleCategoryTree() {
  return request({
    url: 'seller/pages/article-categories/childrens',
    method: 'get'
  })
}

/**
 * 获取文章列表
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
 * 添加文章
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
 * 获取文章详情
 * @param id
 */
export function getArticleDetail(id) {
  return request({
    url: `seller/pages/articles/${id}`,
    method: 'get'
  })
}

/**
 * 修改文章
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
 * 删除文章
 * @param id
 */
export function deleteArticle(id) {
  return request({
    url: `seller/pages/articles/${id}`,
    method: 'delete'
  })
}
