<template>
  <div>
    <en-table-layout
      :toolbar="false"
      :tableData="tableData.data"
      :loading="loading"
    >
      <template slot="table-columns">
        <el-table-column prop="name" label="Electronic face sheet Company"/>
        <el-table-column label="enabled">
          <template slot-scope="scope">
            {{ scope.row.open === 1 ? 'Has been open' : 'closed' }}
            <el-button v-if="scope.row.open === 0" type="text" @click="handleOpenExpressPlatform(scope.$index, scope.row)">open</el-button>
          </template>
        </el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditElectronicReceipt(scope.$index, scope.row)">Set up the</el-button>
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
      title="Electron plane setting"
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="electronicReceiptForm" label-width="100px">
        <el-form-item
          v-for="config in electronicReceiptForm.config_items"
          :key="config.name"
          :label="config.text"
        >
          <el-input v-model="config.value"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitElectronicReceiptForm">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_ElectronicReceipt from '@/api/electronicReceipt'

  export default {
    name: 'electronicReceipt',
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
        // Electronic plane sheet sets dialog
        dialogVisible: false,
        // Electronic menu setup form
        electronicReceiptForm: {}
      }
    },
    mounted() {
      this.GET_ElectronicReceiptList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_ElectronicReceiptList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_ElectronicReceiptList()
      },

      /** Modify electronic panel Settings*/
      handleEditElectronicReceipt(index, row) {
        this.electronicReceiptForm = this.MixinClone(row)
        this.dialogVisible = true
      },

      /** Set up e-face single form submission*/
      submitElectronicReceiptForm() {
        const { bean } = this.electronicReceiptForm
        API_ElectronicReceipt.editElectronicReceipt(bean, this.electronicReceiptForm).then(response => {
          this.dialogVisible = false
          this.MixinSetTableData(this.tableData, 'bean', bean, response)
          this.$message.success('Modify the success！')
        })
      },

      /** Gets the electronic surface list*/
      GET_ElectronicReceiptList() {
        this.loading = true
        API_ElectronicReceipt.getElectronicReceiptList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>
