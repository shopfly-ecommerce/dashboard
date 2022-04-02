<template>
  <div>
    <en-table-layout
      :toolbar="false"
      :tableData="tableData.data"
      :loading="loading"
    >
      <template slot="table-columns">
        <el-table-column prop="method_name" label="支付方式"/>
        <el-table-column prop="is_retrace" label="是否支持原路退回">
          <template slot-scope="scope">{{ scope.row.is_retrace ? '支持' : '不支持' }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditPayment(scope.$index, scope.row)">配置</el-button>
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
      :title="'配置支付方式 - ' + paymentForm.method_name"
      :visible.sync="dialogPaymentVisible"
      width="35%"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :model="paymentForm" :rules="paymentRules" ref="paymentForm" label-width="140px">
        <el-form-item label="支付方式图片" prop="image">
          <el-upload
            :action="MixinUploadApi"
            :limit="1"
            :on-remove="() => { paymentForm.image = '' }"
            :on-success="(res) => { paymentForm.image = res.url }"
            :file-list="paymentForm.image ? [{name: 'payment_image', url: paymentForm.image}] : []"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">建议上传jpg/png文件，且不超过1MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="原路退回" prop="is_retrace">
          <el-radio-group v-model="paymentForm.is_retrace">
            <el-radio :label="1">支持</el-radio>
            <el-radio :label="0">不支持</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-for="(client, index) in paymentForm.enable_client">
          <el-form-item :label="client.name" prop="is_open">
            <el-radio-group v-model="client.is_open">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
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
        <el-button @click="dialogPaymentVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPaymentForm('paymentForm')">确 定</el-button>
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
        /** 列表loading状态 */
        loading: false,
        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10
        },
        /** 列表数据 */
        tableData: '',
        /** 支付方式 表单 */
        paymentForm: {},
        /** 支付方式 表单规则 */
        paymentRules: {},
        /** 支付方式 dialog */
        dialogPaymentVisible: false
      }
    },
    mounted() {
      this.GET_PaymentList()
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_PaymentList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_PaymentList()
      },

      /** 配置支付方式 */
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

      /** 提交修改支付方式表单 */
      submitPaymentForm(formName) {
        const { plugin_id } = this.paymentForm
        API_Payment.editPayment(plugin_id, this.paymentForm).then(response => {
          this.dialogPaymentVisible = false
          this.$message.success('保存成功！')
          this.GET_PaymentList()
        })
      },

      /** 获取支付方式列表 */
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
