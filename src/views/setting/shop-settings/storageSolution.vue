<template>
  <div>
    <en-table-layout
      :toolbar="false"
      :loading="loading"
      :tableData="tableData.data"
    >
      <template slot="table-columns">
        <el-table-column prop="name" label="Storage scheme name"/>
        <el-table-column label="enabled">
          <template slot-scope="scope">
            {{ scope.row.open === 1 ? 'Has been open' : 'closed' }}
            <el-button v-if="scope.row.open === 0" type="text" @click="handleOpenStorageSolution(scope.$index, scope.row)">open</el-button>
          </template>
        </el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.bean !== 'localPlugin'"
              size="mini"
              type="primary"
              @click="handleEditStorageSolution(scope.$index, scope.row)">edit</el-button>
          </template>
        </el-table-column>
      </template>
      <el-pagination
        slot="pagination"
        v-if="tableData"
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
      :title="'Modify storage scheme- ' + storageForm.name"
      :visible.sync="dialogStorageVisible"
      width="35%"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :model="storageForm" :rules="storageRules" ref="storageForm" label-width="140px">
        <template v-for="(config, index) in storageForm.config_items">
          <el-form-item :label="config.text">
            <el-radio-group v-if="config.type === 'radio'" v-model="config.value">
              <!--This should be dynamically generated, not write-dead-->
              <el-radio label="1">support</el-radio>
              <el-radio label="0">Does not support</el-radio>
            </el-radio-group>
            <el-input v-else placeholder="Please enter content" v-model="config.value" clearable/>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogStorageVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitStorageForm('storageForm')">save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_StorageSolution from '@/api/storageSolution'

  export default {
    name: 'storageSolution',
    data() {
      return {
        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10
        },
        tableData: '',

        /** Modify the storage scheme form*/
        storageForm: '',
        /** Modify the storage schema form rules*/
        storageRules: {},
        /** Modify storage schemedialog */
        dialogStorageVisible: false
      }
    },
    mounted() {
      this.GET_StorageSolutiontList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_StorageSolutiontList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_StorageSolutiontList()
      },

      /** Open storage scheme*/
      handleOpenStorageSolution(index, row) {
        API_StorageSolution.openStorageSolutionById(row.bean).then(response => {
          this.$message.success('Open the success！')
          this.GET_StorageSolutiontList()
        })
      },

      /** Modify storage scheme*/
      handleEditStorageSolution(index, row) {
        this.storageForm = this.MixinClone(row)
        this.dialogStorageVisible = true
      },

      /** Modify the storage scheme submission form*/
      submitStorageForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const { bean } = this.storageForm
            API_StorageSolution.editStorageSolution(bean, this.storageForm).then(response => {
              this.dialogStorageVisible = false
              this.MixinSetTableData(this.tableData, 'bean', bean, response)
              this.$message.success('Modify the success！')
            })
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },

      /** Gets a list of storage schemes*/
      GET_StorageSolutiontList() {
        this.loading = true
        API_StorageSolution.getStorageSolutionList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => (this.loading = false))
      }
    }
  }
</script>
