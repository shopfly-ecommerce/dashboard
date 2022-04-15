<template>
  <div>
    <en-table-layout
      :toolbar="false"
      :tableData="tableData.data"
      :loading="loading"
    >
      <template slot="table-columns">
        <el-table-column prop="name" label="The name of the platform"/>
        <el-table-column label="enabled">
          <template slot-scope="scope">
            {{ scope.row.open === 1 ? 'Has been open' : 'closed' }}
            <el-button v-if="scope.row.open === 0" type="text" @click="handleOpenSmsGateway(scope.$index, scope.row)">open</el-button>
          </template>
        </el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditSmsGateway(scope.$index, scope.row)">edit</el-button>
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
      title="Edit short message gateway parameters"
      :visible.sync="dialogSmsVisible"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="smsForm" size="small" label-width="120px">
        <template v-for="(config, index) in smsForm.config_items">
          <el-form-item :label="config.text" :key="config.name">
            <el-input v-model="config.value"/>
          </el-form-item>
        </template>
	      <el-form-item label="Contact person">
		      Mobile phone no.：13601952063 <br> WeChat ID：WOWjiabao
	      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSmsVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitSmsForm('smsForm')">save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_SmsGateway from '@/api/smsGateway'

  export default {
    name: 'SMSGatewaySettings',
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
        /** sms The form*/
        smsForm: { open: 0 },
        /** smsThe formdailog */
        dialogSmsVisible: false
      }
    },
    mounted() {
      this.GET_SmsGatewayList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_SmsGatewayList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_SmsGatewayList()
      },

      /** Modify SMS gateway*/
      handleEditSmsGateway(index, row) {
        this.smsForm = this.MixinClone(row)
        this.dialogSmsVisible = true
      },

      /** Open SMS gateway*/
      handleOpenSmsGateway(index, row) {
        API_SmsGateway.openSmsGatewayById(row.bean).then(response => {
          this.$message.success('Open the success！')
          this.GET_SmsGatewayList()
        })
      },

      /** Modify the SMS gateway parameter submission form*/
      submitSmsForm(formName) {
        const { bean } = this.smsForm
        API_SmsGateway.editSmsGateway(bean, this.smsForm).then(response => {
          this.dialogSmsVisible = false
          this.$message.success('Modify the success！')
          this.MixinSetTableData(this.tableData, 'bean', bean, response)
        })
      },

      /** Gets the list of SMS gateways*/
      GET_SmsGatewayList() {
        this.loading = true
        API_SmsGateway.getSmsGatewayList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>
