<template>
  <en-table-layout
    :tableData="tableData.data"
    :loading="loading"
  >
    <div slot="toolbar" class="inner-toolbar">
      <div class="toolbar-btns">
        <el-date-picker
          v-model="exportDateRange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="-"
          start-placeholder="Start date"
          end-placeholder="End date"
          value-format="timestamp"
          :picker-options="{ disabledDate(time) { return time.getTime() > Date.now() }, shortcuts: MixinPickerShortcuts }">
        </el-date-picker>
        <el-button size="mini" type="primary" icon="el-icon-download" @click="handleExportCollection" style="margin-left: 5px">exportExcel</el-button>
      </div>
      <div class="toolbar-search">
        <en-table-search
          @search="searchEvent"
          @advancedSearch="advancedSearchEvent"
          advanced
          advancedWidth="465"
          placeholder="Please enter the order number"
        >
          <template slot="advanced-content">
            <el-form ref="advancedForm" :model="advancedForm" label-width="110px">
              <el-form-item label="The drawee">
                <el-input size="medium" v-model="advancedForm.member_name" clearable></el-input>
              </el-form-item>
              <el-form-item label="Method of payment">
                <el-select v-model="advancedForm.pay_way" placeholder="Please select" clearable>
                  <el-option label="Alipay" value="alipay"/>
                  <el-option label="WeChat pay" value="wechat"/>
                </el-select>
              </el-form-item>
              <el-form-item label="Payment method">
                <el-select v-model="advancedForm.payment_type" placeholder="Please select" clearable>
                  <el-option label="Online payment" value="ONLINE"/>
                  <el-option label="Cash on delivery" value="COD"/>
                </el-select>
              </el-form-item>
              <el-form-item label="Payment status">
                <el-select v-model="advancedForm.pay_status" placeholder="Please select" clearable>
                  <el-option label="Have to pay" value="PAY_YES"/>
                  <el-option label="Did not pay" value="PAY_NO"/>
                </el-select>
              </el-form-item>
              <el-form-item label="Date of payment">
                <el-date-picker
	                class="apply-time"
                  v-model="advancedForm.refund_time_range"
                  type="daterange"
                  align="center"
                  :editable="false"
                  unlink-panels
                  range-separator="-"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                  value-format="timestamp"
                  :picker-options="{ disabledDate(time) { return time.getTime() > Date.now() }, shortcuts: MixinPickerShortcuts }">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </template>
        </en-table-search>
      </div>
    </div>
    <template slot="table-columns">
      <el-table-column prop="order_sn" label="The order number"/>
      <el-table-column label="Payment method">
        <template slot-scope="scope">{{ scope.row.pay_way === 'ONLINE' ? 'Online payment' : 'Cash on delivery' }}</template>
      </el-table-column>
      <el-table-column prop="pay_type" label="Method of payment"/>
      <el-table-column prop="pay_time" :formatter="MixinUnixToDate" label="Date of payment"/>
      <el-table-column prop="pay_money" :formatter="MixinFormatPrice" label="The payment amount"/>
      <el-table-column prop="pay_member_name" label="The drawee"/>
      <el-table-column label="Payment status">
        <template slot-scope="scope">{{ scope.row.pay_status === 'PAY_YES' ? 'Have to pay' : 'Did not pay' }}</template>
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
</template>

<script>
  import * as API_Colection from '@/api/collection'
  import { Foundation } from '~/ui-utils'

  export default {
    name: 'collectionList',
    mounted() {
      this.advancedSearchEvent()
    },
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

        /** Advanced search data*/
        advancedForm: {
          payment_type: '',
          pay_status: ''
        },

        /** exportExcelThe date of*/
        exportDateRange: []
      }
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_CollectionOrder()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_CollectionOrder()
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        this.params = {
          ...this.params,
          order_sn: data
        }
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.GET_CollectionOrder()
      },

      /** Advanced search event triggered*/
      advancedSearchEvent() {
        this.params = {
          ...this.params,
          ...this.advancedForm
        }
        delete this.params.start_time
        delete this.params.end_time
        if (this.advancedForm.refund_time_range) {
          this.params.start_time = parseInt(this.advancedForm.refund_time_range[0] / 1000)
          this.params.end_time = parseInt(this.advancedForm.refund_time_range[1] / 1000)
        }
        delete this.params.order_sn
        delete this.params.refund_time_range
        this.GET_CollectionOrder()
      },

      /** Export refund form*/
      handleExportCollection() {
        const range = this.MixinClone(this.exportDateRange)
        if (range.length === 0) {
          this.$message.error('Please select the time period to export！')
          return false
        }
        const start_time = parseInt(range[0] / 1000)
        const end_time = parseInt(range[1] / 1000)
        API_Colection.exportCollection({ start_time, end_time }).then(response => {
          const json = {
            sheet_name: 'voucher',
            sheet_values: response.map(item => ({
              'The order number': item.order_sn,
              'Payment method': item.pay_way === 'COD' ? 'Cash on delivery' : 'Online payment',
              'Method of payment': item.pay_type,
              'Date of payment': item.pay_time ? Foundation.unixToDate(item.pay_time) : '',
              'The payment amount': Foundation.formatPrice(item.pay_money),
              'The drawee': item.pay_member_name,
              'Payment status': item.pay_status === 'PAY_YES' ? 'Have to pay' : 'Did not pay'
            }))
          }
          this.MixinExportJosnToExcel(json, 'voucher')
        })
      },

      /** Gets the refund single column table data*/
      GET_CollectionOrder() {
        this.loading = true
        API_Colection.getCollectionList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
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

  .goods-image {
    width: 50px;
    height: 50px;
  }

  /** To apply for time*/
  .apply-time {
	  width: 100%;
  }
</style>
