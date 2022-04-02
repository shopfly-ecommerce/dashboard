<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddHotKeyword">添加</el-button>
        </div>
      </div>

      <template slot="table-columns">
        <el-table-column prop="hot_name" label="关键字"/>
        <el-table-column prop="sort" label="排序"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditHotKeyword(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteHotKeyword(scope.$index, scope.row)">删除</el-button>
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
      :title="(hotKeywordsForm.id ? '编辑' : '添加') + '热门关键字'"
      :visible.sync="dialogVisible" width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="hotKeywordsForm" :rules="hotKeywordsRules" ref="hotKeywordsForm" label-width="110px">
        <el-form-item label="热门关键字" prop="hot_name" clearable>
          <el-input v-model="hotKeywordsForm.hot_name" :maxlength="6"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="hotKeywordsForm.sort" controls-position="right" :min="1" :max="999999"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('hotKeywordsForm')">确 定</el-button>
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
        // 列表loading状态
        loading: false,
        // 列表参数
        params: {
          page_no: 1,
          page_size: 10
        },
        // 列表数据
        tableData: '',
        dialogVisible: false,
        // 热门关键字 表单
        hotKeywordsForm: {},
        // 热门关键字 表单规则
        hotKeywordsRules: {
          hot_name: [this.MixinRequired('请输入热门关键字！')],
          sort: [this.MixinRequired('请输入热门关键字排序！')]
        }
      }
    },
    mounted() {
      this.GET_HotKeywordList()
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_HotKeywordList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_HotKeywordList()
      },

      /** 添加热门关键字 */
      handleAddHotKeyword() {
        this.hotKeywordsForm = {
          sort: 1
        }
        this.dialogVisible = true
      },

      /** 编辑热门关键字 */
      handleEditHotKeyword(index, row) {
        this.hotKeywordsForm = JSON.parse(JSON.stringify(row))
        this.dialogVisible = true
      },

      /** 删除热门关键字 */
      handleDeleteHotKeyword(index, row) {
        this.$confirm('确定要删除这个热门关键字吗？', '提示', { type: 'warning' }).then(() => {
          API_HotKeyword.deleteHotKeywords(row.id).then(() => {
            this.$message.success('删除成功！')
            this.GET_HotKeywordList()
          })
        }).catch(() => {})
      },

      /** 提交表单 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const { id } = this.hotKeywordsForm
            if (id) {
              API_HotKeyword.editHotKeywords(id, this.hotKeywordsForm).then(response => {
                this.dialogVisible = false
                this.$message.success('修改成功！')
                this.MixinSetTableData(this.tableData, 'id', id, response)
              })
            } else {
              API_HotKeyword.addHotKeywords(this.hotKeywordsForm).then(() => {
                this.dialogVisible = false
                this.$message.success('添加成功！')
                this.GET_HotKeywordList()
              })
            }
          } else {
            this.$message.error('表单填写有误，请核对！')
            return false
          }
        })
      },

      /** 获取热门关键词列表 */
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
