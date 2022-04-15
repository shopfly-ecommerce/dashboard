<template>
  <div class="container">
    <en-table-layout
      ref="tableLayout"
      :tableData="tableData.data"
      :loading="loading"
      :stripe="false"
      row-key="id"
      border
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddCategory">add</el-button>
        </div>
        <div class="toolbar-search">
          <en-table-search @search="searchEvent"/>
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column type="expand" width="1" style="border-left: 0">
          <template slot-scope="scope">
            <en-table-layout
              v-if="scope.row.children && scope.row.children.length"
              :tableData="scope.row.children"
              :show-header="false"
              :toolbar="false"
              :pagination="false"
              :stripe="false"
              style="width: 100%"
              class="expand-table"
            >
              <template slot="table-columns">
                <el-table-column type="expand" width="1" style="border-left: 0"></el-table-column>
                <el-table-column label="" width="75">
                  <template slot-scope="scope">
                    <div class="expand">
                      <svg-icon icon-class="right-angle" class="right-angle"/>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="The article sorted">
                  <template slot-scope="scope">{{ scope.row.sort || 0 }}</template>
                </el-table-column>
                <el-table-column prop="name" label="The article classification"/>
                <el-table-column prop="type" label="Display position"/>
                <el-table-column label="Whether it can be deleted">
                  <template slot-scope="scope">{{ scope.row.allow_delete ? 'is' : 'no' }}</template>
                </el-table-column>
                <!--Operation-->
                <el-table-column label="Operation" width="150">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="primary"
                      @click="handleEditCategory(scope.$index, scope.row)">edit</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleDeleteCategory(scope.$index, scope.row)">delete</el-button>
                  </template>
                </el-table-column>
              </template>
            </en-table-layout>
          </template>
        </el-table-column>
        <el-table-column label="" width="75">
          <template slot-scope="scope">
            <div @click="() => { handleToggleExpand(scope.row) }" class="expand">
              <i :class="['el-icon', scope.row.expanded ? 'el-icon-minus' : 'el-icon-plus']"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="The article sorted">
          <template slot-scope="scope">{{ scope.row.sort || 0 }}</template>
        </el-table-column>
        <el-table-column prop="name" label="The article classification"/>
        <el-table-column prop="type" label="Display position"/>
        <el-table-column label="Whether it can be deleted">
          <template slot-scope="scope">{{ scope.row.allow_delete ? 'is' : 'no' }}</template>
        </el-table-column>
        <!--Operation-->
        <el-table-column label="Operation" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditCategory(scope.$index, scope.row)">edit</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteCategory(scope.$index, scope.row)">delete</el-button>
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
    <el-dialog
      :title="categoryForm.id ? 'Edit category' : 'Add the classification'"
      width="500px"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="categoryForm" :rules="catgoryRules" ref="categoryForm" label-width="100px">
        <!--name-->
        <el-form-item label="name" prop="name">
          <el-input v-model="categoryForm.name"></el-input>
        </el-form-item>
        <!--Parent-->
        <el-form-item v-if="parentOptions && categoryForm.parent_id !== 0" label="Parent" prop="parent_id">
          <el-select v-model="categoryForm.parent_id" placeholder="Please select the superior category">
            <el-option
              v-for="item in parentOptions"
              :label="item.name"
              :value="item.id"
              :key="item.id"
              :disabled="item.id !== 13"
            />
          </el-select>
        </el-form-item>
        <!--sort-->
        <el-form-item label="sort" prop="category_order">
          <el-input-number v-model="categoryForm.sort" controls-position="right" :min="0" :max="99999"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitCategoryForm('categoryForm')">save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_Article from '@/api/article'

  export default {
    name: 'articleCategory',
    data() {
      return {
        params: {
          page_no: 1,
          page_size: 10,
          name: ''
        },
        loading: false,
        ch_loading: false,
        tableData: '',
        /** add、Modify the category form*/
        categoryForm: {},
        /** add、Modify the classification form rules*/
        catgoryRules: {
          name: [this.MixinRequired('Please enter the name of the article category！')]
        },
        /** add、Modify the classificationdialog */
        dialogVisible: false,
        /** The parent category*/
        parentOptions: ''
      }
    },
    mounted() {
      this.GET_ArticleCategoryList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(page_size) {
        this.params.page_size = page_size
        this.GET_ArticleCategoryList()
      },
      /** The current page count has changed*/
      handlePageCurrentChange(page_no) {
        this.params.page_no = page_no
        this.GET_ArticleCategoryList()
      },
      /** anrow */
      handleToggleExpand(row) {
        if (row.children) {
          this.$refs['tableLayout'].$refs['table'].toggleRowExpansion(row)
          row.expanded = !row.expanded
          return
        }
        this.GET_ArticleCategoryChildren(row.id).then(response => {
          const expanded = !!row.expanded
          this.$set(row, 'children', response)
          this.$refs['tableLayout'].$refs['table'].toggleRowExpansion(row, !expanded)
          row.expanded = !expanded
        })
      },
      /** A list of search*/
      searchEvent(data) {
        this.params.name = data
        this.GET_ArticleCategoryList()
      },
      /** Add the classification*/
      handleAddCategory() {
        this.categoryForm = {
          parent_id: parent ? parent.id : 0,
          sort: 0
        }
        this.dialogVisible = true
      },
      /** Edit article classification*/
      handleEditCategory(index, row) {
        this.categoryForm = this.MixinClone(row)
        // this.parentOptions = parentArray
        this.dialogVisible = true
      },
      /** Delete article categories*/
      handleDeleteCategory(index, row) {
        this.$confirm('Are you sure you want to delete this article category？', 'prompt', { type: 'warning' }).then(() => {
          API_Article.deleteAritcleCategory(row.id).then(() => {
            this.$message.success('Delete the success！')
            this.handleCountExpand(row)
          })
        }).catch(() => {})
      },
      /** Submit the article category form*/
      submitCategoryForm(formName) {
        this.$refs[formName].validate((valid) => {
          const { id } = this.categoryForm
          if (id) {
            API_Article.editArticleCategory(id, this.categoryForm).then(response => {
              this.dialogVisible = false
              this.$message.success('Modify the success！')
              this.handleCountExpand(this.categoryForm)
            })
          } else {
            API_Article.addArticleCategory(this.categoryForm).then(() => {
              this.dialogVisible = false
              this.$message.success('Add a success！')
              this.handleCountExpand(this.categoryForm)
            })
          }
        })
      },
      /** Calculate expansion and load data*/
      handleCountExpand(row) {
        const { parent_id } = row
        if (parent_id) {
          const p_row = this.tableData.data.filter(item => item.id === parent_id)[0]
          this.GET_ArticleCategoryChildren(p_row.id).then(response => {
            response.expanded = p_row.expanded
            this.$set(p_row, 'children', response)
            this.$refs['tableLayout'].$refs['table'].toggleRowExpansion(p_row, !!p_row.expanded)
          })
        } else {
          this.GET_ArticleCategoryList()
        }
      },
      /** Gets a list of article categories*/
      GET_ArticleCategoryList() {
        this.loading = true
        API_Article.getArticleCategory(this.params).then(response => {
          this.tableData = response
          this.parentOptions = response.data
          this.loading = false
        }).catch(() => { this.loading = false })
      },
      /** Get article subsets*/
      GET_ArticleCategoryChildren(id) {
        this.loading = true
        return new Promise((resolve, reject) => {
          API_Article.getArticleCategoryChildren(id).then(response => {
            this.loading = false
            resolve(response)
          }).catch(() => { this.loading = false })
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .container {
    padding: 10px;
    background-color: #fff;
  }
  /deep/ {
    .right-angle {
      transform: rotate(135deg);
    }
    .el-table__expanded-cell {
      border-bottom: none;
      padding: 0;
      .container {
        padding: 0;
      }
      .el-table::before {
        display: none;
      }
      .el-table tr {
        background-color: #f5f7fa;
      }
    }
    .el-table__expand-column {
      border-right: none;
    }
    .el-table__expand-icon {
      display: none;
    }
    .expand {
      cursor: pointer;
    }
    .el-table td, .el-table th {
      border-right: none;
    }
  }
</style>
