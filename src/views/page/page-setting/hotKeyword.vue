<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddHotKeyword">add</el-button>
        </div>
      </div>

      <template slot="table-columns">
        <el-table-column prop="hot_name" label="keyword"/>
        <el-table-column prop="sort" label="sort"/>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditHotKeyword(scope.$index, scope.row)">edit</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteHotKeyword(scope.$index, scope.row)">delete</el-button>
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
      :title="(hotKeywordsForm.id ? 'edit' : 'add') + 'Hot keywords'"
      :visible.sync="dialogVisible" width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="hotKeywordsForm" :rules="hotKeywordsRules" ref="hotKeywordsForm" label-width="110px">
        <el-form-item label="Hot keywords" prop="hot_name" clearable>
          <el-input v-model="hotKeywordsForm.hot_name" :maxlength="6"></el-input>
        </el-form-item>
        <el-form-item label="sort" prop="sort">
          <el-input-number v-model="hotKeywordsForm.sort" controls-position="right" :min="1" :max="999999"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitForm('hotKeywordsForm')">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_HotKeyword from '@/api/hotKeyword'

  export default {
    name: 'hotKeyword',
    data() {
      return {
        // List loading status
        loading: false,
        // A list of parameters
        params: {
          page_no: 1,
          page_size: 10
        },
        // The list of data
        tableData: '',
        dialogVisible: false,
        // Hot keyword forms
        hotKeywordsForm: {},
        // Hot keyword form rules
        hotKeywordsRules: {
          hot_name: [this.MixinRequired('Please enter the hot keywords！')],
          sort: [this.MixinRequired('Please enter the hot keyword sorting！')]
        }
      }
    },
    mounted() {
      this.GET_HotKeywordList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_HotKeywordList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_HotKeywordList()
      },

      /** Add hot keywords*/
      handleAddHotKeyword() {
        this.hotKeywordsForm = {
          sort: 1
        }
        this.dialogVisible = true
      },

      /** Edit popular keywords*/
      handleEditHotKeyword(index, row) {
        this.hotKeywordsForm = JSON.parse(JSON.stringify(row))
        this.dialogVisible = true
      },

      /** Remove hot keywords*/
      handleDeleteHotKeyword(index, row) {
        this.$confirm('Are you sure you want to delete this hot keyword？', 'prompt', { type: 'warning' }).then(() => {
          API_HotKeyword.deleteHotKeywords(row.id).then(() => {
            this.$message.success('Delete the success！')
            this.GET_HotKeywordList()
          })
        }).catch(() => {})
      },

      /** Submit the form*/
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const { id } = this.hotKeywordsForm
            if (id) {
              API_HotKeyword.editHotKeywords(id, this.hotKeywordsForm).then(response => {
                this.dialogVisible = false
                this.$message.success('Modify the success！')
                this.MixinSetTableData(this.tableData, 'id', id, response)
              })
            } else {
              API_HotKeyword.addHotKeywords(this.hotKeywordsForm).then(() => {
                this.dialogVisible = false
                this.$message.success('Add a success！')
                this.GET_HotKeywordList()
              })
            }
          } else {
            this.$message.error('There is an error in the form. Please check it！')
            return false
          }
        })
      },

      /** Get a list of popular keywords*/
      GET_HotKeywordList() {
        this.loading = true
        API_HotKeyword.getHotKeywords(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .el-input-number {
    max-width: 120px;
  }
</style>
