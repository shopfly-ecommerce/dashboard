<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
      :selection-change="handleSelectionChange"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddSpecs">添加</el-button>
        </div>
        <div class="toolbar-search">
          <!--<en-table-search @search="searchEvent"/>-->
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column type="selection" width="100"/>
        <!--规格名称-->
        <el-table-column prop="spec_name" label="规格名称"/>
        <!--规格备注-->
        <el-table-column prop="spec_memo" label="规格备注"/>

        <!--操作-->
        <el-table-column label="操作" width="350">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditSpec(scope.$index, scope.row)">修改规格</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleEditSpecVal(scope.$index, scope.row)">修改规格值</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteSpec(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
      <template slot="pagination-toolbar">
        <el-button type="danger" size="mini" @click="deleteTheSpecs">删除选中</el-button>
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
      :title="specForm.spec_id ? '编辑规格' : '添加规格'"
      :visible.sync="dialogSpecVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px"
    >
      <el-form :model="specForm" :rules="specRules" ref="specForm" label-width="100px">
        <!--规格名称-->
        <el-form-item label="规格名称" prop="spec_name">
          <el-input v-model="specForm.spec_name"></el-input>
        </el-form-item>
        <!--规格备注-->
        <el-form-item label="规格备注" prop="spec_memo">
          <el-input v-model="specForm.spec_memo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSpecVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSpecForm('specForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogSpecValuesVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="编辑规格值"
      width="500px"
      class="spec-values-dialog"
    >
      <el-select
        v-model="specValues"
        multiple
        filterable
        allow-create
        default-first-option
        no-data-text="添加规格值"
        placeholder="输入后回车添加，且不可重复"
        :popper-append-to-body="false"
        popper-class="spec-values-popper"
        class="spec-values-select"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSpecValuesVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSpecValuesForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_spec from '@/api/goodsSetting'

  export default {
    name: 'specList',
    data() {
      return {
        /** 列表loading状态 */
        loading: false,

        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10
        },

        /** 列表数据 */
        tableData: '',

        /** 被选数据 */
        selectedData: [],

        /** 添加、修改规格 dialog */
        dialogSpecVisible: false,

        /** 添加、修改规格 表单 */
        specForm: {},

        /** 添加、修改规格 规则 */
        specRules: {
          spec_name: [
            this.MixinRequired('请输入规格名称！'),
            { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
          ]
        },
        /** 编辑规格值 dialog */
        dialogSpecValuesVisible: false,
        /** 现有规格值 */
        selectedSpecValues: [],
        /** 编辑规格值 */
        specValues: [],
        /** 当前修改规格值的规格id */
        cur_spec_id: 0
      }
    },
    mounted() {
      this.GET_SpecsList()
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_SpecsList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_SpecsList()
      },

      /** 当选择项发生变化 */
      handleSelectionChange(val) {
        this.selectedData = val.map(item => item.spec_id)
      },

      /** 添加规格事件触发 */
      handleAddSpecs() {
        this.specForm = {}
        this.dialogSpecTitle = '添加规格'
        this.dialogSpecVisible = true
      },

      /** 修改规格事件 */
      handleEditSpec(index, row) {
        this.specForm = this.MixinClone(row)
        this.dialogSpecVisible = true
      },

      /** 删除规格事件 */
      handleDeleteSpec(index, row) {
        this.$confirm('确定要删除这个规格吗？', '提示', { type: 'warning' }).then(() => {
          this.DELETE_Specs(row.spec_id)
        }).catch(() => {})
      },

      /** 删除选中 */
      deleteTheSpecs() {
        if (this.selectedData.length < 1) {
          this.$message.error('您未选中任何规格！')
        } else {
          this.$confirm('确定要删除这些规格吗？', '提示', { type: 'warning' }).then(() => {
            this.DELETE_Specs(this.selectedData)
          }).catch(() => {})
        }
      },

      /** 修改规格值事件 */
      handleEditSpecVal(index, row) {
        API_spec.getSpecValues(row.spec_id).then(response => {
          this.cur_spec_id = row.spec_id
          this.specValues = response.map(item => item.spec_value)
          this.dialogSpecValuesVisible = true
        })
      },

      /** 搜索事件触发 */
      searchEvent(data) {
        this.params = {
          ...this.params,
          keyword: data
        }
        this.GET_SpecsList()
      },

      /** 添加、修改规格 表单提交 */
      submitSpecForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const { spec_id } = this.specForm
            if (!spec_id) {
              API_spec.addSpec(this.specForm).then(response => {
                this.dialogSpecVisible = false
                this.$message.success('添加成功！')
                this.$refs[formName].resetFields()
                this.GET_SpecsList()
              })
            } else {
              API_spec.eidtSpec(spec_id, this.specForm).then(response => {
                this.$message.success('保存成功！')
                this.dialogSpecVisible = false
                this.$refs[formName].resetFields()
                this.MixinSetTableData(this.tableData, 'spec_id', spec_id, response)
              })
            }
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      },

      /** 修改规格值 表单提交 */
      submitSpecValuesForm() {
        API_spec.saveSpecValues(this.cur_spec_id, this.specValues).then(response => {
          this.$message.success('保存成功！')
          this.dialogSpecValuesVisible = false
        })
      },

      /** 获取规格列表 */
      GET_SpecsList() {
        this.loading = true
        API_spec.getSpecs(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => {
          this.loading = false
        })
      },

      /** 删除规格 */
      DELETE_Specs(ids) {
        API_spec.deleteSpecs(ids).then(response => {
          this.$message.success('删除成功！')
          this.GET_SpecsList()
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }

  .inner-toolbar {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 0 20px;
  }
  /deep/ .spec-values-dialog {
    .el-dialog__body { padding: 0 20px }
  }
  /deep/ .spec-values-select {
    width: 100%;
    .el-input__suffix, .spec-values-popper { display: none }
    .el-input--suffix .el-input__inner { padding-right: 0 }
    .el-select__tags { max-width: 100% !important; }
    .el-select__tags-text { user-select: none }
  }
</style>
