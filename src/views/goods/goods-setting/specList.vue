<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
      :selection-change="handleSelectionChange"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddSpecs">add</el-button>
        </div>
        <div class="toolbar-search">
          <!--<en-table-search @search="searchEvent"/>-->
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column type="selection" width="100"/>
        <!--Name-->
        <el-table-column prop="spec_name" label="Name"/>
        <!--Note-->
        <el-table-column prop="spec_memo" label="Note"/>

        <!--Operation-->
        <el-table-column label="Operation" width="350">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditSpec(scope.$index, scope.row)">edit</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleEditSpecVal(scope.$index, scope.row)">values</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteSpec(scope.$index, scope.row)">delete</el-button>
          </template>
        </el-table-column>
      </template>
      <template slot="pagination-toolbar">
        <el-button type="danger" size="mini" @click="deleteTheSpecs">Delete the selected</el-button>
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
      :title="specForm.spec_id ? 'Edit the specifications' : 'Add the specification'"
      :visible.sync="dialogSpecVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px"
    >
      <el-form :model="specForm" :rules="specRules" ref="specForm" label-width="100px">
        <!--Name-->
        <el-form-item label="Name" prop="spec_name">
          <el-input v-model="specForm.spec_name"></el-input>
        </el-form-item>
        <!--Note-->
        <el-form-item label="Note" prop="spec_memo">
          <el-input v-model="specForm.spec_memo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSpecVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitSpecForm('specForm')">save</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogSpecValuesVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="Edit specification value"
      width="500px"
      class="spec-values-dialog"
    >
      <el-select
        v-model="specValues"
        multiple
        filterable
        allow-create
        default-first-option
        no-data-text="Add value"
        placeholder="Enter to add, and not repeatable"
        :popper-append-to-body="false"
        popper-class="spec-values-popper"
        class="spec-values-select"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSpecValuesVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitSpecValuesForm">save</el-button>
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
        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10
        },

        /** The list of data*/
        tableData: '',

        /** The selected data*/
        selectedData: [],

        /** add、editdialog */
        dialogSpecVisible: false,

        /** add、Modifying the specification form*/
        specForm: {},

        /** add、Modifying Specifications Rules*/
        specRules: {
          spec_name: [
            this.MixinRequired('Please enter the name of the specification！'),
            { min: 1, max: 15, message: 'The length of1 to15 A character', trigger: 'blur' }
          ]
        },
        /** Edit specification valuedialog */
        dialogSpecValuesVisible: false,
        /** Current specification value*/
        selectedSpecValues: [],
        /** Edit specification value*/
        specValues: [],
        /** The specification of the currently modified specification valueid */
        cur_spec_id: 0
      }
    },
    mounted() {
      this.GET_SpecsList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_SpecsList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_SpecsList()
      },

      /** When the selection changes*/
      handleSelectionChange(val) {
        this.selectedData = val.map(item => item.spec_id)
      },

      /** Add a specification event trigger*/
      handleAddSpecs() {
        this.specForm = {}
        this.dialogSpecTitle = 'Add the specification'
        this.dialogSpecVisible = true
      },

      /** Modify specification events*/
      handleEditSpec(index, row) {
        this.specForm = this.MixinClone(row)
        this.dialogSpecVisible = true
      },

      /** Delete specification event*/
      handleDeleteSpec(index, row) {
        this.$confirm('Are you sure you want to delete this specification？', 'prompt', { type: 'warning' }).then(() => {
          this.DELETE_Specs(row.spec_id)
        }).catch(() => {})
      },

      /** Delete the selected*/
      deleteTheSpecs() {
        if (this.selectedData.length < 1) {
          this.$message.error('You have not selected any specifications！')
        } else {
          this.$confirm('Are you sure you want to delete these specifications？', 'prompt', { type: 'warning' }).then(() => {
            this.DELETE_Specs(this.selectedData)
          }).catch(() => {})
        }
      },

      /** Modify the specification value event*/
      handleEditSpecVal(index, row) {
        API_spec.getSpecValues(row.spec_id).then(response => {
          this.cur_spec_id = row.spec_id
          this.specValues = response.map(item => item.spec_value)
          this.dialogSpecValuesVisible = true
        })
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        this.params = {
          ...this.params,
          keyword: data
        }
        this.GET_SpecsList()
      },

      /** add、Modify the specification form submission*/
      submitSpecForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const { spec_id } = this.specForm
            if (!spec_id) {
              API_spec.addSpec(this.specForm).then(response => {
                this.dialogSpecVisible = false
                this.$message.success('Add a success！')
                this.$refs[formName].resetFields()
                this.GET_SpecsList()
              })
            } else {
              API_spec.eidtSpec(spec_id, this.specForm).then(response => {
                this.$message.success('Save success！')
                this.dialogSpecVisible = false
                this.$refs[formName].resetFields()
                this.MixinSetTableData(this.tableData, 'spec_id', spec_id, response)
              })
            }
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },

      /** Modify specification value form submission*/
      submitSpecValuesForm() {
        API_spec.saveSpecValues(this.cur_spec_id, this.specValues).then(response => {
          this.$message.success('Save success！')
          this.dialogSpecValuesVisible = false
        })
      },

      /** Get specification list*/
      GET_SpecsList() {
        this.loading = true
        API_spec.getSpecs(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => {
          this.loading = false
        })
      },

      /** Delete the specifications*/
      DELETE_Specs(ids) {
        API_spec.deleteSpecs(ids).then(response => {
          this.$message.success('Delete the success！')
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
