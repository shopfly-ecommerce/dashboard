<template>
  <div class="article-container">
    <el-tree
      :data="articleCategoryTree"
      :props="{children: 'children',label: 'name'}"
      @node-click="handleNodeClick"
      class="article-tree"
    />
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
      border
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns" style="line-height: 32px;font-size: 14px">
          <span>{{ articleCategoryName || 'all'}}</span>-The article lists
        </div>
        <div class="toolbar-search">
          <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="handleAddArticle">add</el-button>
          <en-table-search @search="searchEvent" placeholder="Please enter the name of the article" style="display: inline-block;margin-left: 10px"/>
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column prop="article_id" label="The articleID" width="120"/>
        <el-table-column prop="article_name" label="The article name"/>
        <el-table-column prop="category_name" label="name" width="175"/>
        <el-table-column label="Operation" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="handleEditArticle(scope.$index, scope.row)">edit</el-button>
            <el-button
              type="danger"
              @click="handleDeleteArticle(scope.$index, scope.row)">delete</el-button>
          </template>
        </el-table-column>
      </template>
      <el-pagination
        v-if="tableData"
        slot="pagination"
        @size-change="handlePageSizeChange"
        @current-change="handlePageCurrentChange"
        :current-page="tableData.page_no"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="tableData.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.data_total">
      </el-pagination>
    </en-table-layout>
  </div>
</template>

<script>
  import * as API_Article from '@/api/article'

  export default {
    name: 'articleList',
    data() {
      return {
        // In the load
        loading: false,
        // parameter
        params: {
          page_no: 1,
          page_size: 10,
          name: '',
          category_id: ''
        },
        // Tabular data
        tableData: '',
        // Article classification tree
        articleCategoryTree: [],
        // Selected category name
        articleCategoryName: ''
      }
    },
    mounted() {
      this.GET_ArticleList()
      API_Article.getAritcleCategoryTree().then(response => {
        const rmEmptyChildren = (item) => {
          if (Array.isArray(item.children) && !item.children.length) {
            delete item.children
          }
        }
        this.articleCategoryTree = response.map(item => {
          rmEmptyChildren(item)
          if (item.children) {
            item.children.map(_item => {
              rmEmptyChildren(_item)
              return _item
            })
          }
          return item
        })
      })
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_ArticleList()
      },
      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_ArticleList()
      },
      /** Add the article*/
      handleAddArticle() {
        this.$router.push({
          name: 'addArticle',
          params: {
            category: this.articleCategoryTree,
            callback: this.GET_ArticleList
          }
        })
      },
      /** Modify the article*/
      handleEditArticle(index, row) {
        this.$router.push({
          name: 'addArticle',
          params: {
            article_id: row.article_id,
            category: this.articleCategoryTree,
            callback: this.GET_ArticleList
          }
        })
      },
      /** Delete articles*/
      handleDeleteArticle(index, row) {
        this.$confirm('Are you sure you want to delete this article？', 'prompt', { type: 'warning' }).then(() => {
          API_Article.deleteArticle(row.article_id).then(() => {
            this.$message.success('Delete the success！')
            this.GET_ArticleList()
          })
        }).catch(() => {})
      },
      /** Search Event Trigger*/
      searchEvent(data) {
        this.params.name = data
        this.GET_ArticleList()
      },
      /** Choose classification*/
      handleNodeClick(data) {
        this.params.category_id = data.id
        this.GET_ArticleList()
        this.articleCategoryName = data.name
      },
      /** Get a list of articles*/
      GET_ArticleList() {
        this.loading = true
        const params = this.MixinClone(this.params)
        if (!params.name) delete params.name
        API_Article.getArticleList(params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .article-container {
    display: flex;
    padding: 10px;
    background-color: #fff;
  }
  .article-tree {
    padding: 10px;
    min-width: 200px;
    margin-right: 45px;
    margin-top: 44px;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px 0 #ccc;
  }
  /deep/ .el-form-item__content > .el-input {
    width: 220px;
  }
</style>
