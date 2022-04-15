<template>
  <div>
    <en-table-layout
      :toolbar="false"
      :tableData="tableData.data"
      :loading="loading"
    >
      <template slot="table-columns">
        <el-table-column prop="method_name" label="Method of payment"/>
        <el-table-column prop="is_retrace" label="Whether to support the original way back">
          <template slot-scope="scope">{{ scope.row.is_retrace ? 'support' : '不support' }}</template>
        </el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditPayment(scope.$index, scope.row)">configuration</el-button>
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
      :title="'Configure payment method- ' + paymentForm.method_name"
      :visible.sync="dialogPaymentVisible"
      width="35%"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :model="paymentForm" :rules="paymentRules" ref="paymentForm" label-width="140px">
        <el-form-item label="Picture of payment method" prop="image">
          <el-upload
            :action="MixinUploadApi"
            :limit="1"
            :on-remove="() => { paymentForm.image = '' }"
            :on-success="(res) => { paymentForm.image = res.url }"
            :file-list="paymentForm.image ? [{name: 'payment_image', url: paymentForm.image}] : []"
            list-type="picture">
            <el-button size="small" type="primary">upload</el-button>
            <div slot="tip" class="el-upload__tip">Recommended to uploadjpg/pngFile, and not exceeding1MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="The way back" prop="is_retrace">
          <el-radio-group v-model="paymentForm.is_retrace">
            <el-radio :label="1">support</el-radio>
            <el-radio :label="0">Does not support</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-for="(client, index) in paymentForm.enable_client">
          <el-form-item :label="client.name" prop="is_open">
            <el-radio-group v-model="client.is_open">
              <el-radio :label="1">open</el-radio>
              <el-radio :label="0">close</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="client.is_open" v-for="(config, index) in client.config_list">
            <el-form-item :label="config.text" prop="desc">
              <el-input type="textarea" v-model="config.value" :autosize="{ minRows: 1, maxRows: 4}"></el-input>
            </el-form-item>
          </template>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPaymentVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitPaymentForm('paymentForm')">save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_Payment from '@/api/payment'

  export default {
    name: 'payment',
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
        /** Payment Method Form*/
        paymentForm: {},
        /** Payment method form rules*/
        paymentRules: {},
        /** Method of paymentdialog */
        dialogPaymentVisible: false
      }
    },
    mounted() {
      this.GET_PaymentList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_PaymentList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_PaymentList()
      },

      /** Configure payment method*/
      handleEditPayment(index, row) {
        API_Payment.getPaymentDetail(row.plugin_id).then(response => {
          response.enable_client && response.enable_client.map(item => {
            if (item.is_open === null) item.is_open = 0
            return item
          })
          this.paymentForm = response
          this.dialogPaymentVisible = true
        })
      },

      /** Submit the form to modify the payment method*/
      submitPaymentForm(formName) {
        const { plugin_id } = this.paymentForm
        API_Payment.editPayment(plugin_id, this.paymentForm).then(response => {
          this.dialogPaymentVisible = false
          this.$message.success('Save success！')
          this.GET_PaymentList()
        })
      },

      /** Gets a list of payment methods*/
      GET_PaymentList() {
        this.loading = true
        API_Payment.getPaymentList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>
