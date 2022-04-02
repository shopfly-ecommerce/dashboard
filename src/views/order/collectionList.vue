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
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          :picker-options="{ disabledDate(time) { return time.getTime() > Date.now() }, shortcuts: MixinPickerShortcuts }">
        </el-date-picker>
        <el-button size="mini" type="primary" icon="el-icon-download" @click="handleExportCollection" style="margin-left: 5px">导出Excel</el-button>
      </div>
      <div class="toolbar-search">
        <en-table-search
          @search="searchEvent"
          @advancedSearch="advancedSearchEvent"
          advanced
          advancedWidth="465"
          placeholder="请输入订单编号"
        >
          <template slot="advanced-content">
            <el-form ref="advancedForm" :model="advancedForm" label-width="110px">
              <el-form-item label="付款人">
                <el-input size="medium" v-model="advancedForm.member_name" clearable></el-input>
              </el-form-item>
              <el-form-item label="支付方式">
                <el-select v-model="advancedForm.pay_way" placeholder="请选择" clearable>
                  <el-option label="支付宝" value="alipay"/>
                  <el-option label="微信支付" value="wechat"/>
                </el-select>
              </el-form-item>
              <el-form-item label="付款方式">
                <el-select v-model="advancedForm.payment_type" placeholder="请选择" clearable>
                  <el-option label="在线支付" value="ONLINE"/>
                  <el-option label="货到付款" value="COD"/>
                </el-select>
              </el-form-item>
              <el-form-item label="付款状态">
                <el-select v-model="advancedForm.pay_status" placeholder="请选择" clearable>
                  <el-option label="已支付" value="PAY_YES"/>
                  <el-option label="未支付" value="PAY_NO"/>
                </el-select>
              </el-form-item>
              <el-form-item label="付款日期">
                <el-date-picker
	                class="apply-time"
                  v-model="advancedForm.refund_time_range"
                  type="daterange"
                  align="center"
                  :editable="false"
                  unlink-panels
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
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
      <el-table-column prop="order_sn" label="订单号"/>
      <el-table-column label="付款方式">
        <template slot-scope="scope">{{ scope.row.pay_way === 'ONLINE' ? '在线支付' : '货到付款' }}</template>
      </el-table-column>
      <el-table-column prop="pay_type" label="支付方式"/>
      <el-table-column prop="pay_time" :formatter="MixinUnixToDate" label="付款日期"/>
      <el-table-column prop="pay_money" :formatter="MixinFormatPrice" label="付款金额"/>
      <el-table-column prop="pay_member_name" label="付款人"/>
      <el-table-column label="付款状态">
        <template slot-scope="scope">{{ scope.row.pay_status === 'PAY_YES' ? '已支付' : '未支付' }}</template>
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
        /** 列表loading状态 */
        loading: false,

        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10
        },

        /** 列表数据 */
        tableData: '',

        /** 高级搜索数据 */
        advancedForm: {
          payment_type: '',
          pay_status: ''
        },

        /** 导出Excel日期 */
        exportDateRange: []
      }
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_CollectionOrder()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_CollectionOrder()
      },

      /** 搜索事件触发 */
      searchEvent(data) {
        this.params = {
          ...this.params,
          order_sn: data
        }
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.GET_CollectionOrder()
      },

      /** 高级搜索事件触发 */
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

      /** 导出退款单 */
      handleExportCollection() {
        const range = this.MixinClone(this.exportDateRange)
        if (range.length === 0) {
          this.$message.error('请选择要导出的时间段！')
          return false
        }
        const start_time = parseInt(range[0] / 1000)
        const end_time = parseInt(range[1] / 1000)
        API_Colection.exportCollection({ start_time, end_time }).then(response => {
          const json = {
            sheet_name: '收款单',
            sheet_values: response.map(item => ({
              '订单号': item.order_sn,
              '付款方式': item.pay_way === 'COD' ? '货到付款' : '在线支付',
              '支付方式': item.pay_type,
              '付款日期': item.pay_time ? Foundation.unixToDate(item.pay_time) : '',
              '付款金额': Foundation.formatPrice(item.pay_money),
              '付款人': item.pay_member_name,
              '付款状态': item.pay_status === 'PAY_YES' ? '已支付' : '未支付'
            }))
          }
          this.MixinExportJosnToExcel(json, '收款单')
        })
      },

      /** 获取退款单列表数据 */
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

  /** 申请时间 */
  .apply-time {
	  width: 100%;
  }
</style>
